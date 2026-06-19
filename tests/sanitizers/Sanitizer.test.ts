import { describe, expect, it } from "vitest";

import { Sanitizer } from "../../src/sanitizers/Sanitizer.js";
import type { ITrackingRuleSet } from "../../src/types/data/rules/evaluation/ITrackingRuleSet.js";

describe("Sanitizer", () => {
    const dummyRules = {
        removeUtmSource: buildDummyRuleSet(["utm_source"]),
    };
    it("remove utm_source", () => {
        const sanitizer = new Sanitizer(dummyRules.removeUtmSource);
        const result = sanitizer.exec("https://example.com/page?utm_source=google&id=123");
        expect(result).toBe("https://example.com/page?id=123");
    });

    it("does not touch normal query params", () => {
        const sanitizer = new Sanitizer(dummyRules.removeUtmSource);
        const result = sanitizer.exec("https://example.com/page?id=123");
        expect(result).toBe("https://example.com/page?id=123");
    });

    it("throws if not an URL", () => {
        const sanitizer = new Sanitizer(dummyRules.removeUtmSource);
        let errored = false;
        try {
            sanitizer.exec("htts://example.com/page?utm_source=google&id=123");
        } catch {
            errored = true;
        }
        expect(errored).toBe(true);
    });

    it("ignore if unsupported URL protocol", () => {
        const sanitizer = new Sanitizer(dummyRules.removeUtmSource);
        const result = sanitizer.exec("mailto:test@example.com?utm_source=x");
        expect(result).toBe("mailto:test@example.com?utm_source=x");
    });
});

function buildDummyRuleSet(removeparams: string[]): ITrackingRuleSet {
    return {
        sanitize: (url) => {
            for (const removeparam of removeparams) {
                if (!url.searchParams.has(removeparam)) return false;
                url.searchParams.delete(removeparam);
            }
            return true;
        },
        stats: {
            entityBuckets: 0,
            generalConditionGroups: 0,
            globalConditionGroups: 0,
            hostnameBuckets: 0,
            ignoredRules: 0,
            mergedRules: 0,
            sourceRules: 0,
        },
    };
}
