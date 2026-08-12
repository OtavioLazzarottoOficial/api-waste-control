import * as zod from "zod";
import type { wasteFormZodSchema } from "../schemas/wasteFormZodSchema";

export type Waste = zod.infer<typeof wasteFormZodSchema>;
