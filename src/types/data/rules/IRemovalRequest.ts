import type { RuleIndex } from "../../../data/rules/RuleIndex.js";
import type { IParameterCandidate } from "./IParameterCandidate.js";

export interface IRemovalRequest {
    indexes: readonly RuleIndex[];
    candidate: IParameterCandidate;
}
