import type { IFilterParser } from "../../../types/filters/pipeline/IFilterParser.js";

export abstract class BaseFilterParser<TLexeme, TRule> implements IFilterParser<TLexeme, TRule> {
    public abstract parse(lexeme: TLexeme): TRule | null;
}
