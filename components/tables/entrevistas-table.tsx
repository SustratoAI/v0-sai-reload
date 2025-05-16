"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import type { Entrevista } from "@/types/supabase"
import Link from "next/link"
import { useState } from "react"

interface EntrevistasTableProps {
  entrevistas: Entrevista[]
}

export function EntrevistasTable({ entrevistas }: EntrevistasTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEntrevistas = entrevistas.filter(
    (entrevista) =>
      entrevista.codigo_entrevista.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entrevista.fundacion?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${entrevista.entrevistado?.nombre} ${entrevista.entrevistado?.apellido}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (entrevista.investigador &&
        `${entrevista.investigador.nombre} ${entrevista.investigador.apellido}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Buscar entrevista..."
          className="px-3 py-2 border rounded-md w-full max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Código</TableHead>
              <TableHead>Fundación</TableHead>
              <TableHead>Entrevistado</TableHead>
              <TableHead>Investigador</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Duración</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEntrevistas.map((entrevista) => (
              <TableRow key={entrevista.id}>
                <TableCell className="font-medium">{entrevista.codigo_entrevista}</TableCell>
                <TableCell>{entrevista.fundacion?.nombre || "-"}</TableCell>
                <TableCell>
                  {entrevista.entrevistado
                    ? `${entrevista.entrevistado.nombre} ${entrevista.entrevistado.apellido}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {entrevista.investigador
                    ? `${entrevista.investigador.nombre} ${entrevista.investigador.apellido}`
                    : "-"}
                </TableCell>
                <TableCell>
                  {entrevista.fecha_entrevista
                    ? new Date(entrevista.fecha_entrevista).toLocaleDateString("es-ES")
                    : "-"}
                </TableCell>
                <TableCell>{entrevista.duracion ? `${entrevista.duracion} min` : "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Link href={`/entrevistas/${entrevista.id}`}>
                      <Button variant="outline" size="sm">
                        Ver
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
