import type { SourceLine } from "../../../filters/preprocessing/SourceLine.js";

export interface IFilterPreprocessor {
    getSourceLines(): Promise<readonly SourceLine[]>;
}
