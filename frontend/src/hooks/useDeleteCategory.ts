import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../helpers/api";
import { notifyError, notifySuccess } from "../helpers/notifications";

async function deleteCategory(id:string): Promise<void> {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function useDeleteCategory() {
    const queryClient = useQueryClient();

    return useMutation<void, unknown, string>({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            notifySuccess("Categoria removida com sucesso.");
        },
        onError: () => {
            notifyError("Erro ao remover categoria. Tente novamente.");
        }
    });
}