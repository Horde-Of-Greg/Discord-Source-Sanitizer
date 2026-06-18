export function findOptionSeparator(line: string): number {
    const ruleStart = line.startsWith("@@") ? 2 : 0;
    if (line[ruleStart] !== "/") return line.indexOf("$", ruleStart);

    let escaped = false;
    for (let index = ruleStart + 1; index < line.length; index++) {
        const character = line[index];
        if (escaped) {
            escaped = false;
            continue;
        }
        if (character === "\\") {
            escaped = true;
            continue;
        }
        if (character !== "/") continue;

        const separator = line.indexOf("$", index + 1);
        if (separator !== -1 && /^[a-z]*$/i.test(line.slice(index + 1, separator))) return separator;
    }
    return line.indexOf("$", ruleStart);
}
