import fsSync from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import type { IFilterFileFetcher } from "../types/data/IFilterFileFetcher.js";
import type { LinksConfig } from "../types/data/schemas/schema.links.js";
import { linksConfigSchema } from "./schemas/schema.links.js";

export class FilterFileFetcher implements IFilterFileFetcher {
    private links: LinksConfig;

    constructor(private readonly workingDir: string) {
        const linksConfigPath = path.join(this.workingDir, "links.json");
        const rawSchema = JSON.parse(fsSync.readFileSync(linksConfigPath, "utf-8")) as unknown;
        this.links = linksConfigSchema.parse(rawSchema);
    }

    async fetchAll(): Promise<void> {
        for (const link of this.links) {
            const filePath = path.join(this.workingDir, link.name + ".txt");
            if (fsSync.existsSync(filePath)) continue;
            const data = await this.fetchOne(link);
            await fs.writeFile(filePath, data);
        }
    }

    async fetchOne(link: LinksConfig[0]): Promise<string> {
        const response = await fetch(link.rawData);
        if (!response.ok) {
            throw new Error(
                `Failed to fetch data from ${link.name}: ${response.status.toString()} ${response.statusText}`,
            );
        }
        return response.text();
    }
}
