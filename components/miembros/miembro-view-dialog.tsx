"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { CustomButton } from "@/components/ui/custom-button";
import { Text } from "@/components/ui/text";
import { ProCard } from "@/components/ui/pro-card";
import { type ProjectMemberDetails } from "@/lib/actions/member-actions";
import {
  User,
  Building,
  Mail,
  Phone,
  Globe,
  MessageSquare,
  Tag,
  Clock,
} from "lucide-react";

interface MiembroViewDialogProps {
  open: boolean;
  miembro: ProjectMemberDetails | null;
  onClose: () => void;
}

export default function MiembroViewDialog({
  open,
  miembro,
  onClose,
}: MiembroViewDialogProps) {
  if (!miembro) {
    return null;
  }

  const profile = miembro.profile || {};

  // Función para mostrar un campo solo si tiene valor
  const FieldItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
  }) => {
    if (!value) return null;
    return (
      <div className="flex items-start gap-3 py-2">
        <div className="flex-shrink-0 mt-0.5">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <Text variant="small" className="text-muted-foreground">
            {label}
          </Text>
          <Text>{value}</Text>
        </div>
      </div>
    );
  };

  const getNombreCompleto = () => {
    if (profile.public_display_name) {
      return profile.public_display_name;
    }
    if (profile.first_name || profile.last_name) {
      return `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    }
    return "Miembro sin nombre registrado";
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalles del miembro</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <ProCard>
            <ProCard.Content className="space-y-3">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <User className="h-10 w-10 text-primary" />
                </div>
                <Text className="text-xl font-semibold">
                  {getNombreCompleto()}
                </Text>
                <div className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary mt-2">
                  {miembro.role_name || "Sin rol asignado"}
                </div>
              </div>

              <div className="space-y-1">
                <FieldItem
                  icon={Mail}
                  label="Correo electrónico"
                  value={profile.public_contact_email}
                />
                <FieldItem
                  icon={Building}
                  label="Institución"
                  value={profile.primary_institution}
                />
                <FieldItem
                  icon={Phone}
                  label="Teléfono"
                  value={profile.contact_phone}
                />
                <FieldItem
                  icon={Globe}
                  label="Idioma preferido"
                  value={profile.preferred_language}
                />
                <FieldItem
                  icon={Tag}
                  label="Pronombres"
                  value={profile.pronouns}
                />
                <FieldItem
                  icon={MessageSquare}
                  label="Notas"
                  value={profile.general_notes}
                />
                <FieldItem
                  icon={Clock}
                  label="Miembro desde"
                  value={
                    miembro.joined_at
                      ? new Date(miembro.joined_at).toLocaleDateString()
                      : undefined
                  }
                />
              </div>
            </ProCard.Content>
          </ProCard>
        </div>

        <DialogFooter>
          <CustomButton type="button" variant="outline" onClick={onClose}>
            Cerrar
          </CustomButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
