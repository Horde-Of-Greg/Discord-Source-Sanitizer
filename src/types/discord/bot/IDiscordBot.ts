import type { Client } from "discord.js";

export interface IDiscordBot {
    client: Client;

    login(token: string): Promise<void>;
    notifyReady(): void;

    registerEventHandlers(): void;
}
