import type { Client, ClientEvents } from "discord.js";

import type { Sanitizer } from "../sanitizers/Sanitizer.js";
import type { Actors } from "./actors/Actors.js";
import type { DiscordBot } from "./DiscordBot.js";

export abstract class DiscordEventHandler<K extends keyof ClientEvents> implements DiscordEventHandler<K> {
    abstract readonly eventName: K;
    abstract readonly once: boolean;

    constructor(
        protected readonly discordBot: DiscordBot,
        protected readonly sanitizer: Sanitizer,
        protected readonly actors: Actors,
    ) {}

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
