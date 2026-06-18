import type { CaseSensitivity } from "../model/CaseSensitivity.js";
import type { IRemovalOperation } from "../operations/IRemovalOperation.js";
import type { IRuleMatch } from "./IRuleMatch.js";

export interface IOperationIndexEntry {
    operation: IRemovalOperation;
    match: IRuleMatch;
    caseSensitivity: CaseSensitivity;
}
