import { FilterErrorAction } from "../../types/filters/diagnostics/FilterErrorAction.js";
import type { IFilterErrorHandler } from "../../types/filters/diagnostics/IFilterErrorHandler.js";
import type { IFilterLoadReport } from "../../types/filters/diagnostics/IFilterLoadReport.js";
import { FilterLoadError } from "./FilterLoadError.js";
import type { FilterProcessingError } from "./FilterProcessingError.js";

export class FilterErrorHandler implements IFilterErrorHandler {
    private readonly fatalDiagnostics: string[] = [];

    public constructor(private readonly report: IFilterLoadReport) {}

    public handle(error: FilterProcessingError): void {
        if (error.action === FilterErrorAction.Ignore) return;
        if (error.action === FilterErrorAction.Report) {
            this.report.add(error.message, error.source?.location ?? "");
            return;
        }
        this.fatalDiagnostics.push(error.diagnostic);
    }

    public throwIfFatal(): void {
        if (this.fatalDiagnostics.length > 0) throw new FilterLoadError(this.fatalDiagnostics);
    }
}
