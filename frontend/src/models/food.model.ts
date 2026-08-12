import * as zod from "zod";
import type { foodFormZodSchema } from "../schemas/foodFormZodSchema";

export type Food = zod.infer<typeof foodFormZodSchema>;
