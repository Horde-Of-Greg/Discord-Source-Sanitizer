import type { FilterProcessingError } from "../../filters/FilterProcessingError.js";

export interface IFilterErrorHandler {
    handle(error: FilterProcessingError): void;
    throwIfFatal(): void;
}
