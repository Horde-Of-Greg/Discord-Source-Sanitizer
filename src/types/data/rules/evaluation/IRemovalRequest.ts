import type { RuleIndex } from "../../../../data/rules/indexing/RuleIndex.js";
import type { IParameterCandidate } from "../indexing/IParameterCandidate.js";

export interface IRemovalRequest {
    indexes: readonly RuleIndex[];
    candidate: IParameterCandidate;
}
