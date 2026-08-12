import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { ItemMeal } from "../models/itemMeal.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function createItemMeal(data: ItemMeal): Promise<void> {
  try {
    await api.post("/mealItems", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function usePostItemMeal() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, ItemMeal>({
    mutationFn: createItemMeal,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["mealItems"] });
      if (variables.mealId) {
        queryClient.invalidateQueries({ queryKey: ["meals", variables.mealId] });
      }
      notifySuccess("Item de refeição adicionado com sucesso.");
    },
    onError: (error) => {
      const rawMessage = error.response?.data?.message || "Erro ao adicionar item. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
