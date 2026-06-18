import type { SourceLine } from "../../filters/SourceLine.js";

export interface IFilterPreprocessor {
    getSourceLines(): Promise<readonly SourceLine[]>;
}
