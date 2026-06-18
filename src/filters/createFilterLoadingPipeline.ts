import { FilterFileReader } from "../data/FilterFileReader.js";
import { TrackingRuleSetBuilder } from "../data/rules/TrackingRuleSetBuilder.js";
import { FilterErrorHandler } from "./FilterErrorHandler.js";
import { FilterLoadingPipeline } from "./FilterLoadingPipeline.js";
import { FilterLoadReport } from "./FilterLoadReport.js";
import { FilterPreprocessor } from "./FilterPreprocessor.js";
import { UblockFilterLexer } from "./ublock/lexing/UblockFilterLexer.js";
import { UblockFilterParser } from "./ublock/parsing/UblockFilterParser.js";

export function createFilterLoadingPipeline(filterRoot: string): FilterLoadingPipeline {
    const report = new FilterLoadReport();
    const errors = new FilterErrorHandler(report);
    const reader = new FilterFileReader(filterRoot);
    return new FilterLoadingPipeline({
        errors,
        preprocessor: new FilterPreprocessor({ reader, errors }),
        lexer: new UblockFilterLexer(),
        parser: new UblockFilterParser(),
        builder: new TrackingRuleSetBuilder(),
        report,
    });
}
