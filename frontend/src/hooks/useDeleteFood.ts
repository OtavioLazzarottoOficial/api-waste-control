import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";



async function deleteFood(id:string): Promise<void> {
  try {
    await api.delete(`/foods/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
    
}

export function useDeleteFood() {
    const queryClient = useQueryClient();

    return useMutation<void, unknown, string>({
        mutationFn: deleteFood,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["foods"] });
            notifySuccess("Alimento removido com sucesso.");
        },
        onError: () => {
            notifyError("Erro ao remover alimento. Tente novamente.");
        },
    });
}