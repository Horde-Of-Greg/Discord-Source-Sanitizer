import type { RuleIndex } from "../../../data/rules/RuleIndex.js";
import type { IActiveIndexRequest } from "./IActiveIndexRequest.js";

export interface IActiveRuleIndexesResolver {
    resolve(request: IActiveIndexRequest): readonly RuleIndex[];
}
