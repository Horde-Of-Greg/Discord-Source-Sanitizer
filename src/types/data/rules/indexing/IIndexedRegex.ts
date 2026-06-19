import type { IRuleMatch } from "./IRuleMatch.js";

export interface IIndexedRegex {
    regex: RegExp;
    match: IRuleMatch;
}
