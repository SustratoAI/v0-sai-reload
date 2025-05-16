"use client";

import { ProTable } from "@/components/ui/pro-table";
import { columns } from "./transcripciones-columns";
import { TooltipProvider } from "@/components/ui/tooltip";

interface TranscripcionesTableProps {
  transcripciones: any[];
}

export function TranscripcionesTable({
  transcripciones,
}: TranscripcionesTableProps) {
  // Add a getRowStatus function to ensure neutral background is applied
  const getRowStatus = (row: any) => {
    // Return neutral for all rows to ensure white background is visible
    return "neutral";
  };

  return (
    <TooltipProvider>
      <div className="space-y-4">
        {/* Usamos nuestro componente TooltipTable con las columnas definidas */}
        <ProTable
          data={transcripciones}
          columns={columns}
          enableTooltips={false} // Desactivamos tooltips para esta tabla
          showColumnSelector={false} // Ocultamos el selector de columnas para mantener la interfaz original
          placeholder="Buscar transcripción..." // Personalizamos el placeholder
          getRowStatus={getRowStatus} // Add this to ensure neutral background
        />
      </div>
    </TooltipProvider>
  );
}
