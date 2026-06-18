import type { IDestinationConstraintOptions } from "../../../types/data/rules/model/IDestinationConstraintOptions.js";

export class DestinationConstraint {
    public readonly included: readonly string[];
    public readonly excluded: readonly string[];

    public constructor(options: IDestinationConstraintOptions) {
        this.included = options.included;
        this.excluded = options.excluded;
    }
}
