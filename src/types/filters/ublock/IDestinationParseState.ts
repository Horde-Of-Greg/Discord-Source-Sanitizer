import type { SourceLine } from "../../../filters/SourceLine.js";

export interface IDestinationParseState {
    source: SourceLine;
    included: string[];
    excluded: string[];
}
