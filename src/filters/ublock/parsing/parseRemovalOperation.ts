import type { BaseRemovalOperation } from "../../../data/rules/operations/BaseRemovalOperation.js";
import { ExactRemovalOperation } from "../../../data/rules/operations/ExactRemovalOperation.js";
import { ExceptExactRemovalOperation } from "../../../data/rules/operations/ExceptExactRemovalOperation.js";
import { ExceptRegexRemovalOperation } from "../../../data/rules/operations/ExceptRegexRemovalOperation.js";
import { RegexRemovalOperation } from "../../../data/rules/operations/RegexRemovalOperation.js";
import { RemoveAllOperation } from "../../../data/rules/operations/RemoveAllOperation.js";
import { FilterErrorAction } from "../../../types/filters/diagnostics/FilterErrorAction.js";
import { FilterProcessingError } from "../../diagnostics/FilterProcessingError.js";
import type { SourceLine } from "../../preprocessing/SourceLine.js";
import type { UblockOptionLexeme } from "../lexing/UblockOptionLexeme.js";
import { parseRegexLiteral } from "./parseRegexLiteral.js";

export function parseRemovalOperation(
    option: UblockOptionLexeme | undefined,
    source: SourceLine,
): BaseRemovalOperation {
    if (option === undefined) return new RemoveAllOperation();
    if (option.negated) {
        throw new FilterProcessingError({
            message: `Negating ${option.name} itself is not supported`,
            action: FilterErrorAction.Report,
            source,
        });
    }
    if (option.value === undefined) return new RemoveAllOperation();
    if (option.value === "") {
        throw new FilterProcessingError({
            message: `${option.name}= requires a value`,
            action: FilterErrorAction.Report,
            source,
        });
    }

    const inverted = option.value.startsWith("~");
    const rawValue = inverted ? option.value.slice(1) : option.value;
    const regex = parseRegexLiteral(rawValue, source);
    if (regex !== null) {
        return inverted
            ? new ExceptRegexRemovalOperation(regex, rawValue)
            : new RegexRemovalOperation(regex, rawValue);
    }

    let decoded: string;
    try {
        decoded = decodeURIComponent(rawValue);
    } catch {
        throw new FilterProcessingError({
            message: `Invalid percent encoding in removal value: ${rawValue}`,
            action: FilterErrorAction.Report,
            source,
        });
    }
    return inverted
        ? new ExceptExactRemovalOperation(decoded)
        : new ExactRemovalOperation(decoded);
}
