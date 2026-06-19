import type { IIndexedRegex } from "./IIndexedRegex.js";

export interface IPrefixedIndexedRegex extends IIndexedRegex {
    prefix: string;
}
