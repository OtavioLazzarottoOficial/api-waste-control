import { z } from "zod";
import { useZodForm } from "../hooks/useZodForm";

export const authenticateFormZodSchema = z.object({
  email: z.string().email("Email inválido!"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres!"),
});


export const useAuthenticateFormSchema = () => {
    return useZodForm(authenticateFormZodSchema);
}