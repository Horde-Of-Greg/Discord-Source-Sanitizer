import { CaseSensitivity } from "../../../types/data/rules/model/CaseSensitivity.js";

export function compileNetworkPattern(
    pattern: string,
    sensitivity: CaseSensitivity,
): RegExp | undefined {
    if (pattern === "" || pattern === "*") return undefined;
    if (pattern.startsWith("/") && isRegexPattern(pattern)) {
        const lastSlash = pattern.lastIndexOf("/");
        return new RegExp(pattern.slice(1, lastSlash), pattern.slice(lastSlash + 1));
    }

    let source = pattern;
    let prefix = "";
    let suffix = "";
    if (source.startsWith("||")) {
        prefix = "^[a-z][a-z0-9+.-]*:\\/\\/(?:[^/?#]*\\.)?";
        source = source.slice(2);
    } else if (source.startsWith("|")) {
        prefix = "^";
        source = source.slice(1);
    }
    if (source.endsWith("|")) {
        suffix = "$";
        source = source.slice(0, -1);
    }
    return new RegExp(
        `${prefix}${escapeNetworkPattern(source)}${suffix}`,
        sensitivity === CaseSensitivity.Sensitive ? "" : "i",
    );
}

function isRegexPattern(pattern: string): boolean {
    const lastSlash = pattern.lastIndexOf("/");
    return lastSlash > 0 && /^[dgimsuvy]*$/.test(pattern.slice(lastSlash + 1));
}

function escapeNetworkPattern(pattern: string): string {
    let result = "";
    for (const character of pattern) {
        if (character === "*") {
            result += ".*";
            continue;
        }
        if (character === "^") {
            result += "(?:[^A-Za-z0-9_.%-]|$)";
            continue;
        }
        result += /[\\^$.*+?()[\]{}|]/.test(character) ? `\\${character}` : character;
    }
    return result;
}
