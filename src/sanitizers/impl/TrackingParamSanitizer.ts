import { ParamParser } from "../../data/ParamParser.js";
import type { UrlMatches } from "../../types/url.js";
import { BaseSanitizer } from "../BaseSanitizer.js";

export class TrackingParamSanitizer extends BaseSanitizer {
    private readonly blockedParams = new ParamParser().getParams();

    public sanitizeUrl(url: UrlMatches): UrlMatches {
        const baseParams = url.parsedUrl.searchParams;
        const retainedParams = this.parseParams(baseParams);

        url.parsedUrl.search = retainedParams.toString();
        return url;
    }

    private parseParams(searchParams: URLSearchParams): URLSearchParams {
        const retainedParams = new URLSearchParams();

        let changed = false;

        for (const [name, value] of searchParams) {
            if (!this.blockedParams.has(name)) {
                retainedParams.append(name, value);
                continue;
            }
            changed = true;
        }

        if (!changed) throw new Error("Params did not change");

        return retainedParams;
    }
}
