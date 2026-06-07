import fs from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";

import type { Csv, ParamsConfig } from "../types/data.js";
import { repoDir } from "../utils/directory.js";
import { paramConfigSchema } from "./schema.js";

export class ParamParser {
    private readonly workingDirectory = path.join(repoDir, "/data/params/");
    private readonly configPath = "params.json";

    private _config?: ParamsConfig;

    private params: Set<string> = new Set<string>();

    public getParams(): Set<string> {
        this.fetchParams();
        return this.params;
    }

    private fetchParams(): Set<string> {
        for (const csvPath of this.csvPaths) {
            const csv = this.getCsv(csvPath);
            this.addParamsFromCsv(csv, this.config[csvPath].keyToSelect);
        }

        return this.params;
    }

    private get csvPaths(): string[] {
        const files = fs.readdirSync(this.workingDirectory);
        return files.filter((value) => {
            return value.endsWith(".csv");
        });
    }

    private addParamsFromCsv(csv: Csv, rowName: string): void {
        for (const row of csv) {
            this.params.add(row[rowName]);
        }
    }

    private getCsv(filePath: string): Csv {
        const rawFile = fs.readFileSync(path.join(this.workingDirectory, filePath));
        return parse(rawFile, { columns: true, skip_empty_lines: true, trim: true });
    }

    private get config(): ParamsConfig {
        return (this._config ??= paramConfigSchema.parse(this.jsonConfig));
    }

    private get jsonConfig(): object {
        return JSON.parse(this.rawConfig) as object;
    }

    private get rawConfig(): string {
        return fs.readFileSync(path.join(this.workingDirectory, this.configPath), "utf-8");
    }
}
