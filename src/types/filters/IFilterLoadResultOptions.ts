import type { ITrackingRuleSet } from "../data/rules/ITrackingRuleSet.js";
import type { IFilterLoadReport } from "./IFilterLoadReport.js";

export interface IFilterLoadResultOptions {
    rules: ITrackingRuleSet;
    report: IFilterLoadReport;
}
