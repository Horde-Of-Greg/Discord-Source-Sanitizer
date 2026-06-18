import type { SourceLine } from "../../../filters/preprocessing/SourceLine.js";

export interface IContentLinesRequest {
    filePath: string;
    content: string;
    lines: SourceLine[];
}
