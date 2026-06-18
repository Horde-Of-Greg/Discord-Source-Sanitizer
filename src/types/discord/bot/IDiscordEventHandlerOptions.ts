import type { ISanitizer } from "../../sanitizers/ISanitizer.js";
import type { IActors } from "./actors/IActors.js";
import type { IDiscordBot } from "./IDiscordBot.js";

export interface IDiscordEventHandlerOptions {
    discordBot: IDiscordBot;
    sanitizer: ISanitizer;
    actors: IActors;
}
