import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Entrevistado } from "@/types/supabase"
import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"

export const entrevistadosColumns: ColumnDef<Entrevistado>[] = [
  {
    id: "codigo",
    accessorKey: "codigo",
    header: "Código",
    minSize: 100,
    size: 120,
    enableResizing: true,
    cell: ({ row }) => <div className="font-medium">{row.original.codigo}</div>,
  },
  {
    id: "nombre",
    accessorFn: (row) => `${row.nombre} ${row.apellido}`,
    header: "Nombre",
    minSize: 150,
    size: 200,
    enableResizing: true,
    cell: ({ row }) => <div>{`${row.original.nombre} ${row.original.apellido}`}</div>,
  },
  {
    id: "institucion",
    accessorFn: (row) => row.fundacion?.nombre || "-",
    header: "Institución",
    minSize: 150,
    size: 200,
    enableResizing: true,
    cell: ({ row }) => (
      <div>
        {row.original.fundacion?.nombre ? (
          row.original.fundacion.nombre
        ) : (
          <Badge variant="outline">Sin institución</Badge>
        )}
      </div>
    ),
  },
  {
    id: "cargo",
    accessorKey: "cargo",
    header: "Cargo",
    minSize: 150,
    size: 180,
    enableResizing: true,
    cell: ({ row }) => <div>{row.original.cargo || <Badge variant="outline">Sin cargo</Badge>}</div>,
  },
  {
    id: "contacto",
    accessorKey: "contacto",
    header: "Contacto",
    minSize: 150,
    size: 180,
    enableResizing: true,
    cell: ({ row }) => <div>{row.original.contacto || <Badge variant="outline">Sin contacto</Badge>}</div>,
  },
  {
    id: "notas",
    accessorKey: "notas",
    header: "Notas",
    minSize: 200,
    size: 250,
    enableResizing: true,
    meta: {
      enableTooltip: true,
      isLongContent: true,
    },
    cell: ({ row }) => {
      const notas = row.original.notas
      return notas ? (
        <div className="line-clamp-3 max-h-[72px] overflow-hidden">{notas}</div>
      ) : (
        <Badge variant="outline">Sin notas</Badge>
      )
    },
  },
  {
    id: "acciones",
    header: "Acciones",
    enableSorting: false,
    enableResizing: false,
    size: 120,
    cell: ({ row }) => (
      <div className="flex justify-end space-x-2">
        <Link href={`/entrevistados/${row.original.id}`}>
          <Button variant="outline" size="sm">
            Ver
          </Button>
        </Link>
        <Link href={`/entrevistados/${row.original.id}/editar`}>
          <Button variant="outline" size="sm">
            Editar
          </Button>
        </Link>
      </div>
    ),
  },
]

// Función para determinar el estado de la fila (opcional, para estilos condicionales)
export function getRowStatus(row: Entrevistado) {
  // Ejemplo: podríamos destacar entrevistados sin institución o sin contacto
  if (!row.fundacion_id) {
    return "warning"
  }
  return "default"
}

// Configuración de visibilidad de columnas por defecto
export const initialColumnVisibility = {
  codigo: true,
  nombre: true,
  institucion: true,
  cargo: true,
  contacto: false,
  notas: false,
  acciones: true,
}
