"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import { obtenerDetallesMiembroProyecto } from "@/lib/actions/member-actions";
import { Text } from "@/components/ui/text";
import { ProCard } from "@/components/ui/pro-card";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowLeft,
  Mail,
  Building,
  Phone,
  Globe,
  User,
  PenLine,
} from "lucide-react";
import { PageHeader } from "@/components/common/page-header";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";
import type { ProjectMemberDetails } from "@/lib/actions/member-actions";

export default function VerMiembroPage() {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id ? String(params.id) : "";
  const { proyectoActual } = useAuth();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
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
        const resultadoMiembro = await obtenerDetallesMiembroProyecto(
          memberId,
          proyectoActual.id
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

  const handleVolver = () => {
    router.push("/datos-maestros/miembros");
  };

  const handleEditar = () => {
    router.push(`/datos-maestros/miembros/${memberId}/modificar`);
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
              onClick={handleVolver}
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
              onClick={handleVolver}
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
        title={`Detalle de ${getNombreMiembro()}`}
        description="Información del miembro en el proyecto."
        actions={
          <div className="flex gap-2">
            <CustomButton
              onClick={handleVolver}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
              variant="outline"
            >
              Volver
            </CustomButton>
            <CustomButton
              onClick={handleEditar}
              leftIcon={<PenLine className="h-4 w-4" />}
              variant="outline"
            >
              Editar
            </CustomButton>
          </div>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProCard>
          <ProCard.Header>
            <Text variant="heading" size="lg">
              Información Personal
            </Text>
          </ProCard.Header>
          <ProCard.Content className="space-y-4">
            <div className="space-y-1">
              <Text variant="caption" color="muted">
                Nombre
              </Text>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <Text>{getNombreMiembro()}</Text>
              </div>
            </div>

            {miembro.profile?.public_contact_email && (
              <div className="space-y-1">
                <Text variant="caption" color="muted">
                  Correo electrónico
                </Text>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Text>{miembro.profile.public_contact_email}</Text>
                </div>
              </div>
            )}

            {miembro.profile?.primary_institution && (
              <div className="space-y-1">
                <Text variant="caption" color="muted">
                  Institución
                </Text>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <Text>{miembro.profile.primary_institution}</Text>
                </div>
              </div>
            )}

            {miembro.profile?.contact_phone && (
              <div className="space-y-1">
                <Text variant="caption" color="muted">
                  Teléfono
                </Text>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <Text>{miembro.profile.contact_phone}</Text>
                </div>
              </div>
            )}

            {miembro.profile?.preferred_language && (
              <div className="space-y-1">
                <Text variant="caption" color="muted">
                  Idioma preferido
                </Text>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <Text>
                    {miembro.profile.preferred_language === "es"
                      ? "Español"
                      : miembro.profile.preferred_language === "en"
                      ? "Inglés"
                      : miembro.profile.preferred_language === "pt"
                      ? "Portugués"
                      : miembro.profile.preferred_language}
                  </Text>
                </div>
              </div>
            )}

            {miembro.profile?.pronouns && (
              <div className="space-y-1">
                <Text variant="caption" color="muted">
                  Pronombres
                </Text>
                <Text>{miembro.profile.pronouns}</Text>
              </div>
            )}
          </ProCard.Content>
        </ProCard>

        <ProCard>
          <ProCard.Header>
            <Text variant="heading" size="lg">
              Información del Proyecto
            </Text>
          </ProCard.Header>
          <ProCard.Content className="space-y-4">
            <div className="space-y-1">
              <Text variant="caption" color="muted">
                Rol en el proyecto
              </Text>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                {miembro.role_name || "Sin rol asignado"}
              </div>
            </div>

            <div className="space-y-1">
              <Text variant="caption" color="muted">
                Fecha de incorporación
              </Text>
              <Text>
                {miembro.joined_at
                  ? new Date(miembro.joined_at).toLocaleDateString()
                  : "No disponible"}
              </Text>
            </div>

            {miembro.profile?.general_notes && (
              <div className="space-y-1 mt-4">
                <Text variant="caption" color="muted">
                  Notas
                </Text>
                <Text>{miembro.profile.general_notes}</Text>
              </div>
            )}
          </ProCard.Content>
        </ProCard>
      </div>
    </div>
  );
}
