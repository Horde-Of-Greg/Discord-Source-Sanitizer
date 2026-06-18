export function withoutUrlHash(url: URL): string {
    const hashIndex = url.href.indexOf("#");
    return hashIndex === -1 ? url.href : url.href.slice(0, hashIndex);
}
