import type { ITrackingRuleSet } from "../../types/data/rules/evaluation/ITrackingRuleSet.js";
import type { IFilterLoadReport } from "../../types/filters/diagnostics/IFilterLoadReport.js";
import type { IFilterLoadResultOptions } from "../../types/filters/pipeline/IFilterLoadResultOptions.js";

export class FilterLoadResult {
    public readonly rules: ITrackingRuleSet;
    public readonly report: IFilterLoadReport;

    public constructor(options: IFilterLoadResultOptions) {
        this.rules = options.rules;
        this.report = options.report;
    }
}
