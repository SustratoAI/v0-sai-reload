"use client";

import { ProTable } from "@/components/ui/pro-table";
import type { Entrevistado } from "@/types/supabase";
import { useState } from "react";
import {
  entrevistadosColumns,
  initialColumnVisibility,
  getRowStatus,
} from "./entrevistados-columns";

interface EntrevistadosTableProps {
  entrevistados: Entrevistado[];
}

export function EntrevistadosTable({ entrevistados }: EntrevistadosTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrar entrevistados basado en el término de búsqueda
  const filteredEntrevistados = entrevistados.filter(
    (entrevistado) =>
      entrevistado.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrevistado.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrevistado.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entrevistado.fundacion?.nombre &&
        entrevistado.fundacion.nombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (entrevistado.cargo &&
        entrevistado.cargo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entrevistado.contacto &&
        entrevistado.contacto
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      (entrevistado.notas &&
        entrevistado.notas.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <ProTable
        data={filteredEntrevistados}
        columns={entrevistadosColumns}
        getRowStatus={getRowStatus}
        initialVisibility={initialColumnVisibility}
        enableColumnResizing={true}
        enableColumnVisibility={true}
        enableSorting={true}
        enableMultiSort={true}
        enableGlobalFilter={false} // Usamos nuestro propio filtro
        enablePagination={true}
        enableRowSelection={false}
        defaultColumn={{
          minSize: 100,
          size: 150,
          maxSize: 400,
        }}
        className="bg-white dark:bg-gray-800"
      />
    </div>
  );
}
