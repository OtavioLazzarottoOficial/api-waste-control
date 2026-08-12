import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { ItemMeal } from "../models/itemMeal.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

interface EditMealItemParams {
  id: string;
  data: Partial<ItemMeal>;
}

async function editMealItem({ id, data }: EditMealItemParams): Promise<void> {
  try {
    await api.put(`/mealItems/${id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useEditMealItem() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, EditMealItemParams>({
    mutationFn: editMealItem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["mealItems"] });
      if (variables.data.mealId) {
        queryClient.invalidateQueries({ queryKey: ["meals", variables.data.mealId] });
      }
      notifySuccess("Item de refeição atualizado com sucesso.");
    },
    onError: (error) => {
      const rawMessage = error.response?.data?.message || "Erro ao atualizar item de refeição. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
