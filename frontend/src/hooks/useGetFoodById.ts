import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";
import type { Food } from "../models/food.model";

export async function getFoodById(foodId: string | undefined): Promise<Food | undefined> {
  try {
    const response = await api.get(`/foods/${foodId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao obter alimento:", error);
  }
}

export function useGetFoodById(id: string | undefined) {
  return useQuery({
    queryKey: ["food", id],
    queryFn: () => getFoodById(id),
    enabled: !!id,
  });  
}