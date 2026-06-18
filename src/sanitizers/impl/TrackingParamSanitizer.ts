import type { ITrackingRuleSet } from "../../types/data/rules/evaluation/ITrackingRuleSet.js";
import type { UrlMatches } from "../../types/url.js";
import { BaseSanitizer } from "../BaseSanitizer.js";

export class TrackingParamSanitizer extends BaseSanitizer {
    public constructor(private readonly rules: ITrackingRuleSet) {
        super();
    }

    public sanitizeUrl(url: UrlMatches): UrlMatches {
        this.rules.sanitize(url.parsedUrl);
        return url;
    }
}
