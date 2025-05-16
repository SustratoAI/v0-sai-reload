"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/auth-provider";
import {
  agregarMiembroAProyecto,
  obtenerRolesDisponiblesProyecto,
} from "@/lib/actions/member-actions";
import { Text } from "@/components/ui/text";
import { ProCard } from "@/components/ui/pro-card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectCustom } from "@/components/ui/select-custom";
import { CustomButton } from "@/components/ui/custom-button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, UserPlus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";

// Esquema de validación para el formulario
const formSchema = z.object({
  emailUsuario: z
    .string()
    .email("Email inválido")
    .min(1, "El email es requerido"),
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

// Tipos para el formulario
type MiembroFormValues = z.infer<typeof formSchema>;

// Tipo para las opciones de roles
interface RolOption {
  value: string;
  label: string;
}

export default function CrearMiembroPage() {
  const router = useRouter();
  const params = useParams();
  const { proyectoActual } = useAuth();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<RolOption[]>([]);

  const form = useForm<MiembroFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailUsuario: "",
      rolId: "",
      firstName: "",
      lastName: "",
      displayName: "",
      institution: "",
      phone: "",
      notes: "",
      language: "",
      pronouns: "",
    },
  });

  // Cargar roles disponibles
  useEffect(() => {
    const cargarRoles = async () => {
      setIsLoading(true);
      try {
        if (!proyectoActual?.id) {
          setRoles([]);
          setIsLoading(false);
          return;
        }
        const resultado = await obtenerRolesDisponiblesProyecto(proyectoActual.id);
        if (resultado.success) {
          const opcionesRoles = resultado.data.map((rol) => ({
            value: rol.id,
            label: rol.role_name,
          }));
          setRoles(opcionesRoles);
        } else {
          toast({
            title: "Error al cargar roles",
            description: resultado.error,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error al cargar roles:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los roles disponibles",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    cargarRoles();
  }, [toast, proyectoActual?.id]);

  const onSubmit = async (data: MiembroFormValues) => {
    console.log('CrearMiembroPage onSubmit', data);
    if (!proyectoActual?.id) {
      toast({
        title: "Error",
        description: "ID de proyecto no disponible",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const resultado = await agregarMiembroAProyecto({
        proyectoId: proyectoActual.id,
        emailUsuarioNuevo: data.emailUsuario,
        rolIdAsignar: data.rolId,
        datosPerfilInicial: {
          first_name: data.firstName,
          last_name: data.lastName,
          public_display_name: data.displayName,
          primary_institution: data.institution,
          contact_phone: data.phone,
          general_notes: data.notes,
          preferred_language: data.language,
          pronouns: data.pronouns,
        },
      });

      if (resultado.success) {
        toast({
          title: "Miembro agregado",
          description: "El miembro fue agregado exitosamente al proyecto.",
          variant: "default",
        });
        router.push("/datos-maestros/miembros");
      } else {
        let errorMessage = resultado.error;

        // Mensajes personalizados para códigos de error específicos
        if (resultado.errorCode === "USER_NOT_FOUND") {
          errorMessage = `No se encontró un usuario con el email '${data.emailUsuario}'.`;
        } else if (resultado.errorCode === "ALREADY_MEMBER") {
          errorMessage = "El usuario ya es miembro de este proyecto.";
        } else if (resultado.errorCode === "FORBIDDEN") {
          errorMessage = "No tienes permisos para realizar esta acción.";
        }

        toast({
          title: "Error al agregar miembro",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al agregar miembro:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push("/datos-maestros/miembros");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <SustratoLoadingLogo
          size={50}
          variant="spin-pulse"
          showText={true}
          text="Cargando..."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agregar Miembro al Proyecto"
        description="Completa el formulario para agregar un nuevo miembro al proyecto."
        actions={
          <CustomButton
            onClick={handleCancel}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            variant="outline"
          >
            Volver
          </CustomButton>
        }
      />

      <ProCard>
        <ProCard.Header>
          <Text variant="heading" size="lg">
            Información del Miembro
          </Text>
        </ProCard.Header>
        <ProCard.Content>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Email del Usuario"
                htmlFor="emailUsuario"
                error={form.formState.errors.emailUsuario?.message}
                required
              >
                <Input
                  id="emailUsuario"
                  placeholder="correo@ejemplo.com"
                  {...form.register("emailUsuario")}
                  error={form.formState.errors.emailUsuario?.message}
                />
              </FormField>

              <FormField
                label="Rol en el Proyecto"
                htmlFor="rolId"
                error={form.formState.errors.rolId?.message}
                required
              >
                <SelectCustom
                  id="rolId"
                  placeholder="Selecciona un rol"
                  options={roles}
                  value={form.watch("rolId")}
                  onChange={(value) => form.setValue("rolId", value as string)}
                  error={form.formState.errors.rolId?.message}
                />
              </FormField>
            </div>

            <Text variant="heading" size="md" className="mt-6 mb-2">
              Información Adicional de Perfil (Opcional)
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre" htmlFor="firstName">
                <Input
                  id="firstName"
                  placeholder="Nombre"
                  {...form.register("firstName")}
                />
              </FormField>

              <FormField label="Apellido" htmlFor="lastName">
                <Input
                  id="lastName"
                  placeholder="Apellido"
                  {...form.register("lastName")}
                />
              </FormField>

              <FormField label="Nombre para mostrar" htmlFor="displayName">
                <Input
                  id="displayName"
                  placeholder="Nombre público"
                  {...form.register("displayName")}
                />
              </FormField>

              <FormField label="Institución" htmlFor="institution">
                <Input
                  id="institution"
                  placeholder="Institución o afiliación"
                  {...form.register("institution")}
                />
              </FormField>

              <FormField label="Teléfono" htmlFor="phone">
                <Input
                  id="phone"
                  placeholder="Teléfono de contacto"
                  {...form.register("phone")}
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
                  onChange={(value) =>
                    form.setValue("language", value as string)
                  }
                />
              </FormField>

              <FormField
                label="Pronombres"
                htmlFor="pronouns"
                className="col-span-1"
              >
                <Input
                  id="pronouns"
                  placeholder="Pronombres"
                  {...form.register("pronouns")}
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
              />
            </FormField>

            <div className="flex justify-end gap-3 pt-4">
              <CustomButton
                type="button"
                onClick={handleCancel}
                variant="outline"
              >
                Cancelar
              </CustomButton>
              <CustomButton
                type="submit"
                color="primary"
                leftIcon={
                  isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )
                }
                disabled={isSubmitting}
              >
                {isSubmitting ? "Agregando..." : "Agregar Miembro"}
              </CustomButton>
            </div>
          </form>
        </ProCard.Content>
      </ProCard>
    </div>
  );
}
