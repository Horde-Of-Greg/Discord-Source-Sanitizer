import type { IFilterErrorHandler } from "./IFilterErrorHandler.js";
import type { IFilterFileReader } from "./IFilterFileReader.js";

export interface IFilterPreprocessorOptions {
    reader: IFilterFileReader;
    errors: IFilterErrorHandler;
}
