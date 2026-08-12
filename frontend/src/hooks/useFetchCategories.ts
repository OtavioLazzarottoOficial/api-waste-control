import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";
import type { Category } from "../models/category.model";

async function FetchCategories(): Promise<Category[] | undefined> {
  const response = await api.get("/categories");
  const { categories } = response.data;

  return categories;
}

export function useFetchCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: FetchCategories,
  });
}
