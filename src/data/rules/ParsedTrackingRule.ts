import type { SourceLine } from "../../filters/SourceLine.js";
import { CaseSensitivity } from "../../types/data/rules/CaseSensitivity.js";
import type { IParsedTrackingRuleOptions } from "../../types/data/rules/IParsedTrackingRuleOptions.js";
import type { IRemovalOperation } from "../../types/data/rules/IRemovalOperation.js";
import type { IRemovalOperationSemanticKey } from "../../types/data/rules/IRemovalOperationSemanticKey.js";
import type { RuleKind } from "../../types/data/rules/RuleKind.js";
import type { RulePriority } from "../../types/data/rules/RulePriority.js";
import type { DestinationConstraint } from "./DestinationConstraint.js";

export class ParsedTrackingRule {
    public readonly source: SourceLine;
    public readonly pattern: string;
    public readonly kind: RuleKind;
    public readonly operation: IRemovalOperation;
    public readonly domainConstraint?: DestinationConstraint;
    public readonly destinationConstraint?: DestinationConstraint;
    public readonly caseSensitivity: CaseSensitivity;
    public readonly priority: RulePriority;
    public readonly badfilter: boolean;

    public constructor(options: IParsedTrackingRuleOptions) {
        this.source = options.source;
        this.pattern = options.pattern;
        this.kind = options.kind;
        this.operation = options.operation;
        this.domainConstraint = options.domainConstraint;
        this.destinationConstraint = options.destinationConstraint;
        this.caseSensitivity = options.caseSensitivity;
        this.priority = options.priority;
        this.badfilter = options.badfilter;
    }

    public get semanticKey(): string {
        return JSON.stringify({
            pattern: this.pattern,
            kind: this.kind,
            operation: this.normalizedOperationKey,
            domainConstraint: this.domainConstraint,
            destinationConstraint: this.destinationConstraint,
            caseSensitivity: this.caseSensitivity,
            priority: this.priority,
        });
    }

    private get normalizedOperationKey(): object {
        const key = this.operation.semanticKey as IRemovalOperationSemanticKey;
        if (this.caseSensitivity === CaseSensitivity.Sensitive) return key;
        if (key.value !== undefined) return { ...key, value: key.value.toLowerCase() };
        if (key.flags !== undefined && !key.flags.includes("i")) return { ...key, flags: `${key.flags}i` };
        return key;
    }
}
