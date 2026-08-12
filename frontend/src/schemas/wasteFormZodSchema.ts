import z from "zod";
import { useZodForm } from "../hooks/useZodForm";

enum ReasonType {
  LEFTOVER = "LEFTOVER",
  ITSPOILED = "ITSPOILED",
  ERROR_PREPARATION = "ERROR_PREPARATION",
}


export const wasteFormZodSchema = z.object({
  id: z.string().uuid().optional(),
  mealItemId: z.string().uuid(),
  quantity: z.coerce.number().min(1, "A quantidade deve ser maior que zero!"),
  reason: z.nativeEnum(ReasonType),
  type: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const useWasteFormZodSchema = () => {
  return useZodForm(wasteFormZodSchema);
};
