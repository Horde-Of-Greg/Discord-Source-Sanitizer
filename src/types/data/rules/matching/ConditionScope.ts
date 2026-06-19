export type ConditionScope =
    | { kind: "global" }
    | { kind: "hostname"; value: string }
    | { kind: "entity"; value: string }
    | { kind: "general" };
