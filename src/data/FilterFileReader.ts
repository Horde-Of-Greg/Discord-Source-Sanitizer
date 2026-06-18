import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import type { IFilterFileReader } from "../types/filters/IFilterFileReader.js";

export class FilterFileReader implements IFilterFileReader {
    public constructor(public readonly rootPath: string) {}

    public async getFilterFiles(): Promise<readonly string[]> {
        const entries = await readdir(this.rootPath, { withFileTypes: true });
        return entries
            .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
            .map((entry) => path.join(this.rootPath, entry.name))
            .sort();
    }

    public async read(filePath: string): Promise<string | null> {
        try {
            return await readFile(filePath, "utf8");
        } catch {
            return null;
        }
    }

    public resolveInclude(sourcePath: string, includePath: string): string {
        return path.resolve(path.dirname(sourcePath), includePath);
    }

    public getRelativePath(filePath: string): string {
        return path.relative(this.rootPath, filePath);
    }

    public contains(filePath: string): boolean {
        const relative = this.getRelativePath(path.resolve(filePath));
        return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
    }
}
