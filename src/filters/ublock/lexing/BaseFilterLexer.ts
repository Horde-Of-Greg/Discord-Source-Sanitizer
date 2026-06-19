import type { IFilterLexer } from "../../../types/filters/pipeline/IFilterLexer.js";
import type { SourceLine } from "../../preprocessing/SourceLine.js";

export abstract class BaseFilterLexer<TLexeme> implements IFilterLexer<TLexeme> {
    public abstract lex(source: SourceLine): TLexeme | null;
}
