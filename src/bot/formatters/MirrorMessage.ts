import type { EmbedAuthorOptions, MessageCreateOptions, User } from "discord.js";
import { EmbedBuilder, type Message } from "discord.js";

export class MirrorMessage {
    data: EmbedBuilder;

    constructor(message: Message) {
        this.data = new EmbedBuilder()
            .setAuthor(this.embedAuthorFromUser(message.author))
            .setTimestamp(message.editedTimestamp ?? message.createdTimestamp)
            .setDescription(message.content)
            .setFooter({ text: "URL(s) Sanitized" });
    }

    public changeContent(newContent: string): MessageCreateOptions {
        return { embeds: [this.data.setDescription(newContent)] };
    }

    public changeContentAndAddTiming(newContent: string, timing: number): MessageCreateOptions {
        return {
            embeds: [
                this.data
                    .setDescription(newContent)
                    .setFooter({ text: `URL(s) Sanitized in ${timing.toPrecision(4)}ms` }),
            ],
        };
    }

    private embedAuthorFromUser(user: User): EmbedAuthorOptions {
        return {
            name: user.displayName,
            iconURL: user.displayAvatarURL(),
            url: `https://discord.com/users/${user.id}`,
        };
    }
}
