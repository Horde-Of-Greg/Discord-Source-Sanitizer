import type { ConditionedRuleIndex } from "../../../../data/rules/indexing/ConditionedRuleIndex.js";
import type { RuleIndex } from "../../../../data/rules/indexing/RuleIndex.js";
import type { IActiveIndexRequest } from "./IActiveIndexRequest.js";

export interface IConditionActivationRequest {
    conditionedIndexes: readonly ConditionedRuleIndex[];
    request: IActiveIndexRequest;
    active: RuleIndex[];
    evaluated: Set<number>;
}
