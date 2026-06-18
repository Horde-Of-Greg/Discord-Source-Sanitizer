import type { ITrackingRuleSet } from "../../data/rules/evaluation/ITrackingRuleSet.js";
import type { IFilterLoadReport } from "../diagnostics/IFilterLoadReport.js";

export interface IFilterLoadResultOptions {
    rules: ITrackingRuleSet;
    report: IFilterLoadReport;
}
