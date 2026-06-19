import { RemovalOperationKind } from "../../../types/data/rules/operations/RemovalOperationKind.js";
import { BaseRemovalOperation } from "./BaseRemovalOperation.js";

export class ExceptRegexRemovalOperation extends BaseRemovalOperation {
    public readonly kind = RemovalOperationKind.ExceptRegex;

    public constructor(
        public readonly regex: RegExp,
        public readonly source: string,
    ) {
        super();
    }

    public get semanticKey(): object {
        return { kind: this.kind, source: this.source, flags: this.regex.flags };
    }
}
