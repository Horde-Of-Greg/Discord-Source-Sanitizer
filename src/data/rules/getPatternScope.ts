import type { ConditionScope } from "../../types/data/rules/ConditionScope.js";

export function getPatternScope(pattern: string): ConditionScope {
    if (pattern === "" || pattern === "*") return { kind: "global" };
    if (!pattern.startsWith("||")) return { kind: "general" };

    const host = /^[|]{2}(?<host>[^/^?]+)/.exec(pattern)?.groups?.host;
    if (host === undefined) return { kind: "general" };
    if (host.endsWith(".*") && !host.slice(0, -2).includes("*")) {
        return { kind: "entity", value: host.slice(0, -2).toLowerCase() };
    }
    if (host.includes("*")) return { kind: "general" };
    return { kind: "hostname", value: host.toLowerCase() };
}
