import type { UrlMatches } from "../types/url.js";

export abstract class BaseSanitizer {
    public abstract sanitizeUrl(url: UrlMatches): UrlMatches;
}
