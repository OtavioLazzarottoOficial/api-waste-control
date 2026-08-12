import type { z } from "zod";
import type { authenticateFormZodSchema } from "../schemas/authenticateFormZodSchema";

export type Authenticate = z.infer<typeof authenticateFormZodSchema>;