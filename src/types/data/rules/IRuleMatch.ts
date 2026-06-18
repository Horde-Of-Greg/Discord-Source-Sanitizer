import type { RemovalOperationKind } from "./RemovalOperationKind.js";
import type { RulePriority } from "./RulePriority.js";

export interface IRuleMatch {
    source: string;
    pattern: string;
    operation: RemovalOperationKind;
    priority: RulePriority;
}
