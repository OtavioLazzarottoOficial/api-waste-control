import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";
import type { Meal } from "../models/meal.model";

async function FetchMeals(): Promise<Meal[] | undefined> {
  const response = await api.get("/meals");
  const { meals } = response.data;

  return meals;
}

export function useFetchMeals() {
  return useQuery({
    queryKey: ["meals"],
    queryFn: FetchMeals,
  });
}
