import z from "zod";
import { useZodForm } from "../hooks/useZodForm";

export const mealFormZodSchema = z.object({
  id: z.string().uuid().optional(),
  date: z.string().min(1, "Data da refeição é obrigatória!"),
  turn: z.enum(["DINNER", "AFTERNOON"]),
  mealItems: z
    .array(
      z.object({
        id: z.string().uuid().optional(),
        foodId: z.string().uuid({ message: "Selecione um alimento!" }),
        quantityServed: z.number({
          message: "Quantidade servida deve ser um número!",
        }),
        quantityConsumed: z.number({
          message: "Quantidade consumida deve ser um número!",
        }),
        food: z
          .object({
            id: z.string().uuid(),
            name: z.string(),
          })
          .optional(),
      }),
    )
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const useMealFormZodSchema = () => {
  return useZodForm(mealFormZodSchema);
};
