import type { IUblockRuleLexemeOptions } from "../../../types/filters/ublock/IUblockRuleLexemeOptions.js";
import type { SourceLine } from "../../preprocessing/SourceLine.js";
import type { UblockOptionLexeme } from "./UblockOptionLexeme.js";

export class UblockRuleLexeme {
    public readonly source: SourceLine;
    public readonly isException: boolean;
    public readonly pattern: string;
    public readonly options: readonly UblockOptionLexeme[];

    public constructor(options: IUblockRuleLexemeOptions) {
        this.source = options.source;
        this.isException = options.isException;
        this.pattern = options.pattern;
        this.options = options.options;
    }
}
