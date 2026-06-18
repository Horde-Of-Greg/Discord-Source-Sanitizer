import type { SourceLine } from "../../filters/SourceLine.js";

export interface IFilterLexer<TLexeme> {
    lex(source: SourceLine): TLexeme | null;
}
