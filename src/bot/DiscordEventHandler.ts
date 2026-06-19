import type { Client, ClientEvents } from "discord.js";

import type { IActors } from "../types/discord/bot/actors/IActors.js";
import type { IDiscordBot } from "../types/discord/bot/IDiscordBot.js";
import type { IDiscordEventHandlerOptions } from "../types/discord/bot/IDiscordEventHandlerOptions.js";
import type { ISanitizer } from "../types/sanitizers/ISanitizer.js";

export abstract class DiscordEventHandler<K extends keyof ClientEvents> implements DiscordEventHandler<K> {
    abstract readonly eventName: K;
    abstract readonly once: boolean;

    protected discordBot: IDiscordBot;
    protected readonly sanitizer: ISanitizer;
    protected readonly actors: IActors;

    constructor(options: IDiscordEventHandlerOptions) {
        this.discordBot = options.discordBot;
        this.sanitizer = options.sanitizer;
        this.actors = options.actors;
    }

    abstract handle(...args: ClientEvents[K]): Promise<void> | void;

    protected client: Client;

    register(client: Client): void {
        this.client = client;
        if (this.once) {
            this.client.once(this.eventName, (...args) => void this.handle(...args));
        } else {
            this.client.on(this.eventName, (...args) => void this.handle(...args));
        }
    }
}
