import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Waste } from "../models/waste.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

async function postWaste(data: Waste): Promise<void> {
  try {
    await api.post("/wastes", data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function usePostWaste() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, Waste>({
    mutationFn: postWaste,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wastes"] });
      notifySuccess("Desperdício registrado com sucesso.");
    },
    onError: (error) => {
      const rawMessage = error.response?.data?.message || "Erro ao registrar desperdício. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
