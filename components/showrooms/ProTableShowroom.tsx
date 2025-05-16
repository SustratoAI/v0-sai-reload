"use client";

import React, { useState, useMemo } from "react";
import { ProTable, type TooltipTableProps } from "@/components/ui/pro-table";
import type { ColumnDef, Row } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Tipos de datos para el showroom
interface ShowroomData {
  id: number;
  name: string;
  description: string;
  status: "active" | "inactive" | "pending" | "archived";
  priority: "low" | "medium" | "high" | "critical";
  progress: number; // 0-100
  isActive: boolean;
  tags: string[];
  notes?: string;
  subRows?: ShowroomData[];
  created_at: string; // Fecha en formato ISO
  updated_at: string; // Fecha en formato ISO
  contact: {
    email: string;
    phone: string;
  };
  budget: number;
  currency: "USD" | "EUR" | "GBP";
}

const generateRandomDate = (start: Date, end: Date): string => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  ).toISOString();
};

const generateRandomString = (length: number): string => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generador de datos de muestra mejorado
const generateSampleData = (count: number): ShowroomData[] => {
  const data: ShowroomData[] = [];
  const statuses: ShowroomData["status"][] = [
    "active",
    "inactive",
    "pending",
    "archived",
  ];
  const priorities: ShowroomData["priority"][] = [
    "low",
    "medium",
    "high",
    "critical",
  ];
  const currencies: ShowroomData["currency"][] = ["USD", "EUR", "GBP"];

  for (let i = 1; i <= count; i++) {
    const hasSubRows = Math.random() > 0.7 && i < count - 2;
    const subRowCount = hasSubRows ? Math.floor(Math.random() * 3) + 1 : 0;

    data.push({
      id: i,
      name: `Project ${i} - ${generateRandomString(Math.random() * 10 + 5)}`,
      description: generateRandomString(Math.random() * 200 + 50),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      progress: Math.floor(Math.random() * 101),
      isActive: Math.random() > 0.5,
      tags: Array.from({ length: Math.floor(Math.random() * 4) + 1 }, () =>
        generateRandomString(Math.random() * 8 + 3)
      ),
      notes:
        Math.random() > 0.3
          ? generateRandomString(Math.random() * 150 + 20)
          : undefined,
      created_at: generateRandomDate(new Date(2022, 0, 1), new Date()),
      updated_at: generateRandomDate(new Date(2023, 0, 1), new Date()),
      contact: {
        email: `user${i}@example.com`,
        phone: `555-01${String(i).padStart(2, "0")}`,
      },
      budget: Math.floor(Math.random() * 100000) + 5000,
      currency: currencies[Math.floor(Math.random() * currencies.length)],
      subRows: hasSubRows
        ? generateSampleData(subRowCount).map((sr) => ({
            ...sr,
            id: parseFloat(`${i}.${sr.id}`),
          }))
        : undefined,
    });
  }
  return data;
};

const sampleData = generateSampleData(30);

