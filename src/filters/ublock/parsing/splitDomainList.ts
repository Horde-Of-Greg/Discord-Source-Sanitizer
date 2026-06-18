export function splitDomainList(value: string): string[] | null {
    const domains: string[] = [];
    let current = "";
    let escaped = false;
    let inRegex = false;

    for (const character of value) {
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
        if (character === "/" && (inRegex || current === "" || current === "~")) {
            current += character;
            inRegex = !inRegex;
            continue;
        }
        if (character === "|" && !inRegex) {
            domains.push(current);
            current = "";
            continue;
        }
        current += character;
    }
    if (inRegex) return null;
    domains.push(current);
    return domains;
}
