import type { ICaseOperationIndexEntry } from "../../../types/data/rules/indexing/ICaseOperationIndexEntry.js";
import type { IParameterCandidate } from "../../../types/data/rules/indexing/IParameterCandidate.js";
import type { IRuleMatch } from "../../../types/data/rules/indexing/IRuleMatch.js";
import { CaseSensitivity } from "../../../types/data/rules/model/CaseSensitivity.js";
import { ExactRemovalOperation } from "../operations/ExactRemovalOperation.js";
import { ExceptExactRemovalOperation } from "../operations/ExceptExactRemovalOperation.js";
import { ExceptRegexRemovalOperation } from "../operations/ExceptRegexRemovalOperation.js";
import { RegexRemovalOperation } from "../operations/RegexRemovalOperation.js";
import { RemoveAllOperation } from "../operations/RemoveAllOperation.js";
import { ExactOperationIndex } from "./ExactOperationIndex.js";
import { RegexOperationIndex } from "./RegexOperationIndex.js";

export class CaseOperationIndex {
    private readonly exact = new ExactOperationIndex();
    private readonly regex = new RegexOperationIndex();

    public constructor(private readonly sensitivity: CaseSensitivity) {}

    public add(entry: ICaseOperationIndexEntry): void {
        const { operation, match } = entry;
        if (operation instanceof ExactRemovalOperation) {
            this.exact.add(this.normalize(operation.value), match);
            return;
        }
        if (operation instanceof RemoveAllOperation) {
            this.exact.setRemoveAll(match);
            return;
        }
        if (operation instanceof ExceptExactRemovalOperation) {
            this.exact.addExclusion(this.normalize(operation.value), match);
            return;
        }
        if (operation instanceof ExceptRegexRemovalOperation) {
            this.regex.addExclusion(this.normalizeRegex(operation.regex), match);
            return;
        }
        if (operation instanceof RegexRemovalOperation) {
            this.regex.add(this.normalizeRegex(operation.regex), match);
        }
    }

    public findMatch(candidate: IParameterCandidate): IRuleMatch | undefined {
        const normalized = this.normalizeCandidate(candidate);
        if (candidate.counters !== undefined) candidate.counters.exactLookups++;
        return this.exact.findMatch(normalized)
            ?? this.regex.findExcludedMatch(normalized)
            ?? this.regex.findMatch(normalized);
    }

    public get empty(): boolean {
        return this.exact.empty && this.regex.empty;
    }

    private normalizeCandidate(candidate: IParameterCandidate): IParameterCandidate {
        return {
            ...candidate,
            name: this.normalize(candidate.name),
            nameValue: this.normalize(candidate.nameValue),
        };
    }

    private normalize(value: string): string {
        return this.sensitivity === CaseSensitivity.Sensitive ? value : value.toLowerCase();
    }

    private normalizeRegex(regex: RegExp): RegExp {
        if (this.sensitivity === CaseSensitivity.Sensitive || regex.ignoreCase) return regex;
        return new RegExp(regex.source, `${regex.flags}i`);
    }
}
