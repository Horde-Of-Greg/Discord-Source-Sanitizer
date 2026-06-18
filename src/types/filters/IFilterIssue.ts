import type { FilterErrorAction } from "./FilterErrorAction.js";

export interface IFilterIssue {
    filePath: string;
    message: string;
    action: FilterErrorAction;
}