const ProTableShowroom: React.FC = () => {
  const [tableData, setTableData] = useState<ShowroomData[]>(sampleData);
  const [showTooltips, setShowTooltips] = useState(true);
  const [showSorting, setShowSorting] = useState(true);
  const [showColSelector, setShowColSelector] = useState(true);
  const [isStickyHeader, setIsStickyHeader] = useState(true);
  const [hideMenuOnScroll, setHideMenuOnScroll] = useState(true);
  const [lineClamp, setLineClamp] = useState(3);
  const [searchPlaceholder, setSearchPlaceholder] = useState(
    "Buscar en la tabla..."
  );

  const columns = useMemo(
    (): ColumnDef<ShowroomData, any>[] => [
      {
        id: "expander",
        header: () => null,
        cell: ({ row }) =>
          row.getCanExpand() ? row.getToggleExpandedHandler() : null,
        meta: {
          enableTooltip: false,
          enableSorting: false,
        },
      },
      {
        accessorKey: "id",
        header: "ID",
        meta: {
          contentAlignment: "center",
          enableSorting: true,
        },
      },
      {
        accessorKey: "name",
        header: "Nombre del Proyecto",
        cell: ({ getValue }) => (
          <span className="font-semibold">{getValue<string>()}</span>
        ),
        meta: {
          isLongContent: true,
          lineClamp: 2,
          enableTooltip: true,
          enableSorting: true,
          className: "min-w-[200px] max-w-[300px]",
          contentClassName: "text-blue-600 dark:text-blue-400 hover:underline",
        },
      },
      {
        accessorKey: "description",
        header: "Descripción Detallada",
        meta: {
          isLongContent: true,
          enableTooltip: true,
          lineClamp: lineClamp,
          className: "min-w-[300px] max-w-[500px]",
        },
      },
      {
        accessorKey: "status",
        header: "Estado",
        cell: ({ getValue }) => {
          const status = getValue<ShowroomData["status"]>();
          let colorClass = "";
          switch (status) {
            case "active":
              colorClass =
                "bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100";
              break;
            case "inactive":
              colorClass =
                "bg-gray-100 text-gray-700 dark:bg-gray-600 dark:text-gray-200";
              break;
            case "pending":
              colorClass =
                "bg-yellow-100 text-yellow-700 dark:bg-yellow-600 dark:text-yellow-100";
              break;
            case "archived":
              colorClass =
                "bg-purple-100 text-purple-700 dark:bg-purple-600 dark:text-purple-100";
              break;
          }
          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
            >
              {status}
            </span>
          );
        },
        meta: {
          contentAlignment: "center",
          enableSorting: true,
          cellVariant: ({ row }) => {
            const status = row.original.status;
            if (status === "active") return "success";
            if (status === "pending") return "warning";
            if (status === "archived") return "secondary";
            return undefined;
          },
        },
      },
      {
        accessorKey: "priority",
        header: "Prioridad",
        meta: {
          contentAlignment: "center",
          enableSorting: true,
          cellVariant: ({ row }) => {
            const priority = row.original.priority;
            if (priority === "critical") return "danger";
            if (priority === "high") return "danger";
            if (priority === "medium") return "secondary";
            return "neutral";
          },
        },
      },
      {
        accessorKey: "progress",
        header: "Progreso (%)",
        cell: ({ getValue }) => {
          const progress = getValue<number>();
          return (
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 relative">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
              <span className="absolute w-full text-center text-[10px] text-white mix-blend-difference top-[-2px]">
                {progress}%
              </span>
            </div>
          );
        },
        meta: {
          contentAlignment: "center",
          enableSorting: true,
          className: "min-w-[100px]",
        },
      },
      {
        accessorKey: "isActive",
        header: "Activo",
        cell: ({ getValue }) => (getValue<boolean>() ? "Sí" : "No"),
        meta: {
          contentAlignment: "center",
          enableSorting: true,
          cellVariant: ({ getValue }) => (getValue() ? "success" : "neutral"),
        },
      },
      {
        accessorKey: "tags",
        header: "Etiquetas",
        cell: ({ getValue }) =>
          getValue<string[]>()
            .map((tag) => (
              <span
                key={tag}
                className="mr-1 mb-1 inline-block bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs"
              >
                {tag}
              </span>
            ))
            .slice(0, 3),
        meta: {
          isLongContent: true,
          enableTooltip: true,
          lineClamp: 1,
          className: "min-w-[150px]",
        },
      },
      {
        accessorKey: "notes",
        header: "Notas Adicionales",
        meta: {
          isLongContent: true,
          lineClamp: 1,
          enableTooltip: true,
          className: "min-w-[200px] max-w-[350px]",
        },
      },
      {
        accessorKey: "contact.email",
        header: "Email Contacto",
        meta: {
          isLongContent: true,
          enableTooltip: true,
          contentClassName: "text-sm italic",
        },
      },
      {
        accessorKey: "budget",
        header: "Presupuesto",
        cell: ({ row }) => {
          const budget = row.original.budget;
          const currency = row.original.currency;
          return `${new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: currency,
          }).format(budget)}`;
        },
        meta: {
          contentAlignment: "right",
          enableSorting: true,
          className: "font-mono min-w-[150px]",
        },
      },
      {
        accessorKey: "created_at",
        header: "Fecha Creación",
        cell: ({ getValue }) =>
          new Date(getValue<string>()).toLocaleDateString("es-ES"),
        meta: {
          contentAlignment: "center",
          enableSorting: true,
          className: "min-w-[120px]",
        },
      },
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => (
          <div className="flex gap-1 justify-center">
            <Button
              size="sm"
              variant="outline"
              onClick={() => alert(`Editando ${row.original.name}`)}
            >
              Editar
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => alert(`Eliminando ${row.original.name}`)}
            >
              Borrar
            </Button>
          </div>
        ),
        meta: {
          type: "actions",
          contentAlignment: "center",
          isFixed: true,
          className: "min-w-[150px]",
        },
      },
    ],
    [lineClamp]
  );

  const getRowStatus = (
    row: ShowroomData
  ):
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "neutral"
    | "primary"
    | "secondary"
    | "tertiary"
    | "accent"
    | null => {
    if (row.priority === "critical") return "danger";
    if (row.progress < 20 && row.status !== "archived") return "warning";
    if (row.status === "active" && row.progress > 80) return "success";
    if (row.status === "archived") return "neutral";
    if (row.id % 5 === 0) return "info";
    return null;
  };

  const customCheckboxRender = ({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: () => void;
  }) => (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`custom-check-${Math.random()}`}
        checked={checked}
        onCheckedChange={onChange}
        className="border-blue-500 data-[state=checked]:bg-blue-500"
      />
    </div>
  );

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">
        Showroom Interactivo de ProTable
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-lg mb-6">
        <div className="flex items-center space-x-3">
          <Switch
            id="tooltips-switch"
            checked={showTooltips}
            onCheckedChange={setShowTooltips}
          />
          <Label
            htmlFor="tooltips-switch"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Habilitar Tooltips
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            id="sorting-switch"
            checked={showSorting}
            onCheckedChange={setShowSorting}
          />
          <Label
            htmlFor="sorting-switch"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Habilitar Ordenación
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            id="colselector-switch"
            checked={showColSelector}
            onCheckedChange={setShowColSelector}
          />
          <Label
            htmlFor="colselector-switch"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Selector de Columnas
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            id="stickyheader-switch"
            checked={isStickyHeader}
            onCheckedChange={setIsStickyHeader}
          />
          <Label
            htmlFor="stickyheader-switch"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Cabecera Fija
          </Label>
        </div>
        <div className="flex items-center space-x-3">
          <Switch
            id="hidemenuscroll-switch"
            checked={hideMenuOnScroll}
            onCheckedChange={setHideMenuOnScroll}
          />
          <Label
            htmlFor="hidemenuscroll-switch"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Ocultar Menú al Scroll
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <Label
            htmlFor="lineclamp-input"
            className="text-gray-700 dark:text-gray-300 font-medium whitespace-nowrap"
          >
            Line Clamp (Desc):
          </Label>
          <Input
            id="lineclamp-input"
            type="number"
            value={lineClamp}
            onChange={(e) =>
              setLineClamp(Math.max(1, parseInt(e.target.value, 10)))
            }
            className="w-20 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>
        <div className="flex items-center space-x-2 col-span-1 md:col-span-2 lg:col-span-3">
          <Label
            htmlFor="placeholder-input"
            className="text-gray-700 dark:text-gray-300 font-medium"
          >
            Placeholder Búsqueda:
          </Label>
          <Input
            id="placeholder-input"
            type="text"
            value={searchPlaceholder}
            onChange={(e) => setSearchPlaceholder(e.target.value)}
            className="flex-grow dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
          />
        </div>
      </div>

      <ProTable<ShowroomData>
        data={tableData}
        columns={columns}
        className="shadow-xl rounded-lg overflow-hidden border dark:border-gray-700"
        enableTooltips={showTooltips}
        enableSorting={showSorting}
        showColumnSelector={showColSelector}
        placeholder={searchPlaceholder}
        getRowStatus={getRowStatus}
        lineClampForLongContent={3}
        tooltipDelay={250}
        stickyHeader={isStickyHeader}
        renderCustomCheck={customCheckboxRender}
        hideMenuOnScroll={hideMenuOnScroll}
        initialVisibility={{
          notes: false,
          "contact.email": false,
          updated_at: false,
          isActive: false,
        }}
      />

      <div className="mt-10 p-6 border rounded-lg bg-white dark:bg-gray-800 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          Notas sobre el Showroom:
        </h2>
        <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>
            La columna <strong>"Nombre del Proyecto"</strong> tiene{" "}
            <code>isLongContent</code> y un <code>lineClamp</code> fijo de 2. Su
            contenido tiene un estilo especial.
          </li>
          <li>
            La columna <strong>"Descripción Detallada"</strong> usa{" "}
            <code>isLongContent</code> y su <code>lineClamp</code> se controla
            dinámicamente desde el input "Line Clamp (Desc)".
          </li>
          <li>
            La columna <strong>"Etiquetas"</strong> también usa{" "}
            <code>isLongContent</code> para mostrar todas las etiquetas en el
            tooltip, pero solo 1 línea en la celda (y un máximo de 3 etiquetas
            visibles).
          </li>
          <li>
            <strong>"Estado"</strong> y <strong>"Prioridad"</strong> usan{" "}
            <code>cellVariant</code> para cambiar su apariencia basados en el
            valor. El estado también tiene un renderizado personalizado con
            badges de color.
          </li>
          <li>
            <strong>"Progreso"</strong> muestra una barra de progreso con el
            porcentaje superpuesto.
          </li>
          <li>
            <strong>"Email Contacto"</strong> demuestra acceso a datos anidados
            (<code>contact.email</code>).
          </li>
          <li>
            <strong>"Presupuesto"</strong> usa formato de moneda (EUR, USD, GBP)
            y alineación derecha.
          </li>
          <li>
            La columna <strong>"Acciones"</strong> está configurada como{" "}
            <code>isFixed: true</code> para permanecer visible al hacer scroll
            horizontal.
          </li>
          <li>
            Algunas filas tienen{" "}
            <strong>
              sub-filas (<code>subRows</code>)
            </strong>{" "}
            para demostrar la funcionalidad de expansión. La ID de las subfilas
            es un número decimal (ej: 1.1, 1.2).
          </li>
          <li>
            <code>getRowStatus</code> se usa para colorear filas enteras según
            ciertas condiciones (prioridad crítica, progreso bajo, estado activo
            con alto progreso, etc.).
          </li>
          <li>
            Se provee un <code>renderCustomCheck</code> para el selector de
            columnas, usando un Checkbox de ShadCN/UI.
          </li>
          <li>
            Varias opciones de <code>ProTable</code> (Tooltips, Ordenación,
            Selector de Col., Cabecera Fija, etc.) se pueden activar/desactivar
            con los controles interactivos.
          </li>
          <li>
            Columnas como "Notas", "Email Contacto", "updated_at" e "isActive"
            están ocultas inicialmente mediante <code>initialVisibility</code>.
          </li>
          <li>
            Se ha añadido soporte básico para modo oscuro en los controles y el
            fondo general.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProTableShowroom;
