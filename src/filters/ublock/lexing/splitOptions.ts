export function splitOptions(rawOptions: string): string[] | null {
    const options: string[] = [];
    let current = "";
    let escaped = false;
    let inRegex = false;
    let seenEquals = false;

    for (const character of rawOptions) {
        if (escaped) {
            current += character;
            escaped = false;
            continue;
        }
        if (character === "\\") {
            current += character;
            escaped = true;
            continue;
        }
        if (character === "=") {
            current += character;
            seenEquals = true;
            continue;
        }
        const value = seenEquals ? current.slice(current.indexOf("=") + 1) : "";
        if (character === "/" && seenEquals && (inRegex || value === "" || value === "~")) {
            current += character;
            inRegex = !inRegex;
            continue;
        }
        if (character === "," && !inRegex) {
            options.push(current);
            current = "";
            seenEquals = false;
            continue;
        }
        current += character;
    }
    if (inRegex) return null;
    options.push(current);
    return options;
}
