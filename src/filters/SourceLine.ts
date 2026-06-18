import type { ISourceLineOptions } from "../types/filters/ISourceLineOptions.js";

export class SourceLine {
    public readonly filePath: string;
    public readonly absolutePath: string;
    public readonly lineNumber: number;
    public readonly text: string;

    public constructor(options: ISourceLineOptions) {
        this.filePath = options.filePath;
        this.absolutePath = options.absolutePath;
        this.lineNumber = options.lineNumber;
        this.text = options.text;
    }

    public get location(): string {
        return `${this.filePath}:${this.lineNumber.toString()}`;
    }
}
