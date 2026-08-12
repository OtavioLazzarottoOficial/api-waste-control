import * as zod from "zod";
import type { categoryFormZodSchema } from "../schemas/categoryFormZodSchema";

export type Category = zod.infer<typeof categoryFormZodSchema>;
