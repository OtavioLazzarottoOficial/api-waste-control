import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";
import type { Waste } from "../models/waste.model";
import { AxiosError } from "axios";
import { translateError } from "../helpers/translateError";

interface EditWasteParams {
  id: string;
  data: Partial<Waste>;
}

async function editWaste({ id, data }: EditWasteParams): Promise<void> {
  try {
    await api.put(`/wastes/${id}`, data);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useEditWaste() {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message?: string }>, EditWasteParams>({
    mutationFn: editWaste,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wastes"] });
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      notifySuccess("Desperdício atualizado com sucesso.");
    },
    onError: (error) => {
      const rawMessage = error.response?.data?.message || "Erro ao atualizar desperdício. Tente novamente.";
      notifyError(translateError(rawMessage));
    },
  });
}
