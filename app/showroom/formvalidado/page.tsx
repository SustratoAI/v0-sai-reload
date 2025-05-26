// app/showroom/formvalidado/page.tsx
"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showroomFormSchema, showroomObjectSchema, type ShowroomFormValues } from "./schema";
import { CustomInputExperimental } from "@/components/ui/custom-input-experimental";
import { FormField } from "@/components/ui/form-field";
import { CustomButton } from "@/components/ui/custom-button";
import { ProCard } from "@/components/ui/pro-card";
import { Text } from "@/components/ui/text"; // Asumiendo que está disponible
import { User, Mail, KeyRound, LinkIcon, MessageSquare, UserCog, Edit3, Palette, Check, AlertTriangle, Edit, ShieldCheck } from "lucide-react";
import type { InputVariant } from "@/lib/theme/components/input-tokens";
import { ZodOptionalDef, ZodStringDef, ZodStringCheck } from "zod"; // Ampliado para ZodStringCheck

// Tipo para los checks de Zod, un poco más específico
type ZodMaxCheck = ZodStringCheck & { kind: "max"; value: number };
type ZodMinCheck = ZodStringCheck & { kind: "min"; value: number };
type ZodRegexCheck = ZodStringCheck & { kind: "regex" };


export default function ShowroomFormValidadoPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValidating, touchedFields, dirtyFields }, // Añadido touchedFields, dirtyFields
    reset,
    watch,
    setValue,
    trigger, // Para validación manual si es necesario
  } = useForm<ShowroomFormValues>({
    resolver: zodResolver(showroomFormSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "Ada Lovelace",
      email: "",
      username: "ada_dev_1815",
      age: undefined,
      password: "",
      confirmPassword: "",
      website: "https://sustrato.ai",
      comments: "Este es un comentario inicial para probar el contador.",
    }
  });

  const [submissionStatus, setSubmissionStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [isFullNameEditing, setIsFullNameEditing] = React.useState(false);

  const onSubmit: SubmitHandler<ShowroomFormValues> = async (data) => {
    console.log("Formulario enviado:", data);
    setSubmissionStatus("idle");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (data.username === "error_test_user") {
      console.error("Simulated server error for user:", data.username);
      alert("Error simulado del servidor. (Usuario: error_test_user)");
      setSubmissionStatus("error");
    } else {
      alert("Formulario Válido y Enviado (simulado):\n" + JSON.stringify(data, null, 2));
      setSubmissionStatus("success");
      // Opcional: resetear el formulario después de un envío exitoso
      // reset();
    }
  };

  const [currentVariant, setCurrentVariant] = React.useState<InputVariant>("default");
  const variants = ["default", "primary", "secondary", "tertiary", "accent", "neutral"] as const;

  const commentsMaxLength = React.useMemo(() => {
    const commentsSchemaDef = showroomObjectSchema.shape.comments._def as ZodOptionalDef<any>;
    const innerStringSchemaDef = commentsSchemaDef.innerType._def as ZodStringDef;
    const checks = innerStringSchemaDef.checks as ZodMaxCheck[];
    return checks.find(ch => ch.kind === "max")?.value || 200;
  }, []);

  // Observar valores para lógica de success
  const passwordValue = watch("password");
  const confirmPasswordValue = watch("confirmPassword");
  const emailValue = watch("email");
  const fullNameValue = watch("fullName");
  const usernameValue = watch("username");
  const websiteValue = watch("website");
  const commentsValue = watch("comments");
  const ageValue = watch("age");


  // Lógica para determinar si el password cumple con los requisitos (simplificada, Zod ya lo hace)
  // Para la UI de 'success', nos basta con que Zod no marque error y el campo tenga valor
  const isPasswordPotentiallyValid = (pw: string | undefined): boolean => {
    if (!pw) return false;
    // Aquí podrías replicar las regex de Zod si quieres un feedback visual ANTES de Zod,
    // pero para el estado 'success' post-validación, !errors.password es suficiente.
    // Por ahora, solo verificamos que no esté vacío para el estado 'success' visual.
    return pw.length > 0;
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ProCard className="max-w-2xl mx-auto">
        <ProCard.Header>
          <Text variant="heading" size="2xl" color="primary"> Showroom: Formulario Avanzado (Input Experimental) </Text>
          <Text variant="default" color="neutral" className="mt-1"> Probando características completas de `CustomInputExperimental.tsx`. </Text>
          <div className="mt-4">
            <Text size="sm" color="neutral" className="mb-1">Cambiar Variante Global de Inputs:</Text>
            <div className="flex flex-wrap gap-2">
              {variants.map(v => ( <CustomButton key={v} size="xs" onClick={() => setCurrentVariant(v)} color={currentVariant === v ? (v === "neutral" ? "primary" : v) : "default"} variant={currentVariant === v ? "solid" : "outline"} > {v} </CustomButton> ))}
            </div>
          </div>
        </ProCard.Header>
        <ProCard.Content>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField label="Nombre Completo (Prueba Edición/ReadOnly) *" htmlFor="fullName" hint={!errors.fullName && !isFullNameEditing ? "Haz clic en editar para modificar." : !errors.fullName && isFullNameEditing ? "Modo edición activo." : undefined} >
              <div className="flex items-center gap-2">
                <CustomInputExperimental id="fullName" leadingIcon={User} placeholder="Ej: Ada Lovelace"
                  error={errors.fullName?.message}
                  success={!errors.fullName && !!fullNameValue && (touchedFields.fullName || dirtyFields.fullName || submissionStatus === 'success')}
                  successMessage="Nombre completo luce bien"
                  variant={currentVariant} isEditing={isFullNameEditing} readOnly={!isFullNameEditing}
                  {...register("fullName")} />
                <CustomButton type="button" size="sm" variant="outline" onClick={() => setIsFullNameEditing(!isFullNameEditing)} leftIcon={isFullNameEditing ? <ShieldCheck /> : <Edit />} color={isFullNameEditing ? "success" : "secondary"} > {isFullNameEditing ? "Guardar" : "Editar"} </CustomButton>
              </div>
            </FormField>

            <FormField label="ID de Usuario (Solo Lectura)" htmlFor="userIdReadOnly" hint="Este campo no se puede modificar." >
              <CustomInputExperimental id="userIdReadOnly" value="usr_abc123xyz" readOnly variant={currentVariant} leadingIcon={UserCog} />
            </FormField>

            <FormField label="Correo Electrónico *" htmlFor="email" hint={!errors.email ? "Asegúrate que sea un correo válido." : undefined} >
              <CustomInputExperimental id="email" type="email" leadingIcon={Mail} placeholder="tu@correo.com"
                error={errors.email?.message}
                success={!errors.email && !!emailValue && (touchedFields.email || dirtyFields.email || submissionStatus === 'success')}
                successMessage="Correo electrónico válido"
                variant={currentVariant}
                {...register("email")} />
            </FormField>

            <FormField label="Nombre de Usuario (Opcional)" htmlFor="username" hint={!errors.username ? "3-15 caract. alfanuméricos/guion bajo. Prueba 'error_test_user' para simular error de servidor." : undefined} >
              <CustomInputExperimental id="username" leadingIcon={UserCog} placeholder="Ej: ada_dev_1815 o error_test_user"
                error={errors.username?.message}
                success={!errors.username && !!usernameValue && (touchedFields.username || dirtyFields.username || submissionStatus === 'success')}
                successMessage="Nombre de usuario disponible (simulado)"
                variant={currentVariant}
                {...register("username")} />
            </FormField>

            <FormField label="Edad (Opcional)" htmlFor="age" hint={!errors.age ? "Mayor o igual a 18." : undefined} >
              <CustomInputExperimental id="age" type="number" leadingIcon={Edit3} placeholder="Ej: 25"
                error={errors.age?.message}
                success={!errors.age && ageValue !== undefined && ageValue !== null && (touchedFields.age || dirtyFields.age || submissionStatus === 'success')}
                successMessage="Edad válida"
                variant={currentVariant}
                {...register("age")} />
            </FormField>

            <FormField label="Contraseña *" htmlFor="password" hint={!errors.password ? "Mín. 8 caract: 1 mayús, 1 minús, 1 núm." : undefined} >
              <CustomInputExperimental id="password" type="password" leadingIcon={KeyRound} placeholder="Tu contraseña segura"
                error={errors.password?.message}
                success={!errors.password && isPasswordPotentiallyValid(passwordValue) && (touchedFields.password || dirtyFields.password || submissionStatus === 'success')}
                successMessage="Contraseña segura"
                variant={currentVariant}
                {...register("password")} />
            </FormField>

            <FormField label="Confirmar Contraseña *" htmlFor="confirmPassword" hint={!errors.confirmPassword ? "Debe coincidir con la contraseña." : undefined} >
              <CustomInputExperimental id="confirmPassword" type="password" leadingIcon={KeyRound} placeholder="Repite tu contraseña"
                error={errors.confirmPassword?.message}
                success={!errors.confirmPassword && !!confirmPasswordValue && confirmPasswordValue === passwordValue && (touchedFields.confirmPassword || dirtyFields.confirmPassword || submissionStatus === 'success')}
                successMessage="Las contraseñas coinciden"
                variant={currentVariant}
                {...register("confirmPassword")} />
            </FormField>

            <FormField label="Sitio Web (Opcional)" htmlFor="website" hint={!errors.website ? "Ej: http://sitio.com" : undefined} >
              <CustomInputExperimental id="website" type="url" leadingIcon={LinkIcon} placeholder="http://tu-sitio.com"
                error={errors.website?.message}
                success={!errors.website && !!websiteValue && (touchedFields.website || dirtyFields.website || submissionStatus === 'success')}
                successMessage="URL válida"
                variant={currentVariant}
                {...register("website")} />
            </FormField>

            <FormField label="Comentarios (Opcional, con Contador)" htmlFor="comments" hint={!errors.comments ? `Máximo ${commentsMaxLength} caracteres.` : undefined} >
              <CustomInputExperimental id="comments" leadingIcon={MessageSquare} placeholder="Tus comentarios aquí..."
                error={errors.comments?.message}
                success={!errors.comments && !!commentsValue && (touchedFields.comments || dirtyFields.comments || submissionStatus === 'success')}
                successMessage="Comentario recibido"
                variant={currentVariant} showCharacterCount maxLength={commentsMaxLength}
                {...register("comments")} />
            </FormField>

            <div className="pt-4"> <CustomButton type="submit" color="primary" loading={isSubmitting || isValidating} disabled={isSubmitting || isValidating} fullWidth > {isSubmitting ? "Enviando..." : isValidating ? "Validando..." : "Probar y Enviar"} </CustomButton> </div>
          </form>
        </ProCard.Content>
        <ProCard.Footer> <Text variant="caption" color="neutral" colorVariant="textShade"> Los campos marcados con * son obligatorios. Prueba cambiar la variante y los diferentes estados de los campos. </Text> </ProCard.Footer>
      </ProCard>
    </div>
  );
}
CustomInputExperimental.displayName = "CustomInputExperimental";
export { CustomInputExperimental };