import { DestinationConstraint } from "../../../data/rules/DestinationConstraint.js";
import { FilterErrorAction } from "../../../types/filters/FilterErrorAction.js";
import type { IDestinationParseState } from "../../../types/filters/ublock/IDestinationParseState.js";
import { FilterProcessingError } from "../../FilterProcessingError.js";
import type { SourceLine } from "../../SourceLine.js";
import type { UblockOptionLexeme } from "../lexing/UblockOptionLexeme.js";
import { parseRegexLiteral } from "./parseRegexLiteral.js";
import { splitDomainList } from "./splitDomainList.js";

export function parseDestinationConstraint(
    options: readonly UblockOptionLexeme[],
    source: SourceLine,
): DestinationConstraint | undefined {
    if (options.length === 0) return undefined;

    const state = { source, included: [], excluded: [] } satisfies IDestinationParseState;
    for (const option of options) addOptionDomains(option, state);
    return new DestinationConstraint(state);
}

function addOptionDomains(
    option: UblockOptionLexeme,
    state: IDestinationParseState,
): void {
    if (option.negated || option.value === undefined || option.value === "") {
        throw new FilterProcessingError({
            message: `Malformed ${option.name} option`,
            action: FilterErrorAction.Report,
            source: state.source,
        });
    }
    const domains = splitDomainList(option.value);
    if (domains === null) {
        throw new FilterProcessingError({
            message: `Malformed ${option.name} domain list`,
            action: FilterErrorAction.Report,
            source: state.source,
        });
    }
    for (const rawDomain of domains) addDomain(rawDomain, state);
}

function addDomain(rawDomain: string, state: IDestinationParseState): void {
    if (rawDomain === "") {
        throw new FilterProcessingError({
            message: "Empty destination domain",
            action: FilterErrorAction.Report,
            source: state.source,
        });
    }
    const value = rawDomain.replace(/^~/, "");
    const regex = parseRegexLiteral(value, state.source);
    const target = rawDomain.startsWith("~") ? state.excluded : state.included;
    target.push(regex === null ? value.toLowerCase() : value);
}
