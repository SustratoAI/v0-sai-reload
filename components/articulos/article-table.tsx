"use client";

import { ProTable } from "@/components/ui/pro-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, AlertTriangle, Info } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMemo } from "react";

// Clase de utilidad para limitar texto a 8 líneas
const lineClampClass = "line-clamp-8 max-h-[192px] overflow-hidden";

interface ArticleTableProps {
  articles: any[];
  onAbstractClick: (article: any) => void;
}

// Componente para renderizar una dimensión individual con diseño vertical
const DimensionVertical = ({
  label,
  value,
  confidence,
}: {
  label: string;
  value: string | null;
  confidence: number | null;
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence <= 2) return "bg-red-100 text-red-800";
    if (confidence === 3) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  if (!value) {
    return (
      <div className="mb-2 last:mb-0">
        <div className="text-xs font-medium text-primary">{label}</div>
        <div>
          <Badge variant="outline" className="text-xs">
            Sin datos
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-2 last:mb-0">
      {/* Primera línea: título de la dimensión en color primary */}
      <div className="text-xs font-medium text-primary">{label}</div>

      {/* Segunda línea: valor y chip de confianza */}
      <div className="flex items-center mt-1">
        <div className="text-sm mr-2 break-words">{value}</div>
        {confidence && (
          <Badge
            className={`${getConfidenceColor(
              confidence
            )} text-xs h-5 min-w-5 px-1.5 flex-shrink-0`}
          >
            {confidence}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default function ArticleTable({
  articles,
  onAbstractClick,
}: ArticleTableProps) {
  // Definición de columnas para ProTable usando useMemo para evitar recreaciones
  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        id: "correlativo",
        accessorKey: "correlativo",
        header: "C",
        minSize: 50,
        size: 50,
        maxSize: 100,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: true,
        },
        cell: ({ row }) => row.original.correlativo,
      },
      {
        id: "Title",
        accessorKey: "Title",
        header: "Título",
        minSize: 150,
        size: 200,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: true,
          isLongContent: true,
        },
        cell: ({ row }) => (
          // Aplicamos el mismo lineClampClass que usamos para los otros campos
          <div className={lineClampClass}>{row.original.Title}</div>
        ),
      },
      {
        id: "Authors",
        accessorKey: "Authors",
        header: "Autores",
        minSize: 120,
        size: 150,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: true,
        },
        cell: ({ row }) => row.original.Authors,
      },
      {
        id: "Publication_Year",
        accessorKey: "Publication_Year",
        header: "Año",
        minSize: 60,
        size: 80,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: true,
        },
        cell: ({ row }) => row.original.Publication_Year,
      },
      {
        id: "Abstract",
        accessorKey: "Abstract",
        header: "Abstract",
        minSize: 80,
        size: 100,
        enableResizing: true,
        meta: {
          enableTooltip: true,
          enableSorting: false,
          isLongContent: true,
        },
        cell: ({ row }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAbstractClick(row.original)}
          >
            <FileText className="h-4 w-4 mr-1" />
            Ver
          </Button>
        ),
      },
      {
        id: "article_title_translation",
        accessorKey: "article_title_translation",
        header: "Título Traducido",
        minSize: 150,
        size: 200,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: false,
          isLongContent: true,
        },
        cell: ({ row }) => {
          const translation = row.original.translations?.[0];
          return translation?.article_title_translation ? (
            <div className={lineClampClass}>
              {translation.article_title_translation}
            </div>
          ) : (
            <Badge variant="outline">Sin traducción</Badge>
          );
        },
      },
      {
        id: "abstract_translation",
        accessorKey: "abstract_translation",
        header: "Abstract Traducido",
        minSize: 150,
        size: 200,
        enableResizing: true,
        meta: {
          enableTooltip: true,
          enableSorting: false,
          isLongContent: true,
        },
        cell: ({ row }) => {
          const translation = row.original.translations?.[0];
          return translation?.abstract_translation ? (
            <div className={lineClampClass}>
              {translation.abstract_translation}
            </div>
          ) : (
            <Badge variant="outline">Sin traducción</Badge>
          );
        },
      },
      {
        id: "abstract_summary",
        accessorKey: "abstract_summary",
        header: "Resumen IA",
        minSize: 150,
        size: 200,
        enableResizing: true,
        meta: {
          enableTooltip: true,
          enableSorting: false,
          isLongContent: true,
        },
        cell: ({ row }) => {
          const translation = row.original.translations?.[0];
          return translation?.abstract_summary ? (
            <div className={lineClampClass}>{translation.abstract_summary}</div>
          ) : (
            <Badge variant="outline">Sin resumen</Badge>
          );
        },
      },
      // GRUPO 1: Terminología, Función, Contexto
      {
        id: "dimensiones_grupo1",
        accessorKey: "dimensiones_grupo1",
        header: "Dimensiones Conceptuales",
        minSize: 250,
        size: 300,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: false,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          if (!dimension) return <Badge variant="outline">Sin datos</Badge>;

          return (
            <div className="py-2 px-2 flex flex-col h-full">
              <DimensionVertical
                label="Terminología"
                value={dimension.terminologia_valor}
                confidence={dimension.terminologia_confianza}
              />
              <DimensionVertical
                label="Función"
                value={dimension.funcion_valor}
                confidence={dimension.funcion_confianza}
              />
              <DimensionVertical
                label="Contexto"
                value={dimension.contexto_valor}
                confidence={dimension.contexto_confianza}
              />
            </div>
          );
        },
      },
      // GRUPO 2: Metodología, Tecnología, Adopción
      {
        id: "dimensiones_grupo2",
        accessorKey: "dimensiones_grupo2",
        header: "Dimensiones Metodológicas",
        minSize: 250,
        size: 300,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: false,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          if (!dimension) return <Badge variant="outline">Sin datos</Badge>;

          return (
            <div className="py-2 px-2 flex flex-col h-full">
              <DimensionVertical
                label="Metodología"
                value={dimension.metodologia_valor}
                confidence={dimension.metodologia_confianza}
              />
              <DimensionVertical
                label="Tecnología"
                value={dimension.tecnologia_valor}
                confidence={dimension.tecnologia_confianza}
              />
              <DimensionVertical
                label="Adopción"
                value={dimension.adopcion_valor}
                confidence={dimension.adopcion_confianza}
              />
            </div>
          );
        },
      },
      // GRUPO 3: Personalización, Histórico, Innovación
      {
        id: "dimensiones_grupo3",
        accessorKey: "dimensiones_grupo3",
        header: "Dimensiones Técnicas",
        minSize: 250,
        size: 300,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: false,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          if (!dimension) return <Badge variant="outline">Sin datos</Badge>;

          return (
            <div className="py-2 px-2 flex flex-col h-full">
              <DimensionVertical
                label="Personalización"
                value={dimension.personalizacion_valor}
                confidence={dimension.personalizacion_confianza}
              />
              <DimensionVertical
                label="Histórico"
                value={dimension.historico_valor}
                confidence={dimension.historico_confianza}
              />
              <DimensionVertical
                label="Innovación"
                value={dimension.innovacion_valor}
                confidence={dimension.innovacion_confianza}
              />
            </div>
          );
        },
      },
      {
        id: "iteracion",
        accessorKey: "iteracion",
        header: "Iteración",
        minSize: 80,
        size: 100,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: true,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          return (
            dimension?.iteracion || <Badge variant="outline">Sin datos</Badge>
          );
        },
      },
      {
        id: "doble_ciego",
        accessorKey: "doble_ciego",
        header: "Doble Ciego",
        minSize: 100,
        size: 120,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: true,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          if (!dimension) return <Badge variant="outline">Sin datos</Badge>;
          return (
            <Badge
              variant={dimension.doble_ciego ? "default" : "outline"}
              className={
                dimension.doble_ciego ? "bg-blue-100 text-blue-800" : ""
              }
            >
              {dimension.doble_ciego ? "Sí" : "No"}
            </Badge>
          );
        },
      },
      {
        id: "requiere_revision",
        accessorKey: "requiere_revision",
        header: "Requiere Revisión",
        minSize: 120,
        size: 150,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: true,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          if (!dimension) return <Badge variant="outline">Sin datos</Badge>;
          return (
            <Badge
              variant={dimension.requiere_revision ? "default" : "outline"}
              className={
                dimension.requiere_revision ? "bg-amber-100 text-amber-800" : ""
              }
            >
              {dimension.requiere_revision ? "Sí" : "No"}
            </Badge>
          );
        },
      },
      {
        id: "nota_ai",
        accessorKey: "nota_ai",
        header: "Nota AI",
        minSize: 120,
        size: 150,
        enableResizing: true,
        meta: {
          enableTooltip: true,
          enableSorting: false,
          isLongContent: true,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          return dimension?.nota_ai ? (
            <div className={lineClampClass}>{dimension.nota_ai}</div>
          ) : (
            <Badge variant="outline">Sin nota</Badge>
          );
        },
      },
      {
        id: "acciones",
        accessorKey: "acciones",
        header: "Acciones",
        minSize: 120,
        size: 150,
        enableResizing: true,
        meta: {
          enableTooltip: false,
          enableSorting: false,
        },
        cell: ({ row }) => {
          const dimension = row.original.dimensions?.[0];
          return (
            <>
              <Button variant="outline" size="sm">
                Editar
              </Button>
              {dimension?.requiere_revision && (
                <Button variant="ghost" size="icon" className="text-amber-500">
                  <AlertTriangle className="h-4 w-4" />
                </Button>
              )}
              {dimension?.nota_ai && (
                <Button variant="ghost" size="icon" className="text-blue-500">
                  <Info className="h-4 w-4" />
                </Button>
              )}
            </>
          );
        },
      },
    ],
    []
  );

  // Función para obtener el estado de la fila (todas serán neutrales)
  const getRowStatus = () => "neutral";

  // Definimos las columnas visibles por defecto
  const defaultColumnVisibility = {
    correlativo: true,
    Title: true,
    Authors: false,
    Publication_Year: false,
    Abstract: false,
    article_title_translation: true,
    abstract_translation: true,
    abstract_summary: true,
    dimensiones_grupo1: true,
    dimensiones_grupo2: true,
    dimensiones_grupo3: true,
    iteracion: false,
    doble_ciego: false,
    requiere_revision: false,
    nota_ai: true,
    acciones: false,
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto py-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {articles.length} artículos en total
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-red-50 text-red-800">
                1-2: Baja
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-800">
                3: Media
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-800">
                4-5: Alta
              </Badge>
            </div>
          </div>

          <ProTable
            data={articles}
            columns={columns}
            getRowStatus={getRowStatus}
            className="bg-white dark:bg-gray-800"
            defaultColumn={{
              minSize: 100,
              size: 150,
              maxSize: 400,
            }}
            initialVisibility={defaultColumnVisibility}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
