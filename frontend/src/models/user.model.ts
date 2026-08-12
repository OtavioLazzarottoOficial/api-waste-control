import * as zod from "zod";
import type { userFormZodSchema } from "../schemas/userFormZodSchema";

export type User = zod.infer<typeof userFormZodSchema>;
