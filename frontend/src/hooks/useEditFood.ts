import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Food } from "../models/food.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function editFood(data: Food): Promise<void> {
  const id = data.id;

  try {
    await api.put(`/foods/${id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useEditFood() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, Food>({
    mutationFn: editFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      notifySuccess("Alimento atualizado com sucesso.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const rawMessage = error.response?.data?.message || "Erro ao atualizar alimento. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
