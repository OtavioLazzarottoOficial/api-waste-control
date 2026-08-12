import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";

export async function getMealItemById(id: string): Promise<any> {
  try {
    const response = await api.get(`/mealItems/${id}`);
    return response.data.mealItem;
  } catch (error) {
    console.error("Erro ao obter item de refeição:", error);
  }
}

export function useGetMealItemById(id: string) {
  return useQuery({
    queryKey: ["mealItems", id],
    queryFn: () => getMealItemById(id),
    enabled: !!id,
  });
}
