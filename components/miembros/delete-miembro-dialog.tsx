"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/ui/custom-button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, AlertTriangle } from "lucide-react";
import {
  eliminarMiembroDeProyecto,
  type ProjectMemberDetails,
} from "@/lib/actions/member-actions";

interface DeleteMiembroDialogProps {
  open: boolean;
  projectId: string;
  miembro: ProjectMemberDetails | null;
  onClose: (eliminado?: boolean) => void;
}

export default function DeleteMiembroDialog({
  open,
  projectId,
  miembro,
  onClose,
}: DeleteMiembroDialogProps) {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!miembro) {
    return null;
  }

  // Función para obtener el nombre del miembro
  const getNombreMiembro = (): string => {
    if (!miembro || !miembro.profile) return "este miembro";

    const profile = miembro.profile;
    if (profile.public_display_name) {
      return profile.public_display_name;
    }
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return profile.public_contact_email || "este miembro";
  };

  const handleEliminar = async () => {
    if (!projectId || !miembro) {
      toast({
        title: "Error",
        description: "Información incompleta para eliminar el miembro",
        variant: "destructive",
      });
      return;
    }

    setIsDeleting(true);
    try {
      const resultado = await eliminarMiembroDeProyecto({
        projectMemberId: miembro.project_member_id,
        proyectoId: projectId,
      });

      if (resultado.success) {
        toast({
          title: "Miembro eliminado",
          description:
            "El miembro ha sido eliminado del proyecto exitosamente.",
        });
        onClose(true);
      } else {
        toast({
          title: "Error al eliminar miembro",
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
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar eliminación
          </DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas eliminar a {getNombreMiembro()} del
            proyecto? Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <CustomButton
            type="button"
            variant="outline"
            onClick={() => onClose()}
            disabled={isDeleting}
          >
            Cancelar
          </CustomButton>
          <CustomButton
            type="button"
            onClick={handleEliminar}
            disabled={isDeleting}
            leftIcon={
              isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : undefined
            }
            color="danger"
          >
            {isDeleting ? "Eliminando..." : "Eliminar miembro"}
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
