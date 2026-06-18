import type { RemovalOperationKind } from "./RemovalOperationKind.js";

export interface IRemovalOperation {
    readonly kind: RemovalOperationKind;
    readonly semanticKey: object;
}
