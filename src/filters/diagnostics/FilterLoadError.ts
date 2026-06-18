export class FilterLoadError extends Error {
    public constructor(public readonly diagnostics: readonly string[]) {
        super(`Failed to load filters:\n${diagnostics.join("\n")}`);
    }
}
