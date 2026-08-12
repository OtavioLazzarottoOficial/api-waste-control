import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";
import type { Food } from "../models/food.model";

async function fetchFoods(): Promise<Food[] | undefined> {
  try {
    const response = await api.get("/foods");
    const { foods } = response.data;

    return foods;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export function useFetchFoods() {
  return useQuery({
    queryKey: ["foods"],
    queryFn: fetchFoods,
  });
}
