import type { Message, OmitPartialGroupDMChannel, PartialMessage } from "discord.js";

import { DiscordEventHandler } from "../DiscordEventHandler.js";

export class MessageEditHandler extends DiscordEventHandler<"messageUpdate"> {
    readonly eventName = "messageUpdate";
    readonly once = false;

    async handle(
        oldMessage: OmitPartialGroupDMChannel<Message | PartialMessage>,
        newMessage: OmitPartialGroupDMChannel<Message>,
    ): Promise<void> {
        await this.actors.replacer.replace(newMessage);
    }
}
