import type { SourceLine } from "../../../filters/SourceLine.js";
import type { UblockOptionLexeme } from "../../../filters/ublock/lexing/UblockOptionLexeme.js";

export interface IUblockRuleLexemeOptions {
    source: SourceLine;
    isException: boolean;
    pattern: string;
    options: readonly UblockOptionLexeme[];
}
