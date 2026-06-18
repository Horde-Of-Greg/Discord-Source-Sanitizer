import type { IActiveIndexRequest } from "../../types/data/rules/IActiveIndexRequest.js";
import type { IActiveRuleIndexesResolver } from "../../types/data/rules/IActiveRuleIndexesResolver.js";
import type { IActiveRuleIndexesResolverOptions } from "../../types/data/rules/IActiveRuleIndexesResolverOptions.js";
import type { IConditionActivationRequest } from "../../types/data/rules/IConditionActivationRequest.js";
import type { RuleIndex } from "./RuleIndex.js";
import type { ScopedRuleIndexes } from "./ScopedRuleIndexes.js";

export class ActiveRuleIndexesResolver implements IActiveRuleIndexesResolver {
    private readonly globalRules: RuleIndex;
    private readonly scopedRules: ScopedRuleIndexes;

    public constructor(options: IActiveRuleIndexesResolverOptions) {
        this.globalRules = options.globalRules;
        this.scopedRules = options.scopedRules;
    }

    public resolve(request: IActiveIndexRequest): readonly RuleIndex[] {
        const active: RuleIndex[] = [this.globalRules];
        const evaluated = new Set<number>();
        this.activate({
            conditionedIndexes: this.scopedRules.resolve(request.url.hostname, request.counters),
            request,
            active,
            evaluated,
        });
        this.activate({
            conditionedIndexes: this.scopedRules.general,
            request,
            active,
            evaluated,
        });
        if (request.counters !== undefined) request.counters.activeIndexes += active.length;
        return active;
    }

    private activate(activation: IConditionActivationRequest): void {
        for (const conditioned of activation.conditionedIndexes) {
            if (activation.evaluated.has(conditioned.id)) continue;
            activation.evaluated.add(conditioned.id);
            if (activation.request.counters !== undefined) {
                activation.request.counters.conditionsEvaluated++;
            }
            if (conditioned.condition.matches(
                activation.request.url,
                activation.request.urlWithoutHash,
            )) {
                activation.active.push(conditioned.rules);
            }
        }
    }
}
