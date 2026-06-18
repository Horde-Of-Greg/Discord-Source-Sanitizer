import type { TrackingRuleStats } from "../types/data/TrackingRuleStats.js";
import type { IFilterDiagnostic } from "../types/filters/IFilterDiagnostic.js";
import type { IFilterLoadReport } from "../types/filters/IFilterLoadReport.js";
import type { IFilterReportEntry } from "../types/filters/IFilterReportEntry.js";

export class FilterLoadReport implements IFilterLoadReport {
    private readonly counts = new Map<string, number>();
    private readonly examples = new Map<string, IFilterDiagnostic>();

    public stats?: TrackingRuleStats;

    public add(reason: string, location: string): void {
        this.counts.set(reason, (this.counts.get(reason) ?? 0) + 1);
        if (!this.examples.has(reason)) this.examples.set(reason, { reason, location });
    }

    public get ignoredCount(): number {
        let total = 0;
        for (const count of this.counts.values()) total += count;
        return total;
    }

    public entries(): IFilterReportEntry[] {
        return [...this.counts].map(([reason, count]) => ({
            reason,
            count,
            example: this.examples.get(reason)?.location ?? "",
        }));
    }
}
