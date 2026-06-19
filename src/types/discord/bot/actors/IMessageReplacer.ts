import type { Message, OmitPartialGroupDMChannel } from "discord.js";

export interface IMessageReplacer {
    replace(message: OmitPartialGroupDMChannel<Message>): Promise<void>;
}
