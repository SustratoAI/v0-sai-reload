"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import {
  obtenerDetallesMiembro,
  eliminarMiembroDeProyecto,
} from "@/lib/actions/member-actions";
import { Text } from "@/components/ui/text";
import { ProCard } from "@/components/ui/pro-card";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Trash2, AlertCircle, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";
import type { ProjectMemberDetails } from "@/lib/actions/member-actions";

export default function EliminarMiembroPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params.id as string;
  const { proyectoActual } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [miembro, setMiembro] = useState<ProjectMemberDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del miembro
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      setError(null);

      if (!proyectoActual?.id) {
        setError("No hay un proyecto seleccionado.");
        setIsLoading(false);
        return;
      }

      try {
        const resultadoMiembro = await obtenerDetallesMiembro(
          proyectoActual.id,
          memberId
        );

        if (!resultadoMiembro.success) {
          setError(
            resultadoMiembro.error || "Error al cargar datos del miembro"
          );
          setIsLoading(false);
          return;
        }

        setMiembro(resultadoMiembro.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        setError("Error al cargar datos del miembro");
      } finally {
        setIsLoading(false);
      }
    };

    if (proyectoActual?.id && memberId) {
      cargarDatos();
    }
  }, [proyectoActual?.id, memberId]);

  const handleCancelar = () => {
    router.push("/datos-maestros/miembros");
  };

  const handleConfirmarEliminar = async () => {
    if (!proyectoActual?.id || !miembro) {
      toast({
        title: "Error",
        description: "No se puede procesar la solicitud con los datos actuales",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const resultado = await eliminarMiembroDeProyecto({
        proyectoId: proyectoActual.id,
        projectMemberId: memberId,
      });

      if (resultado.success) {
        toast({
          title: "Miembro eliminado",
          description:
            "El miembro ha sido eliminado del proyecto exitosamente.",
        });
        router.push("/datos-maestros/miembros");
      } else {
        toast({
          title: "Error al eliminar",
          description: resultado.error || "No se pudo eliminar al miembro",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error al eliminar miembro:", error);
      toast({
        title: "Error",
        description: "Ocurrió un error al procesar la solicitud",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getNombreMiembro = (): string => {
    if (!miembro) return "Miembro";

    const profile = miembro.profile;
    if (profile?.public_display_name) {
      return profile.public_display_name;
    }

    if (profile?.first_name || profile?.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }

    return "Miembro";
  };

  if (isLoading) {
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

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Error"
          description={error}
          actions={
            <CustomButton
              onClick={handleCancelar}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              variant="outline"
            >
              Volver
            </CustomButton>
          }
        />
      </div>
    );
  }

  if (!miembro) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Miembro no encontrado"
          description="No se encontró información para este miembro."
          actions={
            <CustomButton
              onClick={handleCancelar}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              variant="outline"
            >
              Volver
            </CustomButton>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Eliminar Miembro"
        description="Confirma la eliminación del miembro del proyecto."
        actions={
          <CustomButton
            onClick={handleCancelar}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
            variant="outline"
          >
            Volver
          </CustomButton>
        }
      />

      <ProCard className="border-destructive bg-destructive/5">
        <ProCard.Content className="flex flex-col items-center py-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <Text variant="heading" size="lg" className="mb-2">
            ¿Estás seguro de eliminar a este miembro?
          </Text>
          <Text className="mb-6">
            Estás a punto de eliminar a <strong>{getNombreMiembro()}</strong>{" "}
            del proyecto. Esta acción no se puede deshacer.
          </Text>

          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <CustomButton
              onClick={handleCancelar}
              variant="outline"
              className="min-w-[120px]"
            >
              Cancelar
            </CustomButton>
            <CustomButton
              onClick={handleConfirmarEliminar}
              color="danger"
              leftIcon={
                isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )
              }
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </CustomButton>
          </div>
        </ProCard.Content>
      </ProCard>
    </div>
  );
}
