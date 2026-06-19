import type { IRemovalOperation } from "../../../types/data/rules/operations/IRemovalOperation.js";
import type { RemovalOperationKind } from "../../../types/data/rules/operations/RemovalOperationKind.js";

export abstract class BaseRemovalOperation implements IRemovalOperation {
    public abstract readonly kind: RemovalOperationKind;
    public abstract readonly semanticKey: object;
}
