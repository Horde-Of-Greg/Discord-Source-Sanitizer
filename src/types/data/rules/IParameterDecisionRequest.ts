import type { RuleIndex } from "../../../data/rules/RuleIndex.js";
import type { IEvaluationCounters } from "./IEvaluationCounters.js";

export interface IParameterDecisionRequest {
    name: string;
    value: string;
    indexes: readonly RuleIndex[];
    counters?: IEvaluationCounters;
}
