import type { IUblockOptionOptions } from "../../../types/filters/ublock/IUblockOptionOptions.js";

export class UblockOptionLexeme {
    public readonly name: string;
    public readonly negated: boolean;
    public readonly value?: string;

    public constructor(options: IUblockOptionOptions) {
        this.name = options.name;
        this.negated = options.negated;
        this.value = options.value;
    }
}
