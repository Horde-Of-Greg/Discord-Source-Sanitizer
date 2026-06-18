import { RemovalOperationKind } from "../../../types/data/rules/RemovalOperationKind.js";
import { BaseRemovalOperation } from "./BaseRemovalOperation.js";

export class ExceptExactRemovalOperation extends BaseRemovalOperation {
    public readonly kind = RemovalOperationKind.ExceptExact;

    public constructor(public readonly value: string) {
        super();
    }

    public get semanticKey(): object {
        return { kind: this.kind, value: this.value };
    }
}
