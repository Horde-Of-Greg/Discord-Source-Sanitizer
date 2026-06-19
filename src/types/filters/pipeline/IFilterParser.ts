export interface IFilterParser<TLexeme, TRule> {
    parse(lexeme: TLexeme): TRule | null;
}
