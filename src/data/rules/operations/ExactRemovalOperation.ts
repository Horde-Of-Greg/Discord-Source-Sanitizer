import { RemovalOperationKind } from "../../../types/data/rules/operations/RemovalOperationKind.js";
import { BaseRemovalOperation } from "./BaseRemovalOperation.js";

export class ExactRemovalOperation extends BaseRemovalOperation {
    public readonly kind = RemovalOperationKind.Exact;

    public constructor(public readonly value: string) {
        super();
    }

    public get semanticKey(): object {
        return { kind: this.kind, value: this.value };
    }
}
