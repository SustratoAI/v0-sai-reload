"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SelectCustom } from "@/components/ui/select-custom";
import { CustomButton } from "@/components/ui/custom-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import {
  agregarMiembroAProyecto,
  actualizarRolMiembroEnProyecto,
  obtenerRolesDisponibles,
  type ProjectMemberDetails,
} from "@/lib/actions/member-actions";
import { Text } from "@/components/ui/text";
import { FormField as CustomFormField } from "@/components/ui/form-field";

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

// Para el modo de edición, solo permitimos cambiar el rol
const editFormSchema = z.object({
  rolId: z.string().min(1, "Debe seleccionar un rol"),
});

// Tipos para el formulario
type MiembroFormValues = z.infer<typeof formSchema>;
type MiembroEditFormValues = z.infer<typeof editFormSchema>;

// Propiedades del componente
interface MiembroFormDialogProps {
  open: boolean;
  projectId: string;
  miembroExistente: ProjectMemberDetails | null;
  onClose: (actualizado?: boolean) => void;
}

// Tipo para las opciones de roles
interface RolOption {
  value: string;
  label: string;
}

export default function MiembroFormDialog({
  open,
  projectId,
  miembroExistente,
  onClose,
}: MiembroFormDialogProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<RolOption[]>([]);
  const isEditMode = !!miembroExistente;

  // Cargar roles disponibles
  useEffect(() => {
    const cargarRoles = async () => {
      setIsLoading(true);
      try {
        const resultado = await obtenerRolesDisponibles();
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
  }, [toast]);

  // Formulario para agregar
  const formAdd = useForm<MiembroFormValues>({
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

  // Formulario para editar
  const formEdit = useForm<MiembroEditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      rolId: miembroExistente?.project_role_id || "",
    },
  });

  // Actualizar valores por defecto al cambiar el miembro existente
  useEffect(() => {
    if (miembroExistente && isEditMode) {
      formEdit.reset({
        rolId: miembroExistente.project_role_id,
      });
    }
  }, [miembroExistente, isEditMode, formEdit]);

  // Manejar el envío del formulario de agregar
  const onSubmitAdd = async (data: MiembroFormValues) => {
    if (!projectId) {
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
        proyectoId: projectId,
        emailUsuario: data.emailUsuario,
        rolId: data.rolId,
        perfilData: {
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          institution: data.institution,
          phone: data.phone,
          notes: data.notes,
          language: data.language,
          pronouns: data.pronouns,
        },
      });

      if (resultado.success) {
        toast({
          title: "Miembro agregado",
          description: "El miembro ha sido agregado al proyecto exitosamente.",
        });
        onClose(true);
      } else {
        let errorMessage = resultado.error;

        // Mensajes personalizados para códigos de error específicos
        if (resultado.errorCode === "USER_NOT_FOUND") {
          errorMessage = `No se encontró un usuario con el email '${data.emailUsuario}'.`;
        } else if (resultado.errorCode === "ALREADY_MEMBER") {
          errorMessage = "El usuario ya es miembro de este proyecto.";
        } else if (resultado.errorCode === "FORBIDDEN") {
          errorMessage = "No tienes permiso para realizar esta acción.";
        }

        toast({
          title: "Error al agregar miembro",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manejar el envío del formulario de edición
  const onSubmitEdit = async (data: MiembroEditFormValues) => {
    if (!projectId || !miembroExistente) {
      toast({
        title: "Error",
        description: "Datos de miembro no disponibles",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const resultado = await actualizarRolMiembroEnProyecto({
        projectMemberId: miembroExistente.project_member_id,
        nuevoRolId: data.rolId,
        proyectoId: projectId,
      });

      if (resultado.success) {
        toast({
          title: "Rol actualizado",
          description: "El rol del miembro ha sido actualizado exitosamente.",
        });
        onClose(true);
      } else {
        toast({
          title: "Error al actualizar rol",
          description: resultado.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error inesperado",
        description: "Ocurrió un error al procesar la solicitud.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Obtener el nombre del miembro para mostrar en el título en modo edición
  const getNombreMiembro = (): string => {
    if (!miembroExistente || !miembroExistente.profile) return "miembro";

    const profile = miembroExistente.profile;
    if (profile.public_display_name) {
      return profile.public_display_name;
    }
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return "miembro";
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode
              ? `Editar rol de ${getNombreMiembro()}`
              : "Agregar nuevo miembro"}
          </DialogTitle>
        </DialogHeader>

        {isEditMode ? (
          // Formulario para editar
          <Form {...formEdit}>
            <form
              onSubmit={formEdit.handleSubmit(onSubmitEdit)}
              className="space-y-6"
            >
              <div className="grid gap-4">
                {miembroExistente?.profile?.public_contact_email && (
                  <div>
                    <Text className="text-sm font-medium mb-2">Email</Text>
                    <Text className="text-sm text-muted-foreground">
                      {miembroExistente.profile.public_contact_email}
                    </Text>
                  </div>
                )}

                <FormField
                  control={formEdit.control}
                  name="rolId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rol del miembro</FormLabel>
                      <FormControl>
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span className="text-sm text-muted-foreground">
                              Cargando roles...
                            </span>
                          </div>
                        ) : (
                          <SelectCustom
                            options={roles}
                            placeholder="Selecciona un rol"
                            {...field}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <DialogFooter>
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => onClose()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  leftIcon={
                    isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : undefined
                  }
                  color="primary"
                >
                  Guardar cambios
                </CustomButton>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          // Formulario para agregar
          <Form {...formAdd}>
            <form
              onSubmit={formAdd.handleSubmit(onSubmitAdd)}
              className="space-y-6"
            >
              <div className="grid gap-4">
                <CustomFormField
                  label="Email del investigador"
                  htmlFor="emailUsuario"
                >
                  <Input
                    id="emailUsuario"
                    placeholder="email@ejemplo.com"
                    {...formAdd.register("emailUsuario")}
                  />
                  {formAdd.formState.errors.emailUsuario && (
                    <Text className="text-sm text-destructive mt-1">
                      {formAdd.formState.errors.emailUsuario.message}
                    </Text>
                  )}
                </CustomFormField>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <CustomFormField label="Nombre" htmlFor="firstName">
                    <Input
                      id="firstName"
                      placeholder="Nombre"
                      {...formAdd.register("firstName")}
                    />
                  </CustomFormField>

                  <CustomFormField label="Apellido" htmlFor="lastName">
                    <Input
                      id="lastName"
                      placeholder="Apellido"
                      {...formAdd.register("lastName")}
                    />
                  </CustomFormField>
                </div>

                <CustomFormField label="Nombre público" htmlFor="displayName">
                  <Input
                    id="displayName"
                    placeholder="Nombre para mostrar públicamente"
                    {...formAdd.register("displayName")}
                  />
                </CustomFormField>

                <CustomFormField label="Institución" htmlFor="institution">
                  <Input
                    id="institution"
                    placeholder="Institución principal"
                    {...formAdd.register("institution")}
                  />
                </CustomFormField>

                <CustomFormField label="Teléfono de contacto" htmlFor="phone">
                  <Input
                    id="phone"
                    placeholder="Teléfono de contacto"
                    {...formAdd.register("phone")}
                  />
                </CustomFormField>

                <CustomFormField label="Idioma preferido" htmlFor="language">
                  <Input
                    id="language"
                    placeholder="Idioma preferido (ej. Español, English)"
                    {...formAdd.register("language")}
                  />
                </CustomFormField>

                <CustomFormField label="Pronombres" htmlFor="pronouns">
                  <Input
                    id="pronouns"
                    placeholder="Pronombres (ej. él/él, ella/ella)"
                    {...formAdd.register("pronouns")}
                  />
                </CustomFormField>

                <CustomFormField label="Notas generales" htmlFor="notes">
                  <Textarea
                    id="notes"
                    placeholder="Notas adicionales sobre este miembro"
                    rows={3}
                    {...formAdd.register("notes")}
                  />
                </CustomFormField>

                <CustomFormField label="Rol en el proyecto" htmlFor="rolId">
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        Cargando roles...
                      </span>
                    </div>
                  ) : (
                    <SelectCustom
                      id="rolId"
                      options={roles}
                      placeholder="Selecciona un rol"
                      value={formAdd.watch("rolId")}
                      onChange={(value) =>
                        formAdd.setValue("rolId", value as string)
                      }
                    />
                  )}
                  {formAdd.formState.errors.rolId && (
                    <Text className="text-sm text-destructive mt-1">
                      {formAdd.formState.errors.rolId.message}
                    </Text>
                  )}
                </CustomFormField>
              </div>

              <DialogFooter>
                <CustomButton
                  type="button"
                  variant="outline"
                  onClick={() => onClose()}
                  disabled={isSubmitting}
                >
                  Cancelar
                </CustomButton>
                <CustomButton
                  type="submit"
                  disabled={isSubmitting}
                  leftIcon={
                    isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : undefined
                  }
                  color="primary"
                >
                  Agregar miembro
                </CustomButton>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
