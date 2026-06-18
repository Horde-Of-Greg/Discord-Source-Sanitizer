import type { IRuleMatch } from "./IRuleMatch.js";

export interface IRemovalDecision {
    remove: boolean;
    match?: IRuleMatch;
}
