import type { ConditionScope } from "../../types/data/rules/ConditionScope.js";
import type { IRuleBucketEntry } from "../../types/data/rules/IRuleBucketEntry.js";
import type { ConditionedRuleIndex } from "./ConditionedRuleIndex.js";
import { ScopedRuleIndexes } from "./ScopedRuleIndexes.js";

export class RuleScopeRegistry {
    private readonly byHostname = new Map<string, ConditionedRuleIndex[]>();
    private readonly byEntity = new Map<string, ConditionedRuleIndex[]>();
    private readonly general: ConditionedRuleIndex[] = [];

    public register(
        conditioned: ConditionedRuleIndex,
        scopes: readonly ConditionScope[],
    ): void {
        for (const scope of scopes) this.registerScope(conditioned, scope);
    }

    public build(): ScopedRuleIndexes {
        return new ScopedRuleIndexes({
            byHostname: this.byHostname,
            byEntity: this.byEntity,
            general: this.general,
        });
    }

    public get hostnameBucketCount(): number {
        return this.byHostname.size;
    }

    public get entityBucketCount(): number {
        return this.byEntity.size;
    }

    public get generalConditionCount(): number {
        return this.general.length;
    }

    private registerScope(conditioned: ConditionedRuleIndex, scope: ConditionScope): void {
        if (scope.kind === "hostname") {
            this.addToBucket(this.byHostname, { key: scope.value, conditioned });
            return;
        }
        if (scope.kind === "entity") {
            this.addToBucket(this.byEntity, { key: scope.value, conditioned });
            return;
        }
        this.general.push(conditioned);
    }

    private addToBucket(
        buckets: Map<string, ConditionedRuleIndex[]>,
        entry: IRuleBucketEntry,
    ): void {
        const bucket = buckets.get(entry.key) ?? [];
        bucket.push(entry.conditioned);
        buckets.set(entry.key, bucket);
    }
}
