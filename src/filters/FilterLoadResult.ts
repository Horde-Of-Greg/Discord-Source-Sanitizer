import type { ITrackingRuleSet } from "../types/data/rules/ITrackingRuleSet.js";
import type { IFilterLoadReport } from "../types/filters/IFilterLoadReport.js";
import type { IFilterLoadResultOptions } from "../types/filters/IFilterLoadResultOptions.js";

export class FilterLoadResult {
    public readonly rules: ITrackingRuleSet;
    public readonly report: IFilterLoadReport;

    public constructor(options: IFilterLoadResultOptions) {
        this.rules = options.rules;
        this.report = options.report;
    }
}
