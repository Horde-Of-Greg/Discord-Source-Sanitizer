import type { RuleIndex } from "../../../../data/rules/indexing/RuleIndex.js";
import type { IEvaluationCounters } from "../indexing/IEvaluationCounters.js";

export interface IParameterDecisionRequest {
    name: string;
    value: string;
    indexes: readonly RuleIndex[];
    counters?: IEvaluationCounters;
}
