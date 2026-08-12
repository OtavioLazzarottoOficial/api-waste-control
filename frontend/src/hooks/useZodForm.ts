import { useForm, type UseFormReturn, type FieldValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

export function useZodForm<T extends z.ZodType<FieldValues, any, any>>(
  schema: T
): UseFormReturn<z.infer<T>> {
  return useForm<z.infer<T>>({
    mode: "all",
    reValidateMode: "onSubmit",
    resolver: zodResolver(schema) as any,
  }) as any;
}