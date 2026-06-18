import z from "zod";

export const paramConfigSchema = z.array(
    z.object({
        name: z.string().optional(),
        link: z.url(),
        source: z.url().optional(),
    }),
);
