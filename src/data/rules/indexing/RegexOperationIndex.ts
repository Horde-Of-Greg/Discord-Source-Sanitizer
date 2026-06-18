import type { IEvaluationCounters } from "../../../types/data/rules/indexing/IEvaluationCounters.js";
import type { IIndexedRegex } from "../../../types/data/rules/indexing/IIndexedRegex.js";
import type { IParameterCandidate } from "../../../types/data/rules/indexing/IParameterCandidate.js";
import type { IPrefixedIndexedRegex } from "../../../types/data/rules/indexing/IPrefixedIndexedRegex.js";
import type { IRuleMatch } from "../../../types/data/rules/indexing/IRuleMatch.js";

export class RegexOperationIndex {
    private readonly byLiteralName = new Map<string, IIndexedRegex[]>();
    private readonly byFirstCharacter = new Map<string, IPrefixedIndexedRegex[]>();
    private readonly general: IIndexedRegex[] = [];
    private readonly excluded: IIndexedRegex[] = [];

    public add(regex: RegExp, match: IRuleMatch): void {
        const literalName = this.extractLiteralName(regex);
        if (literalName !== null) {
            this.addNamed(literalName, { regex, match });
            return;
        }
        const prefix = this.extractLiteralPrefix(regex);
        if (prefix !== null) {
            this.addPrefixed(prefix, { regex, match });
            return;
        }
        this.general.push({ regex, match });
    }

    public addExclusion(regex: RegExp, match: IRuleMatch): void {
        this.excluded.push({ regex, match });
    }

    public findExcludedMatch(candidate: IParameterCandidate): IRuleMatch | undefined {
        for (const indexed of this.excluded) {
            if (!this.testIndexed(indexed, candidate)) return indexed.match;
        }
        return undefined;
    }

    public findMatch(candidate: IParameterCandidate): IRuleMatch | undefined {
        const named = this.testMany(this.byLiteralName.get(candidate.name), candidate);
        if (named !== undefined) return named;

        const prefixed = this.byFirstCharacter.get(candidate.nameValue[0]);
        if (prefixed !== undefined) {
            for (const indexed of prefixed) {
                if (!candidate.nameValue.startsWith(indexed.prefix)) continue;
                if (this.testIndexed(indexed, candidate)) return indexed.match;
            }
        }
        return this.testMany(this.general, candidate);
    }

    public get empty(): boolean {
        return this.byLiteralName.size === 0
            && this.byFirstCharacter.size === 0
            && this.general.length === 0
            && this.excluded.length === 0;
    }

    private addNamed(name: string, indexed: IIndexedRegex): void {
        const regexes = this.byLiteralName.get(name) ?? [];
        regexes.push(indexed);
        this.byLiteralName.set(name, regexes);
    }

    private addPrefixed(prefix: string, indexed: IIndexedRegex): void {
        const regexes = this.byFirstCharacter.get(prefix[0]) ?? [];
        regexes.push({ prefix, ...indexed });
        this.byFirstCharacter.set(prefix[0], regexes);
    }

    private testMany(
        regexes: readonly IIndexedRegex[] | undefined,
        candidate: IParameterCandidate,
    ): IRuleMatch | undefined {
        if (regexes === undefined) return undefined;
        for (const indexed of regexes) {
            if (this.testIndexed(indexed, candidate)) return indexed.match;
        }
        return undefined;
    }

    private testIndexed(indexed: IIndexedRegex, candidate: IParameterCandidate): boolean {
        this.increment(candidate.counters);
        indexed.regex.lastIndex = 0;
        return indexed.regex.test(candidate.nameValue);
    }

    private extractLiteralName(regex: RegExp): string | null {
        return /^\^([A-Za-z0-9_.-]+)=/.exec(regex.source)?.[1] ?? null;
    }

    private extractLiteralPrefix(regex: RegExp): string | null {
        return /^\^([A-Za-z0-9_.-]+)/.exec(regex.source)?.[1] ?? null;
    }

    private increment(counters?: IEvaluationCounters): void {
        if (counters !== undefined) counters.regexExecutions++;
    }
}
