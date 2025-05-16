"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProTable } from "@/components/ui/pro-table";
import type { ColumnDef } from "@tanstack/react-table";
import type { ExpresionPermitida } from "@/app/actions/expresiones-permitidas-actions";

interface ExpresionesPermitidasTableProps {
  expresiones: ExpresionPermitida[];
}

export function ExpresionesPermitidasTable({
  expresiones,
}: ExpresionesPermitidasTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroIdioma, setFiltroIdioma] = useState<string>("");

  // Obtener lista única de idiomas
  const idiomas = useMemo(() => {
    return Array.from(new Set(expresiones.map((exp) => exp.idioma)));
  }, [expresiones]);

  // Función para obtener el estado de la fila (todas neutrales)
  const getRowStatus = () => "neutral";

  // Definición de columnas
  const columns: ColumnDef<ExpresionPermitida>[] = [
    {
      id: "expresion_original",
      header: "Expresión Original",
      accessorKey: "expresion_original",
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "normalizaciones_esperadas",
      header: "Normalizaciones Esperadas",
      accessorKey: "normalizaciones_esperadas",
      cell: ({ row }) => {
        const normalizaciones = row.original.normalizaciones_esperadas;
        return (
          <div className="flex flex-wrap gap-1">
            {normalizaciones.map((norm, index) => (
              <Badge key={index} variant="outline" className="bg-blue-50">
                {norm}
              </Badge>
            ))}
          </div>
        );
      },
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "idioma",
      header: "Idioma",
      accessorKey: "idioma",
      cell: ({ row }) => {
        return <Badge>{row.original.idioma}</Badge>;
      },
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "es_permitida_como_normalizacion",
      header: "Permitida como Normalización",
      accessorKey: "es_permitida_como_normalizacion",
      cell: ({ row }) => {
        return row.original.es_permitida_como_normalizacion ? (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Sí
          </Badge>
        ) : (
          <Badge variant="outline" className="text-gray-500">
            No
          </Badge>
        );
      },
      meta: {
        enableTooltip: false,
      },
    },
    {
      id: "acciones",
      header: "Acciones",
      cell: ({ row }) => {
        return (
          <div className="flex justify-end space-x-2">
            <Link
              href={`/configuracion/expresiones-permitidas/${row.original.id}`}
            >
              <Button variant="outline" size="sm">
                Ver
              </Button>
            </Link>
            <Link
              href={`/configuracion/expresiones-permitidas/${row.original.id}/editar`}
            >
              <Button variant="outline" size="sm">
                Editar
              </Button>
            </Link>
          </div>
        );
      },
      meta: {
        enableTooltip: false,
        className: "border-r-0",
      },
    },
  ];

  // Filtrar expresiones según los criterios
  const filteredExpresiones = useMemo(() => {
    return expresiones.filter(
      (expresion) =>
        (filtroIdioma === "" || expresion.idioma === filtroIdioma) &&
        (expresion.expresion_original
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          expresion.normalizaciones_esperadas.some((norm) =>
            norm.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          expresion.idioma.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [expresiones, filtroIdioma, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <input
          type="text"
          placeholder="Buscar expresión..."
          className="px-3 py-2 border rounded-md w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Filtrar por idioma:</span>
          <select
            className="px-3 py-2 border rounded-md"
            value={filtroIdioma}
            onChange={(e) => setFiltroIdioma(e.target.value)}
          >
            <option value="">Todos los idiomas</option>
            {idiomas.map((idioma) => (
              <option key={idioma} value={idioma}>
                {idioma}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="border rounded-md">
        <ProTable
          columns={columns}
          data={filteredExpresiones}
          getRowStatus={getRowStatus}
          enableSearch={false} // Desactivamos la búsqueda integrada porque ya tenemos nuestro propio input
          searchPlaceholder=""
          noDataMessage="No se encontraron expresiones permitidas"
        />
      </div>
    </div>
  );
}
