import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";

export async function getWasteById(id: string): Promise<any> {
  try {
    const response = await api.get(`/wastes/${id}`);
    return response.data.waste;
  } catch (error) {
    console.error("Erro ao obter desperdício:", error);
  }
}

export function useGetWasteById(id: string) {
  return useQuery({
    queryKey: ["wastes", id],
    queryFn: () => getWasteById(id),
    enabled: !!id,
  });
}
