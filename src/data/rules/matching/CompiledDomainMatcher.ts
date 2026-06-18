import type { ConditionScope } from "../../../types/data/rules/matching/ConditionScope.js";

export class CompiledDomainMatcher {
    public readonly indexScope?: ConditionScope;

    private readonly regex?: RegExp;
    private readonly entity?: string;

    public constructor(private readonly domain: string) {
        if (domain.startsWith("/") && domain.lastIndexOf("/") > 0) {
            const lastSlash = domain.lastIndexOf("/");
            this.regex = new RegExp(domain.slice(1, lastSlash), domain.slice(lastSlash + 1));
            return;
        }
        if (domain.endsWith(".*") && !domain.slice(0, -2).includes("*")) {
            this.entity = domain.slice(0, -2);
            this.indexScope = { kind: "entity", value: this.entity };
            return;
        }
        if (!domain.includes("*")) this.indexScope = { kind: "hostname", value: domain };
    }

    public matches(hostname: string): boolean {
        if (this.regex !== undefined) {
            this.regex.lastIndex = 0;
            return this.regex.test(hostname);
        }
        if (this.entity !== undefined) {
            return hostname === this.entity
                || hostname.includes(`.${this.entity}.`)
                || hostname.startsWith(`${this.entity}.`);
        }
        return hostname === this.domain || hostname.endsWith(`.${this.domain}`);
    }
}
