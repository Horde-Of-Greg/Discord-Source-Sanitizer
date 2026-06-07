import type { EmbedAuthorOptions, MessageCreateOptions, User } from "discord.js";
import { EmbedBuilder, type Message } from "discord.js";

export class MirrorMessage {
    data: EmbedBuilder;

    constructor(message: Message) {
        this.data = new EmbedBuilder()
            .setAuthor(this.embedAuthorFromUser(message.author))
            .setTimestamp(message.editedTimestamp ?? message.createdTimestamp)
            .setDescription(message.content)
            .setFooter({ text: "URL Sanitized" });
    }

    public changeContent(newContent: string): MessageCreateOptions {
        return { embeds: [this.data.setDescription(newContent)] };
    }

    private embedAuthorFromUser(user: User): EmbedAuthorOptions {
        return {
            name: user.displayName,
            iconURL: user.displayAvatarURL(),
            url: `https://discord.com/users/${user.id}`,
        };
    }
}
