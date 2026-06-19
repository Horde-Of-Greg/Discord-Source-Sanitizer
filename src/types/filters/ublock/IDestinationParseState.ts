import type { SourceLine } from "../../../filters/preprocessing/SourceLine.js";

export interface IDestinationParseState {
    source: SourceLine;
    included: string[];
    excluded: string[];
}
