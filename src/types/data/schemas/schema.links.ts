import type z from "zod";

import type { linksConfigSchema } from "../../../data/schemas/schema.links.js";

export type LinksConfig = z.infer<typeof linksConfigSchema>;
