import type { FilterErrorAction } from "../../types/filters/diagnostics/FilterErrorAction.js";
import type { IFilterProcessingErrorOptions } from "../../types/filters/diagnostics/IFilterProcessingErrorOptions.js";
import type { SourceLine } from "../preprocessing/SourceLine.js";

export class FilterProcessingError extends Error {
    public readonly action: FilterErrorAction;
    public readonly source?: SourceLine;

    public constructor(options: IFilterProcessingErrorOptions) {
        super(options.message);
        this.action = options.action;
        this.source = options.source;
    }

    public get diagnostic(): string {
        if (this.source === undefined) return this.message;
        return `${this.source.location}: ${this.message}`;
    }
}
