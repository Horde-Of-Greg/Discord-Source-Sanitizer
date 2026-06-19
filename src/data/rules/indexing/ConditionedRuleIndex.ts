import type { IConditionedRuleIndexOptions } from "../../../types/data/rules/indexing/IConditionedRuleIndexOptions.js";
import type { CompiledUrlCondition } from "../matching/CompiledUrlCondition.js";
import type { RuleIndex } from "./RuleIndex.js";

export class ConditionedRuleIndex {
    public readonly id: number;
    public readonly condition: CompiledUrlCondition;
    public readonly rules: RuleIndex;

    public constructor(options: IConditionedRuleIndexOptions) {
        this.id = options.id;
        this.condition = options.condition;
        this.rules = options.rules;
    }
}
