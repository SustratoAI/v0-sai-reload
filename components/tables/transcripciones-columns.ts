import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Tipo para las transcripciones basado en la estructura actual
export type Transcripcion = {
  entrevista: {
    id: string
    codigo_entrevista: string
    fecha_entrevista?: string
    fundacion?: {
      nombre: string
    }
    entrevistado?: {
      nombre: string
      apellido: string
    }
    investigador?: {
      nombre: string
      apellido: string
    }
  }
  cantidad_segmentos: number
}

// Definición de columnas para la tabla de transcripciones
export const columns: ColumnDef<Transcripcion>[] = [
  {
    id: "codigo",
    header: "Código",
    accessorKey: "entrevista.codigo_entrevista",
    size: 120,
  },
  {
    id: "institucion",
    header: "Institución",
    accessorFn: (row) => row.entrevista.fundacion?.nombre || "-",
  },
  {
    id: "entrevistado",
    header: "Entrevistado",
    accessorFn: (row) =>
      row.entrevista.entrevistado
        ? `${row.entrevista.entrevistado.nombre} ${row.entrevista.entrevistado.apellido}`
        : "-",
  },
  {
    id: "investigador",
    header: "Investigador",
    accessorFn: (row) =>
      row.entrevista.investigador
        ? `${row.entrevista.investigador.nombre} ${row.entrevista.investigador.apellido}`
        : "-",
  },
  {
    id: "fecha",
    header: "Fecha",
    accessorFn: (row) =>
      row.entrevista.fecha_entrevista
        ? format(new Date(row.entrevista.fecha_entrevista), "dd/MM/yyyy", { locale: es })
        : "-",
  },
  {
    id: "segmentos",
    header: "Segmentos",
    accessorFn: (row) => `${row.cantidad_segmentos} segmentos`,
  },
  {
    id: "acciones",
    header: "Acciones",
    meta: { type: "actions" }, // Marcar como columna de acciones
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <Link href={`/entrevistas/${row.original.entrevista.id}/transcripciones`}>
          <Button variant="outline" size="sm">
            Ver Transcripción
          </Button>
        </Link>
        <Link href={`/entrevistas/${row.original.entrevista.id}`}>
          <Button variant="outline" size="sm">
            Ver Entrevista
          </Button>
        </Link>
      </div>
    ),
  },
]
