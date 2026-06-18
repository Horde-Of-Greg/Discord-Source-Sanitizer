import { FilterErrorAction } from "../../../types/filters/diagnostics/FilterErrorAction.js";
import { FilterProcessingError } from "../../diagnostics/FilterProcessingError.js";
import type { SourceLine } from "../../preprocessing/SourceLine.js";
import { BaseFilterLexer } from "./BaseFilterLexer.js";
import { createOptionLexeme } from "./createOptionLexeme.js";
import { findOptionSeparator } from "./findOptionSeparator.js";
import { splitOptions } from "./splitOptions.js";
import type { UblockOptionLexeme } from "./UblockOptionLexeme.js";
import { UblockRuleLexeme } from "./UblockRuleLexeme.js";

const relevantExceptionOptions = new Set(["document", "doc", "urlblock"]);

export class UblockFilterLexer extends BaseFilterLexer<UblockRuleLexeme> {
    public lex(source: SourceLine): UblockRuleLexeme | null {
        const line = source.text.trim();
        if (!this.isCandidate(line)) return null;

        const separator = findOptionSeparator(line);
        if (separator === -1) return null;

        const rawOptions = splitOptions(line.slice(separator + 1));
        if (rawOptions === null) {
            throw new FilterProcessingError({
                message: "Unterminated regular expression in options",
                action: FilterErrorAction.Report,
                source,
            });
        }
        const options = rawOptions.map((token) => createOptionLexeme(token.trim(), source));
        const isException = line.startsWith("@@");
        if (!this.isRelevant(options, isException)) return null;

        const rawPattern = line.slice(0, separator);
        return new UblockRuleLexeme({
            source,
            isException,
            pattern: isException ? rawPattern.slice(2) : rawPattern,
            options,
        });
    }

    private isCandidate(line: string): boolean {
        if (line === "") return false;
        if (line.startsWith("!") || line.startsWith("#") || line.startsWith("[")) return false;
        if (line.includes("removeparam") || line.includes("queryprune")) return true;
        return line.startsWith("@@")
            && /\$(?:[^,]*,)*(?:doc|document|urlblock)(?:,|$)/.test(line);
    }

    private isRelevant(
        options: readonly UblockOptionLexeme[],
        isException: boolean,
    ): boolean {
        if (options.some((option) => option.name === "removeparam" || option.name === "queryprune")) {
            return true;
        }
        return isException && options.some((option) => relevantExceptionOptions.has(option.name));
    }
}
