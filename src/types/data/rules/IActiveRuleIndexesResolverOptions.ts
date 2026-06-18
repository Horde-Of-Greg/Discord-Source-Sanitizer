import type { RuleIndex } from "../../../data/rules/RuleIndex.js";
import type { ScopedRuleIndexes } from "../../../data/rules/ScopedRuleIndexes.js";

export interface IActiveRuleIndexesResolverOptions {
    globalRules: RuleIndex;
    scopedRules: ScopedRuleIndexes;
}
