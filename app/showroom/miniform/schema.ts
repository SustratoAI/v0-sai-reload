// app/showroom/mini-form/schema.ts
import { z } from "zod";

export const miniFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres.").max(200, "Máximo 200 caracteres."),
  category: z.string().min(1, "Debes seleccionar una categoría."),
});

export type MiniFormValues = z.infer<typeof miniFormSchema>;