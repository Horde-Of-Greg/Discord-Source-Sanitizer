import type { TrackingRuleStats } from "../data/TrackingRuleStats.js";
import type { IFilterReportEntry } from "./IFilterReportEntry.js";

export interface IFilterLoadReport {
    stats?: TrackingRuleStats;

    add(reason: string, location: string): void;
    readonly ignoredCount: number;
    entries(): IFilterReportEntry[];
}
