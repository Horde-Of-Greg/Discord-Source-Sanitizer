import type { RuleIndex } from "../../../../data/rules/indexing/RuleIndex.js";
import type { CompiledUrlCondition } from "../../../../data/rules/matching/CompiledUrlCondition.js";

export interface IConditionGroup {
    condition: CompiledUrlCondition;
    index: RuleIndex;
}
