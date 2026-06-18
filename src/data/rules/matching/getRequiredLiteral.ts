export function getRequiredLiteral(pattern: string): string | undefined {
    if (pattern === "" || pattern === "*" || pattern.startsWith("/")) return undefined;
    const withoutAnchors = pattern.replace(/^\|\|?/, "").replace(/\|$/, "");
    const pieces = withoutAnchors.split(/[*^]/).filter((piece) => piece.length >= 3);
    return pieces.sort((left, right) => right.length - left.length)[0];
}
