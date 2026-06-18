import type { CaseSensitivity } from "./CaseSensitivity.js";
import type { IRemovalOperation } from "./IRemovalOperation.js";
import type { IRuleMatch } from "./IRuleMatch.js";

export interface IOperationIndexEntry {
    operation: IRemovalOperation;
    match: IRuleMatch;
    caseSensitivity: CaseSensitivity;
}
