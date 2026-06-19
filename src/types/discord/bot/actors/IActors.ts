import type { IMessageReplacer } from "./IMessageReplacer.js";

export interface IActors {
    get replacer(): IMessageReplacer;
}
