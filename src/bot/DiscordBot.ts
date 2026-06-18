import { Client, GatewayIntentBits, Partials } from "discord.js";

import type { Sanitizer } from "../sanitizers/Sanitizer.js";
import type { AnyDiscordEventHandler } from "../types/discord/eventHandlers.js";
import { Actors } from "./actors/Actors.js";
import { ClientReadyHandler } from "./events/ClientReady.js";
import { MessageCreateHandler } from "./events/MessageCreate.js";
import { MessageEditHandler } from "./events/MessageEdit.js";

const gatewayIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
];

export class DiscordBot {
    client: Client;

    private readonly actors: Actors;

    private readonly handlers: AnyDiscordEventHandler[];
    private readyResolver?: () => void;
    private readonly readyPromise: Promise<void>;

    constructor(private readonly sanitizer: Sanitizer) {
        this.client = new Client({ intents: gatewayIntents, partials: [Partials.Message, Partials.Channel] });
        this.actors = new Actors(this.sanitizer);

        this.readyPromise = new Promise<void>((resolve) => {
            this.readyResolver = resolve;
        });

        this.handlers = [
            new MessageCreateHandler(this, this.sanitizer, this.actors),
            new MessageEditHandler(this, this.sanitizer, this.actors),
            new ClientReadyHandler(this, this.sanitizer, this.actors),
        ];
    }

    async login(token: string): Promise<void> {
        await this.client.login(token);
        await this.readyPromise;
    }

    notifyReady(): void {
        this.readyResolver?.();
    }

    registerEventHandlers(): void {
        for (const handler of this.handlers) {
            handler.register(this.client);
        }
    }
}
