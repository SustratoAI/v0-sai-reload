// app/showroom/mini-form/page.tsx
"use client";

import React from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod"; // Importar z para el nuevo schema

import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { SelectCustom, type SelectOption } from "@/components/ui/select-custom";
import { FormField } from "@/components/ui/form-field";
import { CustomButton } from "@/components/ui/custom-button";
import { toast } from "sonner";
import { Globe, Briefcase, Palette } from "lucide-react"; // Iconos para nuevos selects

// Schema actualizado para incluir campos para los nuevos selects
export const miniFormSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  description: z.string().min(10, "La descripción debe tener al menos 10 caracteres.").max(200, "Máximo 200 caracteres."),
  category: z.string().min(1, "Debes seleccionar una categoría."),
  tags: z.array(z.string()).min(1, "Debes seleccionar al menos una etiqueta."), // Para select múltiple
  countryWithIcon: z.string().min(1, "Debes seleccionar un país."), // Para select con iconos
});

export type MiniFormValues = z.infer<typeof miniFormSchema>;


const categoryOptions: SelectOption[] = [
  { value: "tech", label: "Tecnología" },
  { value: "health", label: "Salud" },
  { value: "education", label: "Educación" },
  { value: "finance", label: "Finanzas", disabled: true },
  { value: "art", label: "Arte y Cultura" },
];

const tagOptions: SelectOption[] = [
  { value: "frontend", label: "Frontend" },
  { value: "backend", label: "Backend" },
  { value: "design", label: "Diseño UX/UI" },
  { value: "devops", label: "DevOps" },
  { value: "mobile", label: "Móvil" },
];

const countryOptionsWithIcons: SelectOption[] = [
  { value: "mx", label: "México", icon: Globe },
  { value: "us", label: "Estados Unidos", icon: Globe },
  { value: "ca", label: "Canadá", icon: Globe },
  { value: "es", label: "España", icon: Palette }, // Icono diferente para variedad
  { value: "br", label: "Brasil", icon: Globe, disabled: true },
];


export default function MiniFormShowroomPage() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MiniFormValues>({
    resolver: zodResolver(miniFormSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      tags: [], // Default para array
      countryWithIcon: "",
    },
  });

  const onSubmit: SubmitHandler<MiniFormValues> = (data) => {
    console.log("Mini Form Data:", data);
    toast.success("¡Formulario enviado!", { description: JSON.stringify(data, null, 2) });
  };

  return (
    <div className="container mx-auto p-8 max-w-lg">
      <h1 className="text-2xl font-semibold mb-6">Mini Formulario de Prueba (Input, TextArea, Select)</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField label="Nombre del Proyecto" htmlFor="name" isRequired error={errors.name?.message} >
          <Controller name="name" control={control}
            render={({ field }) => (
              <Input 
                id="name" 
                placeholder="Ej: Mi Super Proyecto" 
                {...field} 
                value={field.value || ""}
                error={errors.name?.message} 
                isRequired 
              />
            )} />
        </FormField>

        <FormField label="Descripción Detallada" htmlFor="description" isRequired error={errors.description?.message} >
          <Controller name="description" control={control}
            render={({ field }) => (
              <TextArea id="description" placeholder="Describe tu proyecto en detalle..." rows={5}
                maxLength={200} showCharacterCount {...field} value={field.value || ""}
                error={errors.description?.message} isRequired hint="Entre 10 y 200 caracteres." />
            )} />
        </FormField>

        <FormField label="Categoría del Proyecto" htmlFor="category" isRequired error={errors.category?.message} >
          <Controller name="category" control={control}
            render={({ field }) => (
              <SelectCustom id="category" options={categoryOptions} placeholder="Elige una categoría"
                {...field} error={errors.category?.message} isRequired clearable />
            )} />
        </FormField>

        {/* EJEMPLO DE SELECT MÚLTIPLE */}
        <FormField label="Etiquetas del Proyecto" htmlFor="tags" isRequired error={errors.tags?.message} >
          <Controller name="tags" control={control}
            render={({ field }) => ( // field.value será string[]
              <SelectCustom id="tags" options={tagOptions} placeholder="Selecciona etiquetas"
                multiple clearable {...field} error={errors.tags?.message} isRequired />
            )} />
        </FormField>

        {/* EJEMPLO DE SELECT CON ICONOS */}
        <FormField label="País de Origen" htmlFor="countryWithIcon" isRequired error={errors.countryWithIcon?.message} >
          <Controller name="countryWithIcon" control={control}
            render={({ field }) => (
              <SelectCustom id="countryWithIcon" options={countryOptionsWithIcons}
                placeholder="Selecciona un país"
                // leadingIcon={Globe} // Podrías tener un leading icon general si no hay selección
                {...field} error={errors.countryWithIcon?.message} isRequired />
            )} />
        </FormField>

        <CustomButton type="submit" loading={isSubmitting} fullWidth>
          Enviar Formulario
        </CustomButton>
      </form>
    </div>
  );
}