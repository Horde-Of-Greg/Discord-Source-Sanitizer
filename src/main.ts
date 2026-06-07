import dotenv from "dotenv";

import { DiscordBot } from "./bot/DiscordBot.js";

dotenv.config({ quiet: true });

const bot = new DiscordBot();
const discordToken = process.env.DISCORD_TOKEN;
if (discordToken === undefined) throw new Error("DISCORD_TOKEN not set");

bot.registerEventHandlers();
await bot.login(discordToken);

process.on("SIGINT", () => void bot.client.destroy());
process.on("SIGTERM", () => void bot.client.destroy());
process.on("SIGHUP", () => void bot.client.destroy());
