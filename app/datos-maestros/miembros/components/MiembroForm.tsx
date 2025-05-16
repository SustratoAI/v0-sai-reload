"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectCustom } from "@/components/ui/select-custom";
import { FormField } from "@/components/ui/form-field";
import { CustomButton } from "@/components/ui/custom-button";
import { ProCard } from "@/components/ui/pro-card";
import { Text } from "@/components/ui/text";

const formSchema = z.object({
  emailUsuario: z.string().email("Email inválido").min(1, "El email es requerido"),
  rolId: z.string().min(1, "Debe seleccionar un rol"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  displayName: z.string().optional(),
  institution: z.string().optional(),
  phone: z.string().optional(),
  notes: z.string().optional(),
  language: z.string().optional(),
  pronouns: z.string().optional(),
});

export type MiembroFormValues = z.infer<typeof formSchema>;

interface RolOption {
  value: string;
  label: string;
}

interface MiembroFormProps {
  modo: "crear" | "editar" | "ver";
  valoresIniciales: Partial<MiembroFormValues>;
  rolesDisponibles: RolOption[];
  onSubmit?: (data: MiembroFormValues) => void;
  disabled?: boolean;
  loading?: boolean;
}

export const MiembroForm: React.FC<MiembroFormProps> = ({
  modo,
  valoresIniciales,
  rolesDisponibles,
  onSubmit,
  disabled = false,
  loading = false,
}) => {
  console.log('MiembroForm render', { modo, disabled, loading, onSubmit, valoresIniciales, rolesDisponibles });
  const form = useForm<MiembroFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailUsuario: valoresIniciales.emailUsuario || "",
      rolId: valoresIniciales.rolId || "",
      firstName: valoresIniciales.firstName || "",
      lastName: valoresIniciales.lastName || "",
      displayName: valoresIniciales.displayName || "",
      institution: valoresIniciales.institution || "",
      phone: valoresIniciales.phone || "",
      notes: valoresIniciales.notes || "",
      language: valoresIniciales.language || "",
      pronouns: valoresIniciales.pronouns || "",
    },
  });

  const isView = modo === "ver" || disabled;

  return (
    <ProCard>
      <ProCard.Header>
        <Text variant="heading" size="lg">
          {modo === "crear"
            ? "Agregar Miembro al Proyecto"
            : modo === "editar"
            ? "Editar Miembro del Proyecto"
            : "Detalle del Miembro"}
        </Text>
      </ProCard.Header>
      <ProCard.Content>
        <form
          onSubmit={form.handleSubmit((data) => {
            console.log('MiembroForm form submit', data);
            if (onSubmit) onSubmit(data);
          })}
          className="space-y-6"
        >
          <Text variant="heading" size="lg">
            Información del Miembro
          </Text>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Email del Usuario"
              htmlFor="emailUsuario"
              error={form.formState.errors.emailUsuario?.message}
            >
              <Input
                id="emailUsuario"
                placeholder="correo@ejemplo.com"
                {...form.register("emailUsuario")}
                disabled={isView || modo === "editar"}
              />
            </FormField>

            <FormField
              label="Rol en el Proyecto"
              htmlFor="rolId"
              error={form.formState.errors.rolId?.message}
            >
              <SelectCustom
                id="rolId"
                placeholder="Selecciona un rol"
                options={rolesDisponibles}
                value={form.watch("rolId")}
                onChange={(value) => form.setValue("rolId", value as string)}
                error={form.formState.errors.rolId?.message}
                disabled={isView}
              />
            </FormField>
          </div>

          <Text variant="heading" size="lg" className="mt-6 mb-2">
            Información Adicional de Perfil (Opcional)
          </Text>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre" htmlFor="firstName">
              <Input
                id="firstName"
                placeholder="Nombre"
                {...form.register("firstName")}
                disabled={isView}
              />
            </FormField>

            <FormField label="Apellido" htmlFor="lastName">
              <Input
                id="lastName"
                placeholder="Apellido"
                {...form.register("lastName")}
                disabled={isView}
              />
            </FormField>

            <FormField label="Nombre para mostrar" htmlFor="displayName">
              <Input
                id="displayName"
                placeholder="Nombre público"
                {...form.register("displayName")}
                disabled={isView}
              />
            </FormField>

            <FormField label="Institución" htmlFor="institution">
              <Input
                id="institution"
                placeholder="Institución o afiliación"
                {...form.register("institution")}
                disabled={isView}
              />
            </FormField>

            <FormField label="Teléfono" htmlFor="phone">
              <Input
                id="phone"
                placeholder="Teléfono de contacto"
                {...form.register("phone")}
                disabled={isView}
              />
            </FormField>

            <FormField label="Lenguaje preferido" htmlFor="language">
              <SelectCustom
                id="language"
                placeholder="Selecciona un idioma"
                options={[
                  { value: "es", label: "Español" },
                  { value: "en", label: "Inglés" },
                  { value: "pt", label: "Portugués" },
                ]}
                value={form.watch("language")}
                onChange={(value) => form.setValue("language", value as string)}
                disabled={isView}
              />
            </FormField>

            <FormField label="Pronombres" htmlFor="pronouns">
              <Input
                id="pronouns"
                placeholder="Pronombres"
                {...form.register("pronouns")}
                disabled={isView}
              />
            </FormField>
          </div>

          <FormField label="Notas" htmlFor="notes" className="col-span-full">
            <Textarea
              id="notes"
              placeholder="Información adicional relevante"
              {...form.register("notes")}
              showCharacterCount
              maxLength={500}
              disabled={isView}
            />
          </FormField>

          {modo !== "ver" && (
            <div className="flex justify-end gap-3 pt-4">
              <CustomButton
                type="submit"
                color="primary"
                loading={loading}
                disabled={loading}
              >
                {modo === "crear"
                  ? loading
                    ? "Agregando..."
                    : "Agregar Miembro"
                  : loading
                  ? "Guardando..."
                  : "Guardar Cambios"}
              </CustomButton>
            </div>
          )}
        </form>
      </ProCard.Content>
    </ProCard>
  );
};
