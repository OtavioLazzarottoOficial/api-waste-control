import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";

async function deleteWaste(id: string): Promise<void> {
  try {
    await api.delete(`/wastes/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useDeleteWaste() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, string>({
    mutationFn: deleteWaste,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wastes"] });
      queryClient.invalidateQueries({ queryKey: ["meals"] });
      notifySuccess("Desperdício removido com sucesso.");
    },
    onError: () => {
      notifyError("Erro ao remover desperdício. Tente novamente.");
    },
  });
}
