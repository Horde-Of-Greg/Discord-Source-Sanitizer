import { FilterErrorAction } from "../../../types/filters/diagnostics/FilterErrorAction.js";
import { FilterProcessingError } from "../../diagnostics/FilterProcessingError.js";
import type { SourceLine } from "../../preprocessing/SourceLine.js";
import { UblockOptionLexeme } from "./UblockOptionLexeme.js";

export function createOptionLexeme(token: string, source: SourceLine): UblockOptionLexeme {
    if (token === "") {
        throw new FilterProcessingError({
            message: "Empty option",
            action: FilterErrorAction.Report,
            source,
        });
    }

    const separator = token.indexOf("=");
    const rawName = separator === -1 ? token : token.slice(0, separator);
    const negated = rawName.startsWith("~");
    const name = (negated ? rawName.slice(1) : rawName).toLowerCase();
    if (!/^[a-z][a-z0-9-]*$|^_$/.test(name)) {
        throw new FilterProcessingError({
            message: `Malformed option name: ${rawName}`,
            action: FilterErrorAction.Report,
            source,
        });
    }
    return new UblockOptionLexeme({
        name,
        negated,
        value: separator === -1 ? undefined : token.slice(separator + 1),
    });
}
