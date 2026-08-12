import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";
import type { Meal } from "../models/meal.model";

export async function getItemMealById(
  mealId: string,
): Promise<Meal | undefined> {
  try {
    const response = await api.get(`/meals/${mealId}`);
    return  response.data.meal;
  } catch (error) {
    console.error("Erro ao obter item de refeição:", error);
  }
}

export function useGetItemMealById(id: string) {
  return useQuery({
    queryKey: ["meals", id],
    queryFn: () => getItemMealById(id),
    enabled: !!id,
  });
}
