import type { IParameterRemovalEvaluator } from "../../../types/data/rules/evaluation/IParameterRemovalEvaluator.js";
import type { IRemovalDecision } from "../../../types/data/rules/evaluation/IRemovalDecision.js";
import type { IRemovalRequest } from "../../../types/data/rules/evaluation/IRemovalRequest.js";
import type { IRuleMatch } from "../../../types/data/rules/indexing/IRuleMatch.js";
import type { RuleIndex } from "../indexing/RuleIndex.js";

export class ParameterRemovalEvaluator implements IParameterRemovalEvaluator {
    public evaluate(request: IRemovalRequest): IRemovalDecision {
        const important = this.findMatch(
            request.indexes,
            (index) => index.findImportantMatch(request.candidate),
        );
        if (important !== undefined) {
            return {
                remove: !request.indexes.some((index) =>
                    index.matchesImportantException(request.candidate)
                ),
                match: important,
            };
        }
        if (request.indexes.some((index) => index.matchesException(request.candidate))) {
            return { remove: false };
        }
        const normal = this.findMatch(
            request.indexes,
            (index) => index.findNormalMatch(request.candidate),
        );
        return { remove: normal !== undefined, match: normal };
    }

    private findMatch(
        indexes: readonly RuleIndex[],
        getMatch: (index: RuleIndex) => IRuleMatch | undefined,
    ): IRuleMatch | undefined {
        for (const index of indexes) {
            const match = getMatch(index);
            if (match !== undefined) return match;
        }
        return undefined;
    }
}
