import type { Message, OmitPartialGroupDMChannel } from "discord.js";

import { DiscordEventHandler } from "../DiscordEventHandler.js";

export class MessageCreateHandler extends DiscordEventHandler<"messageCreate"> {
    readonly eventName = "messageCreate";
    readonly once = false;

    async handle(message: OmitPartialGroupDMChannel<Message>): Promise<void> {
        await this.actors.replacer.replace(message);
    }
}
