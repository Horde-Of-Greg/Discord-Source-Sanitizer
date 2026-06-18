import type { RulePriority } from "../model/RulePriority.js";
import type { RemovalOperationKind } from "../operations/RemovalOperationKind.js";

export interface IRuleMatch {
    source: string;
    pattern: string;
    operation: RemovalOperationKind;
    priority: RulePriority;
}
