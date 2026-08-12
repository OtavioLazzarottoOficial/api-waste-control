import { useQuery } from "@tanstack/react-query";
import { api } from "../helpers/api";
import type { Waste } from "../models/waste.model";

async function fetchWastes(): Promise<Waste[] | undefined> {
  try {
    const response = await api.get("/wastes");
    const { wastes } = response.data;
    return wastes;
  } catch (error) {
    console.error(error);
    return undefined;
  }
}

export function useFetchWastes() {
  return useQuery({
    queryKey: ["wastes"],
    queryFn: fetchWastes,
  });
}
