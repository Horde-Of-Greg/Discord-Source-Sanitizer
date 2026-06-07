import type z from "zod";

import type { paramConfigSchema } from "../data/schema.js";

export type ParamsConfig = z.infer<typeof paramConfigSchema>;

export type Csv = Record<string, string>[];
