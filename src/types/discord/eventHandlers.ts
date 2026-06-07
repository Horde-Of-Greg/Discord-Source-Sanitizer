import type { ClientEvents } from "discord.js";

import type { DiscordEventHandler } from "../../bot/DiscordEventHandler.js";

export type AnyDiscordEventHandler = {
    [K in keyof ClientEvents]: DiscordEventHandler<K>;
}[keyof ClientEvents];
