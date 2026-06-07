import LinkifyIt from "linkify-it";

import type { UrlMatches } from "../types/url.js";
import type { BaseSanitizer } from "./BaseSanitizer.js";
import { TrackingParamSanitizer } from "./impl/TrackingParamSanitizer.js";

export class Sanitizer {
    private _trackingParams?: TrackingParamSanitizer;
    private readonly linkify: LinkifyIt = new LinkifyIt(undefined, {
        fuzzyLink: false,
        fuzzyEmail: false,
        fuzzyIP: false,
    });
    private allSanitizers: BaseSanitizer[] = [this.trackingParamSanitizer];

    public exec(messageContent: string): string {
        const urlMatches = this.fetchUrls(messageContent);
        if (urlMatches === null) throw new Error("No url matches");

        for (const urlMatch of urlMatches) {
            this.allSanitizers.reduce(
                (currentMessageContent, sanitizer) => sanitizer.sanitizeUrl(currentMessageContent),
                urlMatch,
            );
        }

        const newMessageContent = this.replaceUrls(urlMatches, messageContent);

        return newMessageContent;
    }

    private fetchUrls(messageContent: string): UrlMatches[] | null {
        const matches = this.linkify.match(messageContent);
        const urlMatches: UrlMatches[] = [];

        if (matches === null) return null;

        for (const match of matches) {
            try {
                const parsedUrl = new URL(match.url);
                if (!this.isHttpUrl(parsedUrl)) continue;
                urlMatches.push({ parsedUrl, startIndex: match.index, stopIndex: match.lastIndex });
            } catch {
                continue;
            }
        }

        return urlMatches;
    }

    private isHttpUrl(urlCandidate: URL): boolean {
        return urlCandidate.protocol === "https:" || urlCandidate.protocol === "http:";
    }

    private replaceUrls(urlMatches: UrlMatches[], messageContent: string): string {
        let rebuiltMessageContent = "";
        let previousIndex = 0;

        for (const url of urlMatches) {
            rebuiltMessageContent += messageContent.slice(previousIndex, url.startIndex);
            rebuiltMessageContent += url.parsedUrl.href;
            previousIndex = url.stopIndex;
        }

        rebuiltMessageContent += messageContent.slice(previousIndex);

        return rebuiltMessageContent;
    }

    private get trackingParamSanitizer(): TrackingParamSanitizer {
        return (this._trackingParams ??= new TrackingParamSanitizer());
    }
}
