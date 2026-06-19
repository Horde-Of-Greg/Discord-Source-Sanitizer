import type { ITrackingEvaluationStats } from "../../../types/data/rules/evaluation/ITrackingEvaluationStats.js";
import type { IScopedRuleIndexesOptions } from "../../../types/data/rules/indexing/IScopedRuleIndexesOptions.js";
import type { ConditionedRuleIndex } from "./ConditionedRuleIndex.js";

export class ScopedRuleIndexes {
    private readonly hostnameCache = new Map<string, readonly ConditionedRuleIndex[]>();
    private readonly cacheLimit = 256;
    private readonly byHostname: ReadonlyMap<string, readonly ConditionedRuleIndex[]>;
    private readonly byEntity: ReadonlyMap<string, readonly ConditionedRuleIndex[]>;

    public readonly general: readonly ConditionedRuleIndex[];

    public constructor(options: IScopedRuleIndexesOptions) {
        this.byHostname = options.byHostname;
        this.byEntity = options.byEntity;
        this.general = options.general;
    }

    public resolve(hostname: string, counters?: ITrackingEvaluationStats): readonly ConditionedRuleIndex[] {
        const cached = this.hostnameCache.get(hostname);
        if (cached !== undefined) return cached;

        const resolved = this.resolveUncached(hostname);
        if (counters !== undefined) counters.hostBucketsResolved += resolved.length;
        this.cache(hostname, resolved);
        return resolved;
    }

    private resolveUncached(hostname: string): ConditionedRuleIndex[] {
        const labels = hostname.toLowerCase().split(".");
        return [...this.resolveHostnames(labels), ...this.resolveEntities(labels)];
    }

    private resolveHostnames(labels: readonly string[]): ConditionedRuleIndex[] {
        const resolved: ConditionedRuleIndex[] = [];
        for (let index = 0; index < labels.length; index++) {
            const rules = this.byHostname.get(labels.slice(index).join("."));
            if (rules !== undefined) resolved.push(...rules);
        }
        return resolved;
    }

    private resolveEntities(labels: readonly string[]): ConditionedRuleIndex[] {
        const resolved: ConditionedRuleIndex[] = [];
        for (let start = 0; start < labels.length - 1; start++) {
            for (let stop = start + 1; stop < labels.length; stop++) {
                const rules = this.byEntity.get(labels.slice(start, stop).join("."));
                if (rules !== undefined) resolved.push(...rules);
            }
        }
        return resolved;
    }

    private cache(hostname: string, rules: readonly ConditionedRuleIndex[]): void {
        if (this.hostnameCache.size >= this.cacheLimit) {
            const oldest = this.hostnameCache.keys().next().value;
            if (typeof oldest === "string") this.hostnameCache.delete(oldest);
        }
        this.hostnameCache.set(hostname, rules);
    }
}
