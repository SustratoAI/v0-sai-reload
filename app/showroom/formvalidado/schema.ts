// app/showroom/formvalidado/schema.ts
import { z } from "zod";

// 1. Definir el objeto base del schema
const showroomObjectSchemaContents = {
  fullName: z.string()
    .min(1, "El nombre completo es requerido.")
    .min(5, "Debe tener al menos 5 caracteres.")
    .refine(value => value.trim().split(" ").length >= 2, {
      message: "Debe ingresar al menos un nombre y un apellido.",
    }),
  email: z.string()
    .min(1, "El correo electrónico es requerido.")
    .email("Formato de correo electrónico inválido."),
  username: z.string()
    .optional()
    .refine(val => !val || (val.length >= 3 && val.length <= 15), {
      message: "Si se provee, debe tener entre 3 y 15 caracteres.",
    })
    .refine(val => !val || /^[a-zA-Z0-9_]+$/.test(val), {
      message: "Si se provee, solo letras, números y guion bajo.",
    }),
  age: z.coerce // Convierte el string del input a número antes de validar
    .number({ invalid_type_error: "Debe ingresar un número." })
    .optional()
    .refine(val => val === undefined || val === null || val >= 18, { // Validar solo valores numéricos
      message: "Si ingresa edad, debe ser mayor o igual a 18.",
    }),
  password: z.string()
    .min(1, "La contraseña es requerida.")
    .min(8, "Mínimo 8 caracteres.")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula.")
    .regex(/[a-z]/, "Debe contener al menos una minúscula.")
    .regex(/[0-9]/, "Debe contener al menos un número."),
  confirmPassword: z.string()
    .min(1, "Confirmar la contraseña es requerido."),
  website: z.string()
    .optional()
    .refine(val => !val || z.string().url({ message: "URL inválida." }).safeParse(val).success, {
      message: "Si se provee, debe ser una URL válida (ej: http://sitio.com)",
    }),
  comments: z.string()
   
    .max(200, "Máximo 200 caracteres para comentarios.")
    .optional()
};

export const showroomObjectSchema = z.object(showroomObjectSchemaContents);

// 2. Aplicar el refine a nivel de objeto al schema exportado
export const showroomFormSchema = showroomObjectSchema.refine(
  data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"], // Indicar qué campo mostrará este error
  }
);

export type ShowroomFormValues = z.infer<typeof showroomFormSchema>;