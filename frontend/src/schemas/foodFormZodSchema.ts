import z from "zod";
import { useZodForm } from "../hooks/useZodForm";

export const foodFormZodSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().min(1, "Nome do alimento é obrigatorio!"),
  categoryId: z.uuid("A categoria do alimento é obrigatoria!"),
  category: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const useFoodFormZodSchema = () => {
  return useZodForm(foodFormZodSchema);
};
