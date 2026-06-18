import type { ParsedTrackingRule } from "../data/rules/ParsedTrackingRule.js";
import type { ITrackingRuleSetBuilder } from "../types/data/rules/ITrackingRuleSetBuilder.js";
import type { IFilterErrorHandler } from "../types/filters/IFilterErrorHandler.js";
import type { IFilterLexer } from "../types/filters/IFilterLexer.js";
import type { IFilterLoadingPipeline } from "../types/filters/IFilterLoadingPipeline.js";
import type { IFilterLoadingPipelineOptions } from "../types/filters/IFilterLoadingPipelineOptions.js";
import type { IFilterLoadReport } from "../types/filters/IFilterLoadReport.js";
import type { IFilterParser } from "../types/filters/IFilterParser.js";
import type { IFilterPreprocessor } from "../types/filters/IFilterPreprocessor.js";
import { FilterLoadResult } from "./FilterLoadResult.js";
import { FilterProcessingError } from "./FilterProcessingError.js";
import type { UblockRuleLexeme } from "./ublock/lexing/UblockRuleLexeme.js";

export class FilterLoadingPipeline implements IFilterLoadingPipeline {
    private readonly errors: IFilterErrorHandler;
    private readonly preprocessor: IFilterPreprocessor;
    private readonly lexer: IFilterLexer<UblockRuleLexeme>;
    private readonly parser: IFilterParser<UblockRuleLexeme, ParsedTrackingRule>;
    private readonly builder: ITrackingRuleSetBuilder;
    private readonly report: IFilterLoadReport;

    public constructor(options: IFilterLoadingPipelineOptions) {
        this.errors = options.errors;
        this.preprocessor = options.preprocessor;
        this.lexer = options.lexer;
        this.parser = options.parser;
        this.builder = options.builder;
        this.report = options.report;
    }

    public async load(): Promise<FilterLoadResult> {
        for (const source of await this.preprocessor.getSourceLines()) {
            try {
                const lexeme = this.lexer.lex(source);
                if (lexeme === null) continue;
                const rule = this.parser.parse(lexeme);
                if (rule !== null) this.builder.add(rule);
            } catch (error) {
                this.handleError(error);
            }
        }
        this.errors.throwIfFatal();
        const rules = this.builder.build({ ignoredRules: this.report.ignoredCount });
        this.report.stats = rules.stats;
        return new FilterLoadResult({ rules, report: this.report });
    }

    private handleError(error: unknown): void {
        if (error instanceof FilterProcessingError) {
            this.errors.handle(error);
            return;
        }
        throw error;
    }
}
