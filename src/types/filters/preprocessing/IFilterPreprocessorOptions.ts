import type { IFilterErrorHandler } from "../diagnostics/IFilterErrorHandler.js";
import type { IFilterFileReader } from "./IFilterFileReader.js";

export interface IFilterPreprocessorOptions {
    reader: IFilterFileReader;
    errors: IFilterErrorHandler;
}
