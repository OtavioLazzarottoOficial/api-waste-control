import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Meal } from "../models/meal.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function editMeal(data: Meal): Promise<void> {
  const id = data.id;

  try {
    await api.put(`/meals/${id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useEditMeal() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, Meal>({
    mutationFn: editMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      notifySuccess("Refeição atualizada com sucesso.");
    },
    onError: (error) => {
      const rawMessage = error.response?.data?.message || "Erro ao atualizar refeição. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
