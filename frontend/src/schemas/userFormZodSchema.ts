import z from "zod";

export enum Roles {
  EMPLOYEE = "EMPLOYEE",
  ADMIN = "ADMIN",
}

export const userFormZodSchema = z.object({
  name: z.string().min(2, "O nome deve conter no mínimo 2 caracteres!"),
  email: z.email("Email inválido!"),
  password: z.string().min(6, "A senha deve conter no mínimo 6 caracteres!"),
  roles: z.enum(Roles),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

export type UserFormZodSchema = z.infer<typeof userFormZodSchema>;
