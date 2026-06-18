import type { ParsedTrackingRule } from "../../data/rules/ParsedTrackingRule.js";
import type { UblockRuleLexeme } from "../../filters/ublock/lexing/UblockRuleLexeme.js";
import type { ITrackingRuleSetBuilder } from "../data/rules/ITrackingRuleSetBuilder.js";
import type { IFilterErrorHandler } from "./IFilterErrorHandler.js";
import type { IFilterLexer } from "./IFilterLexer.js";
import type { IFilterLoadReport } from "./IFilterLoadReport.js";
import type { IFilterParser } from "./IFilterParser.js";
import type { IFilterPreprocessor } from "./IFilterPreprocessor.js";

export interface IFilterLoadingPipelineOptions {
    errors: IFilterErrorHandler;
    preprocessor: IFilterPreprocessor;
    lexer: IFilterLexer<UblockRuleLexeme>;
    parser: IFilterParser<UblockRuleLexeme, ParsedTrackingRule>;
    builder: ITrackingRuleSetBuilder;
    report: IFilterLoadReport;
}
