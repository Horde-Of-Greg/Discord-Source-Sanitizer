import type { IRuleMatch } from "../indexing/IRuleMatch.js";

export interface IRemovalDecision {
    remove: boolean;
    match?: IRuleMatch;
}
