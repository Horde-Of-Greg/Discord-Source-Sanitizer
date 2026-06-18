export interface IFilterFileReader {
    readonly rootPath: string;

    getFilterFiles(): Promise<readonly string[]>;
    read(filePath: string): Promise<string | null>;
    resolveInclude(sourcePath: string, includePath: string): string;
    getRelativePath(filePath: string): string;
    contains(filePath: string): boolean;
}
