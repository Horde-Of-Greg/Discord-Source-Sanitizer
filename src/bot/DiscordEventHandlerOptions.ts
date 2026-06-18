import type { Sanitizer } from "../sanitizers/Sanitizer.js";
import type { IActors } from "../types/discord/bot/actors/IActors.js";
import type { IDiscordEventHandlerOptions } from "../types/discord/bot/IDiscordEventHandlerOptions.js";
import { Actors } from "./actors/Actors.js";
import type { DiscordBot } from "./DiscordBot.js";

export class DiscordEventHandlerOptions implements IDiscordEventHandlerOptions {
    actors: IActors;

    constructor(
        public readonly sanitizer: Sanitizer,
        public readonly discordBot: DiscordBot,
    ) {
        this.actors = new Actors(sanitizer);
    }
}
