// app/datos-maestros/miembros/[id]/modificar/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import {
  obtenerDetallesMiembroProyecto,
  obtenerRolesDisponiblesProyecto,
  modificarDetallesMiembroEnProyecto,
  ProjectMemberDetails,
  ProjectRoleInfo,
  ResultadoOperacion,
  MemberProfileData,
} from "@/lib/actions/member-actions";
import { CustomButton } from "@/components/ui/custom-button";
import { PageHeader } from "@/components/common/page-header";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";
import { MiembroForm, MiembroFormValues } from "@/app/datos-maestros/miembros/components/MiembroForm";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useLoading } from "@/contexts/LoadingContext";

interface RolOption {
  value: string;
  label: string;
}

export default function ModificarMiembroPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id ? String(params.id) : "";
  const { proyectoActual } = useAuth();
  const { toast } = useToast();
  const { showLoading, hideLoading } = useLoading(); // isLoading: isGlobalLoading no se usa aquí

  const [isButtonSubmitting, setIsButtonSubmitting] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [roles, setRoles] = useState<RolOption[]>([]);
  const [miembro, setMiembro] = useState<ProjectMemberDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = useCallback(async () => {
    // ... (Lógica de cargarDatos sin cambios, como la teníamos) ...
    console.log("[Page] cargarDatos: Iniciando carga de datos de página...");
    setIsPageLoading(true);
    setError(null);
    setMiembro(null);

    if (!proyectoActual?.id) {
      console.log("[Page] cargarDatos: No hay proyecto actual ID.");
      setError("No hay un proyecto activo seleccionado. Por favor, seleccione uno.");
      setIsPageLoading(false);
      return;
    }
    if (!memberId) {
      console.log("[Page] cargarDatos: No hay memberId.");
      setError("ID de miembro no especificado en la URL.");
      setIsPageLoading(false);
      return;
    }
    try {
      console.log(`[Page] cargarDatos: Cargando roles para proyecto ID: ${proyectoActual.id}`);
      const resultadoRoles = await obtenerRolesDisponiblesProyecto(proyectoActual.id);
      if (!resultadoRoles.success) {
        console.error("[Page] cargarDatos: Error al cargar roles:", resultadoRoles.error);
        setError(resultadoRoles.error || "Error al cargar los roles disponibles.");
        setIsPageLoading(false);
        return;
      }
      const opcionesRoles = resultadoRoles.data.map((rol: ProjectRoleInfo) => ({
        value: rol.id,
        label: rol.role_name,
      }));
      setRoles(opcionesRoles);
      console.log("[Page] cargarDatos: Roles cargados:", opcionesRoles.length);

      console.log(`[Page] cargarDatos: Cargando detalles para miembro ID: ${memberId} en proyecto ID: ${proyectoActual.id}`);
      const resultadoMiembro = await obtenerDetallesMiembroProyecto(memberId, proyectoActual.id);
      if (!resultadoMiembro.success) {
        console.error("[Page] cargarDatos: Error al cargar datos del miembro:", resultadoMiembro.error);
        setError(resultadoMiembro.error || "Error al cargar la información del miembro.");
        setIsPageLoading(false);
        return;
      }
      if (!resultadoMiembro.data) {
        console.warn("[Page] cargarDatos: No se encontraron datos para el miembro.");
        setError("El miembro especificado no fue encontrado.");
        setIsPageLoading(false);
        return;
      }
      setMiembro(resultadoMiembro.data);
      console.log("[Page] cargarDatos: Datos del miembro cargados.");
    } catch (err) {
      console.error("[Page] cargarDatos: Excepción:", err);
      setError(`Error inesperado al cargar datos: ${(err as Error).message}`);
    } finally {
      console.log("[Page] cargarDatos: Finalizando, setIsPageLoading(false)");
      setIsPageLoading(false);
    }
  }, [proyectoActual?.id, memberId]);

  useEffect(() => {
    // ... (useEffect principal sin cambios, como lo teníamos) ...
    console.log("[Page] useEffect principal. proyectoActual?.id:", proyectoActual?.id, "memberId:", memberId);
    if (proyectoActual?.id && memberId) {
      cargarDatos();
    } else if (!proyectoActual?.id && !isPageLoading) { 
        setError("Esperando selección de proyecto activo...");
    } else if (!memberId && proyectoActual?.id && !isPageLoading) {
        setError("ID de miembro no especificado.");
    }
  }, [proyectoActual?.id, memberId, cargarDatos]);

  // PRUEBA 1: onSubmit SIMPLIFICADO
  const onSubmit = async (data: MiembroFormValues) => {
    console.log('[Page] onSubmit (PRUEBA 1) - Datos del formulario:', data);
    if (!proyectoActual?.id || !memberId || !miembro) {
      toast({ title: "Error de Aplicación (Prueba 1)", description: "Faltan datos esenciales.", variant: "destructive" });
      return;
    }

    // Preparar payloads (esta parte es necesaria para la lógica de "Sin cambios" y para la llamada real)
    const profileUpdates: Partial<Omit<MemberProfileData, "user_id" | "public_contact_email">> = {};
    if (data.firstName !== (miembro.profile?.first_name || "")) profileUpdates.first_name = data.firstName;
    if (data.lastName !== (miembro.profile?.last_name || "")) profileUpdates.last_name = data.lastName;
    // ... (completar con todos los campos de profileUpdates como en la versión anterior)
    if (data.displayName !== (miembro.profile?.public_display_name || "")) profileUpdates.public_display_name = data.displayName;
    if (data.institution !== (miembro.profile?.primary_institution || "")) profileUpdates.primary_institution = data.institution;
    if (data.phone !== (miembro.profile?.contact_phone || "")) profileUpdates.contact_phone = data.phone;
    if (data.notes !== (miembro.profile?.general_notes || "")) profileUpdates.general_notes = data.notes;
    if (data.language !== (miembro.profile?.preferred_language || "")) profileUpdates.preferred_language = data.language;
    if (data.pronouns !== (miembro.profile?.pronouns || "")) profileUpdates.pronouns = data.pronouns;


    const memberUpdatesForAction: Parameters<typeof modificarDetallesMiembroEnProyecto>[0]['memberUpdates'] = {};
    if (data.rolId && data.rolId !== miembro.project_role_id) {
      memberUpdatesForAction.nuevoRolId = data.rolId;
    }
    // ... (otros campos de memberUpdates si los tienes)

    if (Object.keys(profileUpdates).length === 0 && Object.keys(memberUpdatesForAction).length === 0) {
      console.log("[Page] onSubmit (PRUEBA 1): No se detectaron cambios.");
      toast({ title: "Sin Cambios (Prueba 1)", description: "No se detectaron modificaciones." });
      return; 
    }

    // Para esta prueba, setIsButtonSubmitting y showLoading siguen siendo útiles
    setIsButtonSubmitting(true); 
    showLoading("Actualizando (Prueba 1)..."); 

    const payloadFinal: Parameters<typeof modificarDetallesMiembroEnProyecto>[0] = {
      proyectoId: proyectoActual.id,
      projectMemberId: memberId,
    };
    if (Object.keys(profileUpdates).length > 0) payloadFinal.profileUpdates = profileUpdates;
    if (Object.keys(memberUpdatesForAction).length > 0) payloadFinal.memberUpdates = memberUpdatesForAction;
    
    let resultado: ResultadoOperacion<null> | null = null;

    try {
      console.log('[Page] onSubmit (PRUEBA 1): Enviando actualización con payload:', JSON.stringify(payloadFinal, null, 2));
      resultado = await modificarDetallesMiembroEnProyecto(payloadFinal);
      console.log('[Page] onSubmit (PRUEBA 1): Resultado de SA:', resultado);
    } catch (err) {
      console.error("[Page] onSubmit (PRUEBA 1): Excepción al llamar a SA:", err);
      hideLoading(); 
      setIsButtonSubmitting(false);
      toast({
        title: "Error Inesperado en Comunicación (Prueba 1)",
        description: `Ocurrió un error: ${(err as Error).message}`,
        variant: "destructive",
      });
      return; 
    }

    // Lógica simplificada después de la respuesta de la SA para la PRUEBA 1
    hideLoading(); // Ocultar loading global INMEDIATAMENTE después de la respuesta

    if (resultado?.success) {
      console.log("[Page] onSubmit (PRUEBA 1): SA reportó ÉXITO. Mostrando toast...");
      toast({
        title: "ÉXITO (PRUEBA TOAST)",
        description: "Actualización correcta (SA dice success: true). ¿Me ves durante 5 segundos?",
        duration: 5000, 
      });
      console.log("[Page] onSubmit (PRUEBA 1): Toast de ÉXITO debería estar visible.");
      
      // NO HACEMOS NADA MÁS (ni setIsButtonSubmitting(false) aquí, ni redirección)
      // Dejamos que el toast viva sus 5 segundos.
      // El setIsButtonSubmitting(false) se podría poner en un setTimeout muy largo o quitarlo para esta prueba.
      setTimeout(() => {
          setIsButtonSubmitting(false); // Solo para que el botón no quede "cargando" eternamente en esta prueba
          console.log("[Page] onSubmit (PRUEBA 1): Botón submitting = false, después de 5s.");
      }, 5100);


    } else if (resultado) { 
      console.log("[Page] onSubmit (PRUEBA 1): SA reportó ERROR. Mostrando toast...");
      toast({
        title: "ERROR (PRUEBA TOAST)",
        description: resultado.error || "Error desconocido desde SA (Prueba 1).",
        variant: "destructive",
        duration: 5000,
      });
      console.log("[Page] onSubmit (PRUEBA 1): Toast de ERROR debería estar visible.");
      setIsButtonSubmitting(false); // Actualizar estado del botón
    } else {
        // Caso raro: resultado es null (no debería pasar si la SA siempre devuelve ResultadoOperacion)
        console.error("[Page] onSubmit (PRUEBA 1): Resultado de SA fue null, lo cual es inesperado.");
        toast({
            title: "Error Inesperado",
            description: "La respuesta del servidor fue inválida.",
            variant: "destructive",
        });
        setIsButtonSubmitting(false);
    }
  };

  // ... (handleCancel, getNombreMiembro, valoresIniciales sin cambios) ...
  const handleCancel = () => {
    router.push("/datos-maestros/miembros");
  };

  const getNombreMiembro = (): string => {
    if (!miembro?.profile) return "Miembro";
    const { public_display_name, first_name, last_name } = miembro.profile;
    if (public_display_name) return public_display_name;
    if (first_name || last_name) return `${first_name || ""} ${last_name || ""}`.trim();
    return "Miembro";
  };

  const valoresIniciales: MiembroFormValues | undefined = miembro ? {
    emailUsuario: miembro.profile?.public_contact_email || (miembro.user_id ? `Usuario ID: ${miembro.user_id.substring(0,8)}... (email no en perfil)` : "Email no disponible"),
    rolId: miembro.project_role_id || "",
    firstName: miembro.profile?.first_name || "",
    lastName: miembro.profile?.last_name || "",
    displayName: miembro.profile?.public_display_name || "",
    institution: miembro.profile?.primary_institution || "",
    phone: miembro.profile?.contact_phone || "",
    notes: miembro.profile?.general_notes || "",
    language: miembro.profile?.preferred_language || "",
    pronouns: miembro.profile?.pronouns || "",
  } : undefined;

  // ... (JSX para isPageLoading, error && !miembro, !miembro && !isPageLoading sin cambios) ...
  if (isPageLoading) {
    return (
      <div className="flex justify-center py-8">
        <SustratoLoadingLogo
          size={50}
          variant="spin-pulse"
          showText={true}
          text="Cargando datos del miembro..."
        />
      </div>
    );
  }

  if (error && !miembro) { 
    return (
      <div className="space-y-6">
        <PageHeader
          title="Error al Cargar Datos"
          description={error}
          actions={
            <CustomButton
              onClick={handleCancel}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              variant="outline"
            >
              Volver a Miembros
            </CustomButton>
          }
        />
      </div>
    );
  }
  
  if (!miembro && !isPageLoading) {
      return (
          <div className="space-y-6">
              <PageHeader
                  title="Miembro no Encontrado"
                  description="No se pudieron cargar los datos del miembro o el miembro no existe."
                  actions={
                      <CustomButton onClick={handleCancel} leftIcon={<ArrowLeft className="h-4 w-4" />} variant="outline">
                          Volver a Miembros
                      </CustomButton>
                  }
              />
          </div>
      );
  }
  
  // ... (JSX principal de retorno con PageHeader y MiembroForm sin cambios) ...
  return (
    <div className="space-y-6">
      <PageHeader
        title={`Editar Miembro: ${getNombreMiembro()}`}
        description="Actualiza la información del miembro en el proyecto."
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
      {valoresIniciales && roles.length > 0 && (
        <MiembroForm
          modo="editar"
          valoresIniciales={valoresIniciales}
          rolesDisponibles={roles}
          loading={isButtonSubmitting}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}