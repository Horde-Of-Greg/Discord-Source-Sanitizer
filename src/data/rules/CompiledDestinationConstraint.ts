import type { ConditionScope } from "../../types/data/rules/ConditionScope.js";
import { CompiledDomainMatcher } from "./CompiledDomainMatcher.js";
import type { DestinationConstraint } from "./DestinationConstraint.js";

export class CompiledDestinationConstraint {
    public readonly indexScopes?: readonly ConditionScope[];

    private readonly included: readonly CompiledDomainMatcher[];
    private readonly excluded: readonly CompiledDomainMatcher[];

    public constructor(constraint: DestinationConstraint) {
        this.included = constraint.included.map((domain) => new CompiledDomainMatcher(domain));
        this.excluded = constraint.excluded.map((domain) => new CompiledDomainMatcher(domain));
        this.indexScopes = this.createIndexScopes();
    }

    public matches(hostname: string): boolean {
        if (this.excluded.some((matcher) => matcher.matches(hostname))) return false;
        if (this.included.length === 0) return true;
        return this.included.some((matcher) => matcher.matches(hostname));
    }

    private createIndexScopes(): readonly ConditionScope[] | undefined {
        const scopes: ConditionScope[] = [];
        for (const matcher of this.included) {
            if (matcher.indexScope === undefined) return undefined;
            scopes.push(matcher.indexScope);
        }
        return scopes.length === 0 ? undefined : scopes;
    }
}
