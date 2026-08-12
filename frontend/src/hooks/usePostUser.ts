import { useMutation } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { UserFormZodSchema } from "../schemas/userFormZodSchema";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function createUser(data: UserFormZodSchema): Promise<void> {
  try {
    await api.post("/accounts", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function usePostUser() {
  return useMutation<void, AxiosError<{ message?: string }>, UserFormZodSchema>({
    mutationFn: createUser,
    onSuccess: () => {
      notifySuccess("Usuário cadastrado com sucesso.");
    },
    onError: (error) => {
      const rawMessage = error.response?.data?.message || "Erro ao cadastrar usuário. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
