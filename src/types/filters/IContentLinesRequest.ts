import type { SourceLine } from "../../filters/SourceLine.js";

export interface IContentLinesRequest {
    filePath: string;
    content: string;
    lines: SourceLine[];
}
