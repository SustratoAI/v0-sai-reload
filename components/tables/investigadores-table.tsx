"use client";

import { ProTable } from "@/components/ui/pro-table";
import { Button } from "@/components/ui/button";
import type { Investigador } from "@/types/supabase";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";

interface InvestigadoresTableProps {
  investigadores: Investigador[];
}

export function InvestigadoresTable({
  investigadores,
}: InvestigadoresTableProps) {
  // Definición de columnas directamente en el componente
  const columns: ColumnDef<Investigador>[] = [
    {
      id: "codigo",
      header: "Código",
      accessorKey: "codigo",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.codigo}</div>
      ),
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "nombre",
      header: "Nombre",
      accessorFn: (row) => `${row.nombre} ${row.apellido}`,
      cell: ({ row }) => (
        <div>{`${row.original.nombre} ${row.original.apellido}`}</div>
      ),
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "institucion",
      header: "Institución",
      accessorKey: "institucion",
      cell: ({ row }) => <div>{row.original.institucion || "-"}</div>,
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "contacto",
      header: "Contacto",
      accessorFn: (row) => row.email || row.telefono || "-",
      cell: ({ row }) => (
        <div>{row.original.email || row.original.telefono || "-"}</div>
      ),
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <Link href={`/configuracion/investigadores/${row.original.id}`}>
            <Button variant="outline" size="sm">
              Ver
            </Button>
          </Link>
          <Link
            href={`/configuracion/investigadores/${row.original.id}/editar`}
          >
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </Link>
        </div>
      ),
      meta: {
        className: "border-r-0", // Elimina el borde derecho en la última columna
        enableTooltip: false,
      },
    },
  ];

  // Función para determinar el estado de la fila (todas neutrales)
  const getRowStatus = () => "neutral";

  return (
    <div className="space-y-4">
      <ProTable
        data={investigadores}
        columns={columns}
        getRowStatus={getRowStatus}
        searchPlaceholder="Buscar investigador..."
        searchFields={["nombre", "apellido", "codigo", "institucion"]}
        emptyMessage="No se encontraron investigadores"
      />
    </div>
  );
}
