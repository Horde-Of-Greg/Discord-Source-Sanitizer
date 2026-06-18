import { CaseSensitivity } from "../../types/data/rules/CaseSensitivity.js";
import type { ConditionScope } from "../../types/data/rules/ConditionScope.js";
import type { ICompiledUrlConditionOptions } from "../../types/data/rules/ICompiledUrlConditionOptions.js";
import { CompiledDestinationConstraint } from "./CompiledDestinationConstraint.js";
import { compileNetworkPattern } from "./compileNetworkPattern.js";
import { getPatternScope } from "./getPatternScope.js";
import { getRequiredLiteral } from "./getRequiredLiteral.js";
import type { ParsedTrackingRule } from "./ParsedTrackingRule.js";

export class CompiledUrlCondition {
    public readonly scopes: readonly ConditionScope[];
    public readonly key: string;

    private readonly rule: ParsedTrackingRule;
    private readonly patternRegex?: RegExp;
    private readonly requiredLiteral?: string;
    private readonly domainConstraint?: CompiledDestinationConstraint;
    private readonly destinationConstraint?: CompiledDestinationConstraint;

    public constructor(options: ICompiledUrlConditionOptions) {
        this.rule = options.rule;
        this.patternRegex = compileNetworkPattern(this.rule.pattern, this.rule.caseSensitivity);
        this.requiredLiteral = getRequiredLiteral(this.rule.pattern);
        this.domainConstraint = this.compileConstraint(this.rule.domainConstraint);
        this.destinationConstraint = this.compileConstraint(this.rule.destinationConstraint);
        this.scopes = this.selectScopes(getPatternScope(this.rule.pattern));
        this.key = this.createKey();
    }

    public get unconditional(): boolean {
        return this.scopes.length === 1
            && this.scopes[0]?.kind === "global"
            && this.domainConstraint === undefined
            && this.destinationConstraint === undefined;
    }

    public matches(url: URL, urlWithoutHash: string): boolean {
        if (!this.matchesConstraints(url.hostname)) return false;
        if (this.patternRegex === undefined) return true;
        if (!this.containsRequiredLiteral(urlWithoutHash)) return false;
        this.patternRegex.lastIndex = 0;
        return this.patternRegex.test(urlWithoutHash);
    }

    private matchesConstraints(hostname: string): boolean {
        if (this.domainConstraint !== undefined && !this.domainConstraint.matches(hostname)) return false;
        return this.destinationConstraint === undefined || this.destinationConstraint.matches(hostname);
    }

    private containsRequiredLiteral(url: string): boolean {
        if (this.requiredLiteral === undefined) return true;
        if (this.rule.caseSensitivity === CaseSensitivity.Sensitive) {
            return url.includes(this.requiredLiteral);
        }
        return url.toLowerCase().includes(this.requiredLiteral.toLowerCase());
    }

    private selectScopes(patternScope: ConditionScope): readonly ConditionScope[] {
        if (patternScope.kind === "hostname" || patternScope.kind === "entity") return [patternScope];
        return this.getConstraintScopes() ?? [patternScope];
    }

    private getConstraintScopes(): readonly ConditionScope[] | undefined {
        const candidates = [this.domainConstraint, this.destinationConstraint]
            .map((constraint) => constraint?.indexScopes)
            .filter((scopes): scopes is readonly ConditionScope[] => scopes !== undefined);
        if (candidates.length === 0) return undefined;
        return candidates.reduce((smallest, scopes) => scopes.length < smallest.length ? scopes : smallest);
    }

    private compileConstraint(
        constraint: ParsedTrackingRule["domainConstraint"],
    ): CompiledDestinationConstraint | undefined {
        return constraint === undefined ? undefined : new CompiledDestinationConstraint(constraint);
    }

    private createKey(): string {
        return JSON.stringify({
            pattern: this.rule.pattern,
            domainConstraint: this.rule.domainConstraint,
            destinationConstraint: this.rule.destinationConstraint,
            caseSensitivity: this.rule.caseSensitivity,
        });
    }
}
