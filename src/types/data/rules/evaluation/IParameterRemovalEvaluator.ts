import type { IRemovalDecision } from "./IRemovalDecision.js";
import type { IRemovalRequest } from "./IRemovalRequest.js";

export interface IParameterRemovalEvaluator {
    evaluate(request: IRemovalRequest): IRemovalDecision;
}
