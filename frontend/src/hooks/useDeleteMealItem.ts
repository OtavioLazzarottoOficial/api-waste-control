import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";

async function deleteMealItem(id: string): Promise<void> {
  try {
    await api.delete(`/mealItems/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useDeleteMealItem() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: deleteMealItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      queryClient.invalidateQueries({ queryKey: ["mealItems"] });
      notifySuccess("Item de refeição removido com sucesso.");
    },
    onError: () => {
      notifyError("Erro ao remover item de refeição. Tente novamente.");
    },
  });
}
