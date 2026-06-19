import type { IOperationIndexEntry } from "../../../types/data/rules/indexing/IOperationIndexEntry.js";
import type { IParameterCandidate } from "../../../types/data/rules/indexing/IParameterCandidate.js";
import type { IRuleMatch } from "../../../types/data/rules/indexing/IRuleMatch.js";
import { CaseSensitivity } from "../../../types/data/rules/model/CaseSensitivity.js";
import { CaseOperationIndex } from "./CaseOperationIndex.js";

export class OperationIndex {
    private readonly insensitive = new CaseOperationIndex(CaseSensitivity.Insensitive);
    private readonly sensitive = new CaseOperationIndex(CaseSensitivity.Sensitive);

    public add(entry: IOperationIndexEntry): void {
        this.getIndex(entry.caseSensitivity).add(entry);
    }

    public matches(candidate: IParameterCandidate): boolean {
        return this.findMatch(candidate) !== undefined;
    }

    public findMatch(candidate: IParameterCandidate): IRuleMatch | undefined {
        const sensitiveMatch = this.sensitive.empty
            ? undefined
            : this.sensitive.findMatch(candidate);
        if (sensitiveMatch !== undefined) return sensitiveMatch;
        return this.insensitive.empty ? undefined : this.insensitive.findMatch(candidate);
    }

    public get empty(): boolean {
        return this.sensitive.empty && this.insensitive.empty;
    }

    private getIndex(sensitivity: CaseSensitivity): CaseOperationIndex {
        return sensitivity === CaseSensitivity.Sensitive ? this.sensitive : this.insensitive;
    }
}
