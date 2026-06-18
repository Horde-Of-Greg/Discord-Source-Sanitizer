import type { IRemovalOperation } from "../operations/IRemovalOperation.js";
import type { IRuleMatch } from "./IRuleMatch.js";

export interface ICaseOperationIndexEntry {
    operation: IRemovalOperation;
    match: IRuleMatch;
}
