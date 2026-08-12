import z from "zod";
import { useZodForm } from "../hooks/useZodForm";

export const mealItemFormZodSchema = z.object({
  mealId: z.string().uuid().optional(),
  foodId: z.string().uuid(),
  reason: z.string().optional(),
  quantityServed: z.coerce.number().min(0),
  quantityConsumed: z.coerce.number().min(0),
});

export const useMealItemFormZodSchema = () => {
  return useZodForm(mealItemFormZodSchema);
};
