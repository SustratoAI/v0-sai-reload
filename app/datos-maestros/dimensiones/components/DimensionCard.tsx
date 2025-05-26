// app/datos-maestros/dimensiones/components/DimensionCard.tsx
"use client";

import React from "react";
import { type FullDimension } from "@/lib/actions/dimension-actions";
import { ProCard } from "@/components/ui/pro-card";
import { Text } from "@/components/ui/text";
import { BadgeCustom } from "@/components/ui/badge-custom";
import { CustomButton } from "@/components/ui/custom-button";
import { PenLine, Trash2, Eye, GripVertical } from "lucide-react"; // GripVertical para drag handle
import { BadgeVariant } from "@/lib/theme/components/badge-tokens";
import { cn } from "@/lib/utils";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";
// import { useSortable } from '@dnd-kit/sortable'; // Descomentar para dnd-kit
// import { CSS } from '@dnd-kit/utilities'; // Descomentar para dnd-kit

interface DimensionCardProps {
	dimension: FullDimension;
	onEdit: () => void;
	onDelete: () => void;
	onViewDetails: () => void; // Para ver detalles si es necesario
	canManage: boolean;
	isBeingDeleted?: boolean;
	// Props para dnd-kit (se añadirán después)
	// id: string;
}

export const DimensionCard: React.FC<DimensionCardProps> = ({
	dimension,
	onEdit,
	onDelete,
	onViewDetails,
	canManage,
	isBeingDeleted = false,
	// id, // para useSortable
}) => {
	// const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({id: id}); // Para dnd-kit
	// const style = { transform: CSS.Transform.toString(transform), transition, zIndex: isDragging ? 10 : undefined, opacity: isDragging ? 0.8 : 1 }; // Para dnd-kit

	const tipoLabel =
		dimension.type === "finite" ? "Selección Múltiple" : "Respuesta Abierta";

	// Determinar variante de color para el borde y badge de tipo
	// Puedes ajustar esto según tu paleta de colores
	let cardColorVariant: BadgeVariant = "neutral";
	if (dimension.type === "finite")
		cardColorVariant = "success"; // ej. verde para finitas
	else if (dimension.type === "open") cardColorVariant = "info"; // ej. azul para abiertas

	return (
		// <div ref={setNodeRef} style={style}> {/* Envolver con esto para dnd-kit */}
		<ProCard
			className={cn(
				"flex flex-col h-full group relative",
				isBeingDeleted && "opacity-50 pointer-events-none"
			)}
			border="left"
			color={cardColorVariant as any} // ProCard podría no tener 'info', 'success' directamente. Adaptar.
			shadow="md"

			// Añadir un efecto hover
		>
			{isBeingDeleted && (
				<div className="absolute inset-0 flex items-center justify-center bg-card/50 z-10">
					<SustratoLoadingLogo size={30} />
				</div>
			)}

			{canManage && (
				<div
					className={cn(
						"absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200",
						isBeingDeleted && "!opacity-0"
					)}>
					{/* <button {...attributes} {...listeners} className="cursor-grab p-1 text-muted-foreground hover:text-foreground">
              <GripVertical className="h-5 w-5" />
            </button> */}{" "}
					{/* Drag Handle para dnd-kit */}
					<CustomButton
						size="xs"
						variant="ghost"
						iconOnly
						onClick={onEdit}
						disabled={isBeingDeleted}
						tooltip="Editar dimensión">
						<PenLine className="h-4 w-4" />
					</CustomButton>
					<CustomButton
						size="xs"
						variant="ghost"
						iconOnly
						color="danger"
						onClick={onDelete}
						disabled={isBeingDeleted}
						tooltip="Eliminar dimensión">
						<Trash2 className="h-4 w-4" />
					</CustomButton>
				</div>
			)}

			{/* Hacemos el cuerpo de la card clickeable para ver detalles */}
			<div
				onClick={onViewDetails}
				className="cursor-pointer flex-grow flex flex-col p-4">
				<ProCard.Header className="p-0 mb-2">
					{" "}
					{/* Eliminar padding por defecto de header si no es necesario */}
					<div className="flex items-center justify-between">
						<Text
							variant="heading"
							size="md"
							weight="semibold"
							className="mb-1 flex-grow mr-2"
							truncate>
							{dimension.name}
						</Text>
						<BadgeCustom variant={cardColorVariant} className="flex-shrink-0">
							{tipoLabel}
						</BadgeCustom>
					</div>
				</ProCard.Header>

				<ProCard.Content className="p-0 flex-grow">
					{" "}
					{/* Eliminar padding por defecto */}
					{dimension.description && (
						<Text
							variant="default"
							color="muted"
							size="sm"
							className="mb-3 line-clamp-3">
							{" "}
							{/* Limitar líneas de descripción */}
							{dimension.description}
						</Text>
					)}
					{dimension.type === "finite" && dimension.options.length > 0 && (
						<div className="mb-3">
							<Text
								variant="label"
								size="xs"
								weight="medium"
								color="secondary"
								className="mb-1 block">
								Opciones Principales:
							</Text>
							<div className="flex flex-wrap gap-1">
								{dimension.options.slice(0, 4).map(
									(
										opt // Mostrar solo las primeras N opciones
									) => (
										<BadgeCustom key={opt.id} variant="neutral" subtle>
											{opt.value}
										</BadgeCustom>
									)
								)}
								{dimension.options.length > 4 && (
									<BadgeCustom variant="neutral" subtle>
										+{dimension.options.length - 4} más
									</BadgeCustom>
								)}
							</div>
						</div>
					)}
					{(dimension.questions.length > 0 ||
						dimension.examples.length > 0) && (
						<div className="mt-auto pt-2 text-xs text-muted-foreground space-y-0.5">
							{" "}
							{/* mt-auto para empujar al fondo si es flex-col */}
							{dimension.questions.length > 0 && (
								<div>{dimension.questions.length} Pregunta(s) Guía</div>
							)}
							{dimension.examples.length > 0 && (
								<div>{dimension.examples.length} Ejemplo(s) Ilustrativo(s)</div>
							)}
						</div>
					)}
					{dimension.type === "open" &&
						dimension.questions.length === 0 &&
						dimension.examples.length === 0 && (
							<Text
								variant="caption"
								color="muted"
								className="italic mt-auto pt-2">
								Esta dimensión abierta no tiene preguntas guía ni ejemplos
								definidos aún.
							</Text>
						)}
					{dimension.type === "finite" && dimension.options.length === 0 && (
						<Text
							variant="caption"
							color="warning"
							className="italic mt-auto pt-2">
							Esta dimensión de selección múltiple no tiene opciones definidas.
						</Text>
					)}
				</ProCard.Content>
			</div>
			{/* <ProCard.Footer className="p-2">
            <CustomButton variant="outline" size="sm" onClick={onViewDetails} leftIcon={<Eye className="h-4 w-4"/>}>
                Ver Detalles
            </CustomButton>
        </ProCard.Footer> */}
		</ProCard>
		// </div> // Cierre del div para dnd-kit
	);
};
