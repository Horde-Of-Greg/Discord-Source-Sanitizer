import type { SourceLine } from "../../filters/SourceLine.js";
import type { FilterErrorAction } from "./FilterErrorAction.js";

export interface IFilterProcessingErrorOptions {
    message: string;
    action: FilterErrorAction;
    source?: SourceLine;
}
