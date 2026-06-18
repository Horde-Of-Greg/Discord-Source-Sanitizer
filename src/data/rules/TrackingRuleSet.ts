import type { IActiveRuleIndexesResolver } from "../../types/data/rules/IActiveRuleIndexesResolver.js";
import type { IParameterDecisionRequest } from "../../types/data/rules/IParameterDecisionRequest.js";
import type { IParameterRemovalEvaluator } from "../../types/data/rules/IParameterRemovalEvaluator.js";
import type { IRemovalDebugInfo } from "../../types/data/rules/IRemovalDebugInfo.js";
import type { IRemovalDecision } from "../../types/data/rules/IRemovalDecision.js";
import type { ITrackingEvaluationStats } from "../../types/data/rules/ITrackingEvaluationStats.js";
import type { ITrackingRuleSet } from "../../types/data/rules/ITrackingRuleSet.js";
import type { ITrackingRuleSetOptions } from "../../types/data/rules/ITrackingRuleSetOptions.js";
import type { TrackingRuleStats } from "../../types/data/TrackingRuleStats.js";
import { withoutUrlHash } from "./withoutUrlHash.js";

export class TrackingRuleSet implements ITrackingRuleSet {
    private readonly indexes: IActiveRuleIndexesResolver;
    private readonly evaluator: IParameterRemovalEvaluator;

    public readonly stats: TrackingRuleStats;

    public constructor(options: ITrackingRuleSetOptions) {
        this.indexes = options.indexes;
        this.evaluator = options.evaluator;
        this.stats = options.stats;
    }

    public sanitize(url: URL, counters?: ITrackingEvaluationStats): boolean {
        if (url.search === "") return false;

        const urlWithoutHash = withoutUrlHash(url);
        const indexes = this.indexes.resolve({ url, urlWithoutHash, counters });
        const retained = new URLSearchParams();
        const decisions = new Map<string, IRemovalDecision>();
        let changed = false;

        for (const [name, value] of url.searchParams) {
            const decision = this.getDecision({ name, value, indexes, counters }, decisions);
            if (decision.remove) {
                this.debugRemoval({ url: urlWithoutHash, name, value, decision });
                changed = true;
                continue;
            }
            retained.append(name, value);
        }
        if (changed) url.search = retained.toString();
        return changed;
    }

    private getDecision(
        request: IParameterDecisionRequest,
        decisions: Map<string, IRemovalDecision>,
    ): IRemovalDecision {
        const key = `${request.name}\u0000${request.value}`;
        const cached = decisions.get(key);
        if (cached !== undefined) return cached;

        const decision = this.evaluator.evaluate({
            indexes: request.indexes,
            candidate: {
                name: request.name,
                nameValue: `${request.name}=${request.value}`,
                counters: request.counters,
            },
        });
        decisions.set(key, decision);
        return decision;
    }

    private debugRemoval(info: IRemovalDebugInfo): void {
        console.debug("[tracking-param] Removed parameter", {
            url: info.url,
            parameter: info.name,
            value: info.value,
            rule: info.decision.match,
        });
    }
}
