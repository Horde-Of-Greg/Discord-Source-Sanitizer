import path from "node:path";

import dotenv from "dotenv";

import { DiscordBot } from "./bot/DiscordBot.js";
import { FilterFileFetcher } from "./data/FilterFileFetcher.js";
import { createFilterLoadingPipeline } from "./filters/pipeline/createFilterLoadingPipeline.js";
import { Sanitizer } from "./sanitizers/Sanitizer.js";
import { repoPaths } from "./utils/directory.js";

dotenv.config({ quiet: true });

const ublockFilterFileFetcher = new FilterFileFetcher(path.join(repoPaths.dataDir, "filters", "ublock-like"));
await ublockFilterFileFetcher.fetchAll();

const filterResult = await createFilterLoadingPipeline(repoPaths.ublockLikeFilterDir).load();
for (const diagnostic of filterResult.report.entries()) {
    console.warn(
        `[filters] ${diagnostic.count.toString()} ${diagnostic.reason}; example: ${diagnostic.example}`,
    );
}
const bot = new DiscordBot(new Sanitizer(filterResult.rules));
const discordToken = process.env.DISCORD_TOKEN;
if (discordToken === undefined) throw new Error("DISCORD_TOKEN not set");

bot.registerEventHandlers();
await bot.login(discordToken);

process.on("SIGINT", () => void bot.client.destroy());
process.on("SIGTERM", () => void bot.client.destroy());
process.on("SIGHUP", () => void bot.client.destroy());
