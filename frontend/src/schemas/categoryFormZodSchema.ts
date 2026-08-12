import z from "zod";
import { useZodForm } from "../hooks/useZodForm";

export const categoryFormZodSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "Nome da categoria é obrigatorio!"),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const useCategoryFormZodSchema = () => {
  return useZodForm(categoryFormZodSchema);
};
