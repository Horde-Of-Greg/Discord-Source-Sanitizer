import type { Client } from "discord.js";

import { DiscordEventHandler } from "../DiscordEventHandler.js";

export class ClientReadyHandler extends DiscordEventHandler<"clientReady"> {
    readonly eventName = "clientReady";
    readonly once = true;

    handle(client: Client): void {
        console.log(`Ready as ${client.user?.tag ?? "UNKNOWN"}`);
        this.discordBot.notifyReady();
    }
}
