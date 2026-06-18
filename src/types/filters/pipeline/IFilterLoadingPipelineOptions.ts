import type { ParsedTrackingRule } from "../../../data/rules/model/ParsedTrackingRule.js";
import type { UblockRuleLexeme } from "../../../filters/ublock/lexing/UblockRuleLexeme.js";
import type { ITrackingRuleSetBuilder } from "../../data/rules/building/ITrackingRuleSetBuilder.js";
import type { IFilterErrorHandler } from "../diagnostics/IFilterErrorHandler.js";
import type { IFilterLoadReport } from "../diagnostics/IFilterLoadReport.js";
import type { IFilterPreprocessor } from "../preprocessing/IFilterPreprocessor.js";
import type { IFilterLexer } from "./IFilterLexer.js";
import type { IFilterParser } from "./IFilterParser.js";

export interface IFilterLoadingPipelineOptions {
    errors: IFilterErrorHandler;
    preprocessor: IFilterPreprocessor;
    lexer: IFilterLexer<UblockRuleLexeme>;
    parser: IFilterParser<UblockRuleLexeme, ParsedTrackingRule>;
    builder: ITrackingRuleSetBuilder;
    report: IFilterLoadReport;
}
