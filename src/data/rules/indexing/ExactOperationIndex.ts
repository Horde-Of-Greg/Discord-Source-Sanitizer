import type { IParameterCandidate } from "../../../types/data/rules/indexing/IParameterCandidate.js";
import type { IRuleMatch } from "../../../types/data/rules/indexing/IRuleMatch.js";

export class ExactOperationIndex {
    private readonly exact = new Map<string, IRuleMatch>();
    private readonly excluded = new Map<string, IRuleMatch>();
    private removeAll?: IRuleMatch;

    public add(value: string, match: IRuleMatch): void {
        if (!this.exact.has(value)) this.exact.set(value, match);
    }

    public addExclusion(value: string, match: IRuleMatch): void {
        if (!this.excluded.has(value)) this.excluded.set(value, match);
    }

    public setRemoveAll(match: IRuleMatch): void {
        this.removeAll ??= match;
    }

    public findMatch(candidate: IParameterCandidate): IRuleMatch | undefined {
        if (this.removeAll !== undefined) return this.removeAll;
        const exact = this.exact.get(candidate.name);
        if (exact !== undefined) return exact;
        for (const [excluded, match] of this.excluded) {
            if (candidate.name !== excluded) return match;
        }
        return undefined;
    }

    public get empty(): boolean {
        return this.removeAll === undefined && this.exact.size === 0 && this.excluded.size === 0;
    }
}
