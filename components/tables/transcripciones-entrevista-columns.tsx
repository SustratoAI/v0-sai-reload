import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

// Tipo para los segmentos de transcripción
export type SegmentoTranscripcion = {
  id: number
  id_segmento: number
  rol: string
  timestamp: string | null
  texto_original: string
  texto_normalizado: string
  nivel_confianza: number
}

// Función para obtener el nombre del hablante según el rol
export const obtenerNombreHablante = (rol: string, investigadorNombre: string, entrevistadoNombre: string): string => {
  switch (rol) {
    case "I":
      return investigadorNombre
    case "E":
      return entrevistadoNombre
    case "S":
      return "Sistema"
    default:
      return "Desconocido"
  }
}

// Función para crear las columnas de la tabla de transcripciones
export const crearColumnasTranscripciones = (
  investigadorNombre: string,
  entrevistadoNombre: string,
): ColumnDef<SegmentoTranscripcion>[] => {
  return [
    {
      id: "id_segmento",
      header: "ID",
      accessorKey: "id_segmento",
      size: 80,
      meta: {
        className: "font-medium",
      },
    },
    {
      id: "rol",
      header: "Rol",
      accessorKey: "rol",
      size: 100,
      cell: ({ row }) => {
        const rol = row.original.rol
        return (
          <Badge
            className={
              rol === "I"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : rol === "E"
                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {rol === "I" ? "Investigador" : rol === "E" ? "Entrevistado" : "Sistema"}
          </Badge>
        )
      },
    },
    {
      id: "hablante",
      header: "Hablante",
      size: 180,
      cell: ({ row }) => {
        const rol = row.original.rol
        return obtenerNombreHablante(rol, investigadorNombre, entrevistadoNombre)
      },
      meta: {
        className: "font-medium",
      },
    },
    {
      id: "timestamp",
      header: "Timestamp",
      accessorKey: "timestamp",
      size: 100,
      cell: ({ row }) => row.original.timestamp || "-",
    },
    {
      id: "texto_original",
      header: "Texto Original",
      accessorKey: "texto_original",
      size: 250,
      meta: {
        isLongContent: true,
        enableTooltip: true,
      },
    },
    {
      id: "texto_normalizado",
      header: "Texto Normalizado",
      accessorKey: "texto_normalizado",
      size: 250,
      meta: {
        isLongContent: true,
        enableTooltip: true,
      },
    },
    {
      id: "nivel_confianza",
      header: "Confianza",
      accessorKey: "nivel_confianza",
      size: 100,
      cell: ({ row }) => {
        const nivelConfianza = Number(row.original.nivel_confianza)
        return (
          <Badge
            className={
              nivelConfianza <= 2
                ? "bg-red-100 text-red-800 hover:bg-red-100"
                : nivelConfianza === 3
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  : "bg-green-100 text-green-800 hover:bg-green-100"
            }
          >
            {nivelConfianza}/5
          </Badge>
        )
      },
    },
  ]
}
