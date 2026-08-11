import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Ingresá tu nombre completo")
    .max(120),
  dni: z
    .string()
    .trim()
    .regex(/^\d{7,8}$/, "DNI inválido (7 u 8 dígitos)"),
  email: z.string().trim().email("Email inválido"),
  phone: z
    .string()
    .trim()
    .min(8, "Teléfono inválido")
    .max(20)
    .regex(/^[+\d\s()-]+$/, "Teléfono inválido"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
