import type { RuleIndex } from "../../../../data/rules/indexing/RuleIndex.js";
import type { IActiveIndexRequest } from "./IActiveIndexRequest.js";

export interface IActiveRuleIndexesResolver {
    resolve(request: IActiveIndexRequest): readonly RuleIndex[];
}
