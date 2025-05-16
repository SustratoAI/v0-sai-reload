"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/app/auth-provider";
import { obtenerMiembrosConPerfilesYRolesDelProyecto } from "@/lib/actions/member-actions";
import { Text } from "@/components/ui/text";
import { ProCard } from "@/components/ui/pro-card";
import { ProTable } from "@/components/ui/pro-table";
import { CustomButton } from "@/components/ui/custom-button";
import { UserPlus, AlertCircle, Trash2, PenLine, Eye } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { PageHeader } from "@/components/common/page-header";
import { EmptyState } from "@/components/common/empty-state";
import type { ProjectMemberDetails } from "@/lib/actions/member-actions";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";

export default function MiembrosPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { proyectoActual, cargandoProyectos } = useAuth();
  const { toast } = useToast();

  const [miembros, setMiembros] = useState<ProjectMemberDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const puedeGestionarMiembros =
    proyectoActual?.permissions?.can_manage_master_data || false;

  const cargarMiembros = async () => {
    setIsLoading(true);
    setError(null);

    if (!proyectoActual?.id) {
      setError("No hay un proyecto seleccionado.");
      setIsLoading(false);
      return;
    }

    try {
      const resultado = await obtenerMiembrosConPerfilesYRolesDelProyecto(
        proyectoActual.id
      );

      if (resultado.success) {
        setMiembros(resultado.data);
      } else {
        setError(
          resultado.error || "Error al cargar los miembros del proyecto."
        );
        toast({
          title: "Error al cargar miembros",
          description: resultado.error,
          variant: "destructive",
        });
      }
    } catch (err) {
      setError("Error al cargar los miembros del proyecto.");
      console.error("Error cargando miembros:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (proyectoActual?.id) {
      cargarMiembros();
    }
  }, [proyectoActual?.id]);

  const handleAgregarMiembro = () => {
    router.push(`/datos-maestros/miembros/nuevo/crear`);
  };

  const handleEditarMiembro = (miembro: ProjectMemberDetails) => {
    router.push(`/datos-maestros/miembros/${miembro.project_member_id}/modificar`);
  };

  const handleVerMiembro = (miembro: ProjectMemberDetails) => {
    router.push(`/datos-maestros/miembros/${miembro.project_member_id}/ver`);
  };

  const handleEliminarMiembro = (miembro: ProjectMemberDetails) => {
    router.push(`/datos-maestros/miembros/${miembro.project_member_id}/eliminar`);
  };

  // Columnas para la tabla de miembros
  const columnas = [
    {
      header: "Nombre",
      accessorFn: (row: ProjectMemberDetails) => {
        const profile = row.profile;
        if (profile?.public_display_name) {
          return profile.public_display_name;
        }
        if (profile?.first_name || profile?.last_name) {
          return `${profile.first_name || ""} ${
            profile.last_name || ""
          }`.trim();
        }
        return "Sin nombre registrado";
      },
      cell: ({ getValue }: any) => (
        <Text className="font-medium">{getValue()}</Text>
      ),
    },
    {
      header: "Institución",
      accessorFn: (row: ProjectMemberDetails) =>
        row.profile?.primary_institution || "No especificada",
      cell: ({ getValue }: any) => (
        <Text className="text-muted-foreground">{getValue()}</Text>
      ),
    },
    {
      header: "Correo",
      accessorFn: (row: ProjectMemberDetails) =>
        row.profile?.public_contact_email || "No especificado",
      cell: ({ getValue }: any) => (
        <Text className="text-muted-foreground">{getValue()}</Text>
      ),
    },
    {
      header: "Rol",
      accessorFn: (row: ProjectMemberDetails) =>
        row.role_name || "Sin rol asignado",
      cell: ({ getValue }: any) => (
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
          {getValue()}
        </div>
      ),
    },
    {
      header: "Acciones",
      cell: ({ row }: any) => {
        const miembro = row.original as ProjectMemberDetails;
        return (
          <div className="flex gap-2 justify-end">
            <CustomButton
              variant="ghost"
              size="sm"
              onClick={() => handleVerMiembro(miembro)}
              className="h-8 w-8 p-0"
              iconOnly
            >
              <Eye className="h-4 w-4" />
              <span className="sr-only">Ver detalles</span>
            </CustomButton>
            {puedeGestionarMiembros && (
              <>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEditarMiembro(miembro)}
                  className="h-8 w-8 p-0"
                  iconOnly
                >
                  <PenLine className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </CustomButton>
                <CustomButton
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEliminarMiembro(miembro)}
                  className="h-8 w-8 p-0 text-destructive"
                  iconOnly
                  color="danger"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </CustomButton>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Miembros del Proyecto"
        description="Gestiona los miembros y sus roles dentro del proyecto actual."
        actions={
          puedeGestionarMiembros ? (
            <CustomButton
              onClick={handleAgregarMiembro}
              leftIcon={<UserPlus className="h-4 w-4" />}
              color="primary"
            >
              Agregar Miembro
            </CustomButton>
          ) : null
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <SustratoLoadingLogo
            size={50}
            variant="spin-pulse"
            showText={true}
            text="Cargando miembros..."
          />
        </div>
      ) : error ? (
        <ProCard className="border-destructive bg-destructive/5">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <Text>Error: {error}</Text>
          </div>
        </ProCard>
      ) : miembros.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="No hay miembros en este proyecto"
          description={
            puedeGestionarMiembros
              ? "Agrega investigadores al proyecto para comenzar a colaborar."
              : "Aún no hay investigadores asociados a este proyecto."
          }
          action={
            puedeGestionarMiembros ? (
              <CustomButton
                onClick={handleAgregarMiembro}
                leftIcon={<UserPlus className="h-4 w-4" />}
                color="primary"
              >
                Agregar Miembro
              </CustomButton>
            ) : undefined
          }
        />
      ) : (
        <ProCard>
          <ProTable data={miembros} columns={columnas} />
        </ProCard>
      )}
    </div>
  );
}
