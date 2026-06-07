import z from "zod";

export const paramConfigSchema = z.record(
    z.string().endsWith(".csv"),
    z.object({
        source: z.url(),
        keyToSelect: z.string(),
    }),
);
