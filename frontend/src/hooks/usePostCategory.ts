import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Category } from "../models/category.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function postCategory(data: Category): Promise<void> {
  try {
    await api.post("/categories", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function usePostCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notifySuccess("Categoria criada com sucesso.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const rawMessage = error.response?.data?.message || "Erro ao criar categoria. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
