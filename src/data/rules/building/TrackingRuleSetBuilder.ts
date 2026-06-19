import type { IConditionGroup } from "../../../types/data/rules/building/IConditionGroup.js";
import type { ITrackingRuleSetBuilder } from "../../../types/data/rules/building/ITrackingRuleSetBuilder.js";
import type { ITrackingRuleSetBuilderOptions } from "../../../types/data/rules/building/ITrackingRuleSetBuilderOptions.js";
import { ParameterRemovalEvaluator } from "../evaluation/ParameterRemovalEvaluator.js";
import { TrackingRuleSet } from "../evaluation/TrackingRuleSet.js";
import { ActiveRuleIndexesResolver } from "../indexing/ActiveRuleIndexesResolver.js";
import { ConditionedRuleIndex } from "../indexing/ConditionedRuleIndex.js";
import { RuleIndex } from "../indexing/RuleIndex.js";
import { RuleScopeRegistry } from "../indexing/RuleScopeRegistry.js";
import { CompiledUrlCondition } from "../matching/CompiledUrlCondition.js";
import type { ParsedTrackingRule } from "../model/ParsedTrackingRule.js";

export class TrackingRuleSetBuilder implements ITrackingRuleSetBuilder {
    private readonly rules: ParsedTrackingRule[] = [];

    public add(rule: ParsedTrackingRule): void {
        this.rules.push(rule);
    }

    public build(options: ITrackingRuleSetBuilderOptions): TrackingRuleSet {
        const uniqueRules = this.getUniqueRules();
        const globalRules = new RuleIndex();
        const groups = this.createConditionGroups(uniqueRules, globalRules);
        const scopes = this.registerConditionGroups(groups);

        return new TrackingRuleSet({
            indexes: new ActiveRuleIndexesResolver({
                globalRules,
                scopedRules: scopes.build(),
            }),
            evaluator: new ParameterRemovalEvaluator(),
            stats: {
                sourceRules: this.rules.length,
                mergedRules: uniqueRules.size,
                ignoredRules: options.ignoredRules,
                globalConditionGroups: globalRules.empty ? 0 : 1,
                hostnameBuckets: scopes.hostnameBucketCount,
                entityBuckets: scopes.entityBucketCount,
                generalConditionGroups: scopes.generalConditionCount,
            },
        });
    }

    private getUniqueRules(): Map<string, ParsedTrackingRule> {
        const badfilterKeys = new Set(
            this.rules.filter((rule) => rule.badfilter).map((rule) => rule.semanticKey),
        );
        const unique = new Map<string, ParsedTrackingRule>();
        for (const rule of this.rules) {
            if (rule.badfilter || badfilterKeys.has(rule.semanticKey)) continue;
            unique.set(rule.semanticKey, rule);
        }
        return unique;
    }

    private createConditionGroups(
        rules: ReadonlyMap<string, ParsedTrackingRule>,
        globalRules: RuleIndex,
    ): ReadonlyMap<string, IConditionGroup> {
        const groups = new Map<string, IConditionGroup>();
        for (const rule of rules.values()) {
            const condition = new CompiledUrlCondition({ rule });
            if (condition.unconditional) {
                globalRules.add(rule);
                continue;
            }
            const group = groups.get(condition.key) ?? { condition, index: new RuleIndex() };
            group.index.add(rule);
            groups.set(condition.key, group);
        }
        return groups;
    }

    private registerConditionGroups(groups: ReadonlyMap<string, IConditionGroup>): RuleScopeRegistry {
        const registry = new RuleScopeRegistry();
        let id = 0;
        for (const group of groups.values()) {
            const conditioned = new ConditionedRuleIndex({
                id: id++,
                condition: group.condition,
                rules: group.index,
            });
            registry.register(conditioned, group.condition.scopes);
        }
        return registry;
    }
}
