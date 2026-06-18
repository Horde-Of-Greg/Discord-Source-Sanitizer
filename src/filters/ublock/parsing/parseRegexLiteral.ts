import { FilterErrorAction } from "../../../types/filters/FilterErrorAction.js";
import { FilterProcessingError } from "../../FilterProcessingError.js";
import type { SourceLine } from "../../SourceLine.js";

export function parseRegexLiteral(value: string, source: SourceLine): RegExp | null {
    if (!value.startsWith("/")) return null;

    let escaped = false;
    let lastSlash = -1;
    for (let index = 1; index < value.length; index++) {
        const character = value[index];
        if (escaped) {
            escaped = false;
            continue;
        }
        if (character === "\\") {
            escaped = true;
            continue;
        }
        if (character === "/") lastSlash = index;
    }
    if (lastSlash === -1) {
        throw new FilterProcessingError({
            message: `Malformed regular expression: ${value}`,
            action: FilterErrorAction.Report,
            source,
        });
    }

    try {
        return new RegExp(value.slice(1, lastSlash), value.slice(lastSlash + 1));
    } catch (error) {
        throw new FilterProcessingError({
            message: `Invalid regular expression ${value}: ${
                error instanceof Error ? error.message : String(error)
            }`,
            action: FilterErrorAction.Report,
            source,
        });
    }
}
