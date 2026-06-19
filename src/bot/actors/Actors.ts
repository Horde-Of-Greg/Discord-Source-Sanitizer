import type { Sanitizer } from "../../sanitizers/Sanitizer.js";
import { MessageReplacer } from "./MessageReplacer.js";

export class Actors {
    private _replacer?: MessageReplacer;

    constructor(private readonly sanitizer: Sanitizer) {}

    public get replacer(): MessageReplacer {
        return (this._replacer ??= new MessageReplacer(this.sanitizer));
    }
}
