import { DiscordAPIError, type Message, type OmitPartialGroupDMChannel } from "discord.js";

import type { Sanitizer } from "../../sanitizers/Sanitizer.js";
import { MirrorMessage } from "../formatters/MirrorMessage.js";

export class MessageReplacer {
    private readonly handledMessageIds = new Set<string>();
    private readonly handledMessageLimit = 1024;

    constructor(private readonly sanitizer: Sanitizer) {}

    async replace(message: OmitPartialGroupDMChannel<Message>): Promise<void> {
        if (!this.shouldConsiderMessage(message)) return;
        if (!this.isMessageWithSendableChannel(message)) return;

        let cleanedContent: string;
        let startExec: number;
        try {
            startExec = performance.now();
            cleanedContent = this.sanitizer.exec(message.content);
        } catch {
            return;
        }

        if (!this.shouldChange(message, cleanedContent)) return;
        if (!this.claimMessage(message.id)) return;
        await this.changeMessage(message, cleanedContent, performance.now() - startExec);
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
        timing: number,
    ): Promise<void> {
        const mirrorMessage = new MirrorMessage(message);
        if (message.deletable) {
            try {
                await message.delete();
            } catch (error) {
                if (this.isUnknownMessageError(error)) return;
                throw error;
            }
        }
        if (process.env.NODE_ENV === "development") {
            await message.channel.send(mirrorMessage.changeContentAndAddTiming(cleanedContent, timing));
        } else {
            await message.channel.send(mirrorMessage.changeContent(cleanedContent));
        }
    }

    private claimMessage(messageId: string): boolean {
        if (this.handledMessageIds.has(messageId)) return false;

        this.handledMessageIds.add(messageId);
        if (this.handledMessageIds.size > this.handledMessageLimit) {
            const oldestMessageId = this.handledMessageIds.values().next().value;
            if (typeof oldestMessageId === "string") this.handledMessageIds.delete(oldestMessageId);
        }
        return true;
    }

    private isUnknownMessageError(error: unknown): boolean {
        return error instanceof DiscordAPIError && error.code === 10_008;
    }
}
