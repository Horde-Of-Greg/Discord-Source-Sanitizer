import { FilterErrorAction } from "../types/filters/FilterErrorAction.js";
import type { IContentLinesRequest } from "../types/filters/IContentLinesRequest.js";
import type { IFilterErrorHandler } from "../types/filters/IFilterErrorHandler.js";
import type { IFilterFileReader } from "../types/filters/IFilterFileReader.js";
import type { IFilterIssue } from "../types/filters/IFilterIssue.js";
import type { IFilterPreprocessor } from "../types/filters/IFilterPreprocessor.js";
import type { IFilterPreprocessorOptions } from "../types/filters/IFilterPreprocessorOptions.js";
import type { ISourceLineOptions } from "../types/filters/ISourceLineOptions.js";
import { ConditionalDirectiveProcessor } from "./ConditionalDirectiveProcessor.js";
import { FilterProcessingError } from "./FilterProcessingError.js";
import { SourceLine } from "./SourceLine.js";

export class FilterPreprocessor implements IFilterPreprocessor {
    private readonly reader: IFilterFileReader;
    private readonly errors: IFilterErrorHandler;
    private readonly includeStack = new Set<string>();

    public constructor(options: IFilterPreprocessorOptions) {
        this.reader = options.reader;
        this.errors = options.errors;
    }

    public async getSourceLines(): Promise<readonly SourceLine[]> {
        const lines: SourceLine[] = [];
        for (const filePath of await this.reader.getFilterFiles()) {
            await this.addFileLines(filePath, lines);
        }
        return lines;
    }

    private async addFileLines(filePath: string, lines: SourceLine[]): Promise<void> {
        if (!this.reader.contains(filePath)) {
            this.handle({
                filePath,
                message: "Include escapes the filter root",
                action: FilterErrorAction.Exit,
            });
            return;
        }
        if (this.includeStack.has(filePath)) {
            this.handle({
                filePath,
                message: "Include cycle detected",
                action: FilterErrorAction.Exit,
            });
            return;
        }

        const content = await this.reader.read(filePath);
        if (content === null) {
            this.handle({
                filePath,
                message: "Missing include",
                action: FilterErrorAction.Report,
            });
            return;
        }
        this.includeStack.add(filePath);
        await this.addContentLines({ filePath, content, lines });
        this.includeStack.delete(filePath);
    }

    private async addContentLines(request: IContentLinesRequest): Promise<void> {
        const directives = new ConditionalDirectiveProcessor();
        const rawLines = request.content.split(/\r?\n/);
        for (const [index, rawLine] of rawLines.entries()) {
            const source = this.createSource({
                filePath: this.reader.getRelativePath(request.filePath),
                absolutePath: request.filePath,
                lineNumber: index + 1,
                text: rawLine,
            });
            try {
                if (directives.process(source)) continue;
                if (!directives.active) continue;
                if (await this.processInclude(source, request.lines)) continue;
                request.lines.push(source);
            } catch (error) {
                this.handleError(error);
            }
        }
        const finalSource = this.createSource({
            filePath: this.reader.getRelativePath(request.filePath),
            absolutePath: request.filePath,
            lineNumber: rawLines.length + 1,
            text: "",
        });
        try {
            directives.assertComplete(finalSource);
        } catch (error) {
            this.handleError(error);
        }
    }

    private async processInclude(source: SourceLine, lines: SourceLine[]): Promise<boolean> {
        const trimmed = source.text.trim();
        if (!trimmed.startsWith("!#include ")) return false;

        let decodedPath: string;
        try {
            decodedPath = decodeURIComponent(trimmed.slice(10).trim());
        } catch {
            throw new FilterProcessingError({
                message: "Invalid include encoding",
                action: FilterErrorAction.Exit,
                source,
            });
        }
        const includePath = this.reader.resolveInclude(source.absolutePath, decodedPath);
        await this.addFileLines(includePath, lines);
        return true;
    }

    private createSource(options: ISourceLineOptions): SourceLine {
        return new SourceLine(options);
    }

    private handle(issue: IFilterIssue): void {
        const source = new SourceLine({
            filePath: this.reader.getRelativePath(issue.filePath),
            absolutePath: issue.filePath,
            lineNumber: 0,
            text: "",
        });
        this.errors.handle(new FilterProcessingError({
            message: issue.message,
            action: issue.action,
            source,
        }));
    }

    private handleError(error: unknown): void {
        if (error instanceof FilterProcessingError) {
            this.errors.handle(error);
            return;
        }
        throw error;
    }
}
