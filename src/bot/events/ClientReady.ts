import type { Client } from "discord.js";

import { DiscordEventHandler } from "../DiscordEventHandler.js";

export class ClientReadyHandler extends DiscordEventHandler<"clientReady"> {
    readonly eventName = "clientReady";
    readonly once = true;

    handle(client: Client): void {
        const environment = process.env.NODE_ENV?.toString();
        console.log(`Ready as ${client.user?.tag ?? "UNKNOWN"} in ${environment ?? "UNKNOWN NODE_ENV"}`);
        this.discordBot.notifyReady();
    }
}
