import { RemovalOperationKind } from "../../../types/data/rules/operations/RemovalOperationKind.js";
import { BaseRemovalOperation } from "./BaseRemovalOperation.js";

export class RemoveAllOperation extends BaseRemovalOperation {
    public readonly kind = RemovalOperationKind.All;
    public readonly semanticKey = { kind: this.kind };
}
