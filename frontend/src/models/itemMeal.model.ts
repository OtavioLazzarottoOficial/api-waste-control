import * as zod from "zod";
import type { mealItemFormZodSchema } from "../schemas/itemMealFormZodSchema";

export type ItemMeal = zod.infer<typeof mealItemFormZodSchema>;
