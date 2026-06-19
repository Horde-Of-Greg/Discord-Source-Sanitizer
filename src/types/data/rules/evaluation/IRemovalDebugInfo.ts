import type { IRemovalDecision } from "./IRemovalDecision.js";

export interface IRemovalDebugInfo {
    url: string;
    name: string;
    value: string;
    decision: IRemovalDecision;
}
