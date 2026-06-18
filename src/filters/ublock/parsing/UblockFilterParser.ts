import { createParsedTrackingRule } from "../../../data/rules/createParsedTrackingRule.js";
import type { ParsedTrackingRule } from "../../../data/rules/ParsedTrackingRule.js";
import { CaseSensitivity } from "../../../types/data/rules/CaseSensitivity.js";
import { RuleKind } from "../../../types/data/rules/RuleKind.js";
import { RulePriority } from "../../../types/data/rules/RulePriority.js";
import { FilterErrorAction } from "../../../types/filters/FilterErrorAction.js";
import { FilterProcessingError } from "../../FilterProcessingError.js";
import type { UblockOptionLexeme } from "../lexing/UblockOptionLexeme.js";
import type { UblockRuleLexeme } from "../lexing/UblockRuleLexeme.js";
import { BaseFilterParser } from "./BaseFilterParser.js";
import { parseDestinationConstraint } from "./parseDestinationConstraint.js";
import { parseRemovalOperation } from "./parseRemovalOperation.js";

const removalOptions = new Set(["removeparam", "queryprune"]);
const ignoredOptions = new Set([
    "1p", "3p", "app", "beacon", "cname", "content", "cookie", "csp", "css", "denyallow",
    "elemhide", "ehide", "empty", "first-party", "font", "from", "frame", "generichide",
    "genericblock", "ghide", "header", "image", "inline-font", "inline-script", "ipaddress",
    "media", "mp4", "network", "network-error", "object", "object-subrequest", "other",
    "permissions", "ping", "popunder", "popup", "redirect", "redirect-rule", "removeheader",
    "replace", "responseheader", "script", "shide", "specifichide", "stylesheet", "strict1p",
    "strict3p", "subdocument", "third-party", "uritransform", "urlskip", "websocket", "webrtc",
    "xhr", "xmlhttprequest",
]);
const implementedOptions = new Set([
    "_", "all", "badfilter", "doc", "document", "domain", "important", "match-case",
    "method", "removeparam", "queryprune", "to", "urlblock",
]);

export class UblockFilterParser extends BaseFilterParser<UblockRuleLexeme, ParsedTrackingRule> {
    public parse(lexeme: UblockRuleLexeme): ParsedTrackingRule | null {
        this.assertKnownOptions(lexeme);
        if (lexeme.options.some((option) => ignoredOptions.has(option.name))) return null;
        if (!this.supportsDocumentRequest(lexeme.options)) return null;

        const removals = lexeme.options.filter((option) => removalOptions.has(option.name));
        if (removals.length > 1) return null;

        const operation = parseRemovalOperation(removals[0], lexeme.source);
        return createParsedTrackingRule({
            source: lexeme.source,
            pattern: lexeme.pattern,
            kind: lexeme.isException ? RuleKind.Exception : RuleKind.Removal,
            operation,
            domainConstraint: parseDestinationConstraint(
                this.getOptions(lexeme, "domain"),
                lexeme.source,
            ),
            destinationConstraint: parseDestinationConstraint(
                this.getOptions(lexeme, "to"),
                lexeme.source,
            ),
            caseSensitivity: this.hasOption(lexeme, "match-case")
                ? CaseSensitivity.Sensitive
                : CaseSensitivity.Insensitive,
            priority: this.hasOption(lexeme, "important")
                ? RulePriority.Important
                : RulePriority.Normal,
            badfilter: this.hasOption(lexeme, "badfilter"),
        });
    }

    private assertKnownOptions(lexeme: UblockRuleLexeme): void {
        const unknown = lexeme.options.find((option) =>
            !implementedOptions.has(option.name) && !ignoredOptions.has(option.name)
        );
        if (unknown === undefined) return;
        throw new FilterProcessingError({
            message: `Unknown option: ${unknown.name}`,
            action: FilterErrorAction.Exit,
            source: lexeme.source,
        });
    }

    private supportsDocumentRequest(options: readonly UblockOptionLexeme[]): boolean {
        const method = options.find((option) => option.name === "method");
        if (method !== undefined && !this.methodAllowsGet(method)) return false;
        return !options.some((option) =>
            (option.name === "doc" || option.name === "document" || option.name === "all")
            && option.negated
        );
    }

    private methodAllowsGet(option: UblockOptionLexeme): boolean {
        if (option.value === undefined) return false;
        const includesGet = option.value.toUpperCase().split("|").includes("GET");
        return option.negated ? !includesGet : includesGet;
    }

    private getOptions(lexeme: UblockRuleLexeme, name: string): readonly UblockOptionLexeme[] {
        return lexeme.options.filter((option) => option.name === name);
    }

    private hasOption(lexeme: UblockRuleLexeme, name: string): boolean {
        return lexeme.options.some((option) => option.name === name && !option.negated);
    }
}
