import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";

async function deleteMeal(id:string): Promise<void> {
  try {
    await api.delete(`/meals/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
    
}

export function useDeleteMeal() {
    const queryClient = useQueryClient();

    return useMutation<void, unknown, string>({
        mutationFn: deleteMeal,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["meals"] });
            notifySuccess("Refeição removida com sucesso.");
        },
        onError: () => {
            notifyError("Erro ao remover refeição. Tente novamente.");
        },
    });
}