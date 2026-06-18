import type { IParsedTrackingRuleOptions } from "../../types/data/rules/IParsedTrackingRuleOptions.js";
import { ParsedTrackingRule } from "./ParsedTrackingRule.js";

export function createParsedTrackingRule(options: IParsedTrackingRuleOptions): ParsedTrackingRule {
    return new ParsedTrackingRule(options);
}
