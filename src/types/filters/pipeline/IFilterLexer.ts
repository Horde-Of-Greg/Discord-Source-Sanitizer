import type { SourceLine } from "../../../filters/preprocessing/SourceLine.js";

export interface IFilterLexer<TLexeme> {
    lex(source: SourceLine): TLexeme | null;
}
