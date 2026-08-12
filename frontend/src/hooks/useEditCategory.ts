import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Category } from "../models/category.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function editarCategory(data: Category): Promise<void> {
  try {
    await api.put(`/categories/${data.id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useEditCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editarCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      notifySuccess("Categoria atualizada com sucesso.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const rawMessage = error.response?.data?.message || "Erro ao atualizar categoria. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
