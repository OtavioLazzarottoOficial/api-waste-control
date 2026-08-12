import * as zod from "zod";
import type { mealFormZodSchema } from "../schemas/mealFormZodSchema";

export type Meal = zod.infer<typeof mealFormZodSchema>;
