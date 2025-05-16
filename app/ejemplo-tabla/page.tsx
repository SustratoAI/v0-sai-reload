"use client";

import { ProTable } from "@/components/ui/pro-table";
import { columns, data } from "./columns";
import { TooltipProvider } from "@/components/ui/tooltip";
// Importar la función getRowStatus
import { getRowStatus } from "./utils";

export default function EjemploTablaPage() {
  return (
    <TooltipProvider>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Ejemplo de Tabla Avanzada</h1>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Funcionalidades disponibles:
          </h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong>Búsqueda global</strong> - Usa el campo de búsqueda para
              filtrar todas las columnas
            </li>
            <li>
              <strong>Selector de columnas</strong> - Haz clic en "Columnas"
              para mostrar/ocultar columnas
            </li>
            <li>
              <strong>Redimensionamiento de columnas</strong> - Arrastra el
              borde derecho de los encabezados
            </li>
            <li>
              <strong>Filas expandibles</strong> - Haz clic en "+" para ver las
              subfilas (Juan y Carlos tienen subfilas)
            </li>
            <li>
              <strong>Tooltips inteligentes</strong> - Solo la columna
              "Descripción" muestra tooltips al pasar el mouse
            </li>
          </ul>

          <h2 className="text-xl font-semibold mb-4">Estados de filas:</h2>
          <ul className="list-disc pl-6 mb-6 space-y-2">
            <li>
              <strong className="text-green-600">Éxito (verde)</strong> - Estado
              "active" o "activo"
            </li>
            <li>
              <strong className="text-yellow-500">
                Advertencia (amarillo)
              </strong>{" "}
              - Estado "pending" o "pendiente"
            </li>
            <li>
              <strong className="text-red-500">Error (rojo)</strong> - Estado
              "inactive" o "inactivo"
            </li>
            <li>
              <strong className="text-blue-500">Información (azul)</strong> -
              Estado "info"
            </li>
            <li>
              <strong className="text-gray-500">Neutral (blanco)</strong> -
              Estado "neutral" o sin estado
            </li>
          </ul>

          <ProTable
            data={data}
            columns={columns}
            initialVisibility={{ name: false }}
            getRowStatus={getRowStatus}
            className="bg-white dark:bg-gray-800"
          />
        </div>
      </div>
    </TooltipProvider>
  );
}
