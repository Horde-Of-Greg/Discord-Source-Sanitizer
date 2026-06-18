import type { IEvaluationCounters } from "./IEvaluationCounters.js";

export interface IParameterCandidate {
    name: string;
    nameValue: string;
    counters?: IEvaluationCounters;
}
