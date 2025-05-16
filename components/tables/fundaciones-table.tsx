"use client";

import { Button } from "@/components/ui/button";
import type { Fundacion } from "@/types/supabase";
import Link from "next/link";
import type { ColumnDef } from "@tanstack/react-table";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ProTable } from "@/components/ui/pro-table";

interface FundacionesTableProps {
  fundaciones: Fundacion[];
}

export function FundacionesTable({ fundaciones }: FundacionesTableProps) {
  // Definición de columnas directamente en el componente
  const columns: ColumnDef<Fundacion>[] = [
    {
      id: "codigo",
      header: "Código",
      accessorKey: "codigo",
      size: 120,
    },
    {
      id: "nombre",
      header: "Nombre",
      accessorKey: "nombre",
    },
    {
      id: "descripcion",
      header: "Descripción",
      accessorFn: (row) => row.descripcion || "-",
      cell: ({ getValue }) => (
        <div className="max-w-md truncate">{getValue() as string}</div>
      ),
    },
    {
      id: "acciones",
      header: "Acciones",
      meta: {
        type: "actions",
        className: "border-r-0",
      },
      cell: ({ row }) => (
        <div className="flex justify-end space-x-2">
          <Link href={`/fundaciones/${row.original.id}`}>
            <Button variant="outline" size="sm">
              Ver
            </Button>
          </Link>
          <Link href={`/fundaciones/${row.original.id}/editar`}>
            <Button variant="outline" size="sm">
              Editar
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  // Función para obtener el estado de la fila (todas serán neutrales)
  const getRowStatus = () => "neutral";

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <ProTable
          data={fundaciones}
          columns={columns}
          enableTooltips={false}
          showColumnSelector={false}
          placeholder="Buscar fundación..."
          getRowStatus={getRowStatus}
        />
      </div>
    </TooltipProvider>
  );
}
