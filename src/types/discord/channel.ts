import type { Message, SendableChannels } from "discord.js";

export type MessageWithSendableChannel = Message & {
    channel: SendableChannels;
};
