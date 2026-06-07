import type { Message, OmitPartialGroupDMChannel } from "discord.js";

import type { Sanitizer } from "../../sanitizers/Sanitizer.js";
import { MirrorMessage } from "../formatters/MirrorMessage.js";

export class MessageReplacer {
    constructor(private readonly sanitizer: Sanitizer) {}

    async replace(message: OmitPartialGroupDMChannel<Message>): Promise<void> {
        if (!this.shouldConsiderMessage(message)) return;
        if (!this.isMessageWithSendableChannel(message)) return;

        let cleanedContent: string;
        try {
            cleanedContent = this.sanitizer.exec(message.content);
        } catch {
            return;
        }

        if (!this.shouldChange(message, cleanedContent)) return;
        await this.changeMessage(message, cleanedContent);
    }

    private shouldConsiderMessage(message: Message): boolean {
        if (message.author.bot) return false;
        if (!message.guild) return false;
        if (!message.content.includes("?")) return false;

        return true;
    }

    private shouldChange(message: Message, cleanedContent: string): boolean {
        if (cleanedContent === message.content) return false;
        if (cleanedContent.length > 2000) return false;

        return true;
    }

    private isMessageWithSendableChannel(message: OmitPartialGroupDMChannel<Message>): boolean {
        return message.channel.isSendable();
    }

    private async changeMessage(
        message: OmitPartialGroupDMChannel<Message>,
        cleanedContent: string,
    ): Promise<void> {
        const mirrorMessage = new MirrorMessage(message);
        if (message.deletable) {
            await message.delete();
        }
        await message.channel.send(mirrorMessage.changeContent(cleanedContent));
    }
}
