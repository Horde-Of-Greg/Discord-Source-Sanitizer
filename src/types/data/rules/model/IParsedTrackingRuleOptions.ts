import type { DestinationConstraint } from "../../../../data/rules/model/DestinationConstraint.js";
import type { SourceLine } from "../../../../filters/preprocessing/SourceLine.js";
import type { IRemovalOperation } from "../operations/IRemovalOperation.js";
import type { CaseSensitivity } from "./CaseSensitivity.js";
import type { RuleKind } from "./RuleKind.js";
import type { RulePriority } from "./RulePriority.js";

export interface IParsedTrackingRuleOptions {
    source: SourceLine;
    pattern: string;
    kind: RuleKind;
    operation: IRemovalOperation;
    domainConstraint?: DestinationConstraint;
    destinationConstraint?: DestinationConstraint;
    caseSensitivity: CaseSensitivity;
    priority: RulePriority;
    badfilter: boolean;
}
