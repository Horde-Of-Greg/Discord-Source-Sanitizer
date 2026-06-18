import z from "zod";

export const linksConfigSchema = z.array(
    z.object({
        name: z.string(),
        rawData: z.url(),
        source: z.url().optional(),
    }),
);
