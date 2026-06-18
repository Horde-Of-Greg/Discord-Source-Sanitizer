import type { IFilterLexer } from "../../../types/filters/IFilterLexer.js";
import type { SourceLine } from "../../SourceLine.js";

export abstract class BaseFilterLexer<TLexeme> implements IFilterLexer<TLexeme> {
    public abstract lex(source: SourceLine): TLexeme | null;
}
