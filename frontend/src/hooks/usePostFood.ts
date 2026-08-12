import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Food } from "../models/food.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function createFood(data: Food): Promise<void> {
  try {
    await api.post("/foods", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function usePostFood() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, Food>({
    mutationFn: createFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods"] });
      notifySuccess("Alimento cadastrado com sucesso.");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      const rawMessage = error.response?.data?.message || "Erro ao cadastrar alimento. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
