import type { FilterProcessingError } from "../../../filters/diagnostics/FilterProcessingError.js";

export interface IFilterErrorHandler {
    handle(error: FilterProcessingError): void;
    throwIfFatal(): void;
}
