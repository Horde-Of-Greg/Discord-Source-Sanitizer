import type { RuleIndex } from "../../../../data/rules/indexing/RuleIndex.js";
import type { ScopedRuleIndexes } from "../../../../data/rules/indexing/ScopedRuleIndexes.js";

export interface IActiveRuleIndexesResolverOptions {
    globalRules: RuleIndex;
    scopedRules: ScopedRuleIndexes;
}
