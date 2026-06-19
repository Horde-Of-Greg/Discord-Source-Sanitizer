import type { FilterErrorAction } from "../diagnostics/FilterErrorAction.js";

export interface IFilterIssue {
    filePath: string;
    message: string;
    action: FilterErrorAction;
}
