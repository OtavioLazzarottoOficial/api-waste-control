import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Meal } from "../models/meal.model";
import type { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function createMeal(data: Meal): Promise<void> {
  try {
    await api.post("/meals", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function usePostMeal() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, Meal>({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      notifySuccess("Refeição criada com sucesso.");
    },
    onError: (error) => {
      const rawMessage = error.response?.data?.message || "Erro ao criar refeição. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
