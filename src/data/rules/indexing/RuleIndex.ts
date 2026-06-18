import type { IParameterCandidate } from "../../../types/data/rules/indexing/IParameterCandidate.js";
import type { IRuleMatch } from "../../../types/data/rules/indexing/IRuleMatch.js";
import { RuleKind } from "../../../types/data/rules/model/RuleKind.js";
import { RulePriority } from "../../../types/data/rules/model/RulePriority.js";
import type { ParsedTrackingRule } from "../model/ParsedTrackingRule.js";
import { OperationIndex } from "./OperationIndex.js";

export class RuleIndex {
    private readonly normal = new OperationIndex();
    private readonly important = new OperationIndex();
    private readonly exceptions = new OperationIndex();
    private readonly importantExceptions = new OperationIndex();

    public add(rule: ParsedTrackingRule): void {
        this.getIndex(rule).add({
            operation: rule.operation,
            match: {
                source: rule.source.location,
                pattern: rule.pattern === "" ? "*" : rule.pattern,
                operation: rule.operation.kind,
                priority: rule.priority,
            },
            caseSensitivity: rule.caseSensitivity,
        });
    }

    public matchesException(candidate: IParameterCandidate): boolean {
        return this.exceptions.matches(candidate);
    }

    public matchesImportantException(candidate: IParameterCandidate): boolean {
        return this.importantExceptions.matches(candidate);
    }

    public findNormalMatch(candidate: IParameterCandidate): IRuleMatch | undefined {
        return this.normal.findMatch(candidate);
    }

    public findImportantMatch(candidate: IParameterCandidate): IRuleMatch | undefined {
        return this.important.findMatch(candidate);
    }

    public get empty(): boolean {
        return this.normal.empty
            && this.important.empty
            && this.exceptions.empty
            && this.importantExceptions.empty;
    }

    private getIndex(rule: ParsedTrackingRule): OperationIndex {
        if (rule.kind === RuleKind.Exception) {
            return rule.priority === RulePriority.Important
                ? this.importantExceptions
                : this.exceptions;
        }
        return rule.priority === RulePriority.Important ? this.important : this.normal;
    }
}
