"use client"

import type { ColumnDef } from "@tanstack/react-table"

// Definir el tipo de datos para las filas
export type Person = {
  id: string
  name: string
  role: string
  status: "active" | "pending" | "inactive"
  description: string
  lastLogin: string
  subRows?: Person[]
}

// Definir las columnas
export const columns: ColumnDef<Person>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      const hasSubRows = row.original.subRows && row.original.subRows.length > 0

      return hasSubRows ? (
        <button
          onClick={() => row.toggleExpanded()}
          className="p-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
        >
          {row.getIsExpanded() ? "-" : "+"}
        </button>
      ) : null
    },
    size: 40,
  },
  {
    accessorKey: "name",
    header: "Nombre",
    meta: {
      enableTooltip: false, // Desactivar tooltip para esta columna
      enableSorting: true, // Activar ordenamiento para esta columna
    },
    size: 150,
  },
  {
    accessorKey: "role",
    header: "Rol",
    meta: {
      enableTooltip: false, // Desactivar tooltip para esta columna
      enableSorting: true, // Activar ordenamiento para esta columna
    },
    size: 150,
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "active"
              ? "bg-green-100 text-green-800"
              : status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {status === "active" ? "Activo" : status === "pending" ? "Pendiente" : "Inactivo"}
        </span>
      )
    },
    meta: {
      enableTooltip: false, // Desactivar tooltip para esta columna
      enableSorting: true, // Activar ordenamiento para esta columna
    },
    size: 100,
  },
  {
    accessorKey: "description",
    header: "Descripción",
    cell: ({ row }) => {
      return <div>{row.getValue("description")}</div>
    },
    meta: {
      enableTooltip: true, // Activar tooltip para esta columna
      enableSorting: false, // Desactivar ordenamiento para esta columna
    },
    size: 300,
  },
  {
    accessorKey: "lastLogin",
    header: "Último acceso",
    cell: ({ row }) => {
      const date = new Date(row.getValue("lastLogin"))
      return new Intl.DateTimeFormat("es", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date)
    },
    meta: {
      enableTooltip: false, // Desactivar tooltip para esta columna
      enableSorting: true, // Activar ordenamiento para esta columna
    },
    size: 150,
  },
]

// Datos de ejemplo
export const data: Person[] = [
  {
    id: "1",
    name: "Juan Pérez",
    role: "Administrador",
    status: "nuetral",
    description:
      "Juan es un administrador experimentado con más de 10 años de experiencia en gestión de sistemas. Ha liderado múltiples proyectos de implementación y migración de sistemas. Es responsable de la infraestructura crítica y la seguridad de los datos.",
    lastLogin: "2023-05-15T10:30:00",
    subRows: [
      {
        id: "1-1",
        name: "Historial de Juan",
        role: "Registro",
        status: "nuetral",
        description:
          "Registro histórico de actividades y cambios realizados por Juan en el sistema durante los últimos 6 meses.",
        lastLogin: "2023-04-10T08:15:00",
      },
    ],
  },
  {
    id: "2",
    name: "María González",
    role: "Editor",
    status: "active",
    description:
      "María es una editora de contenido con especialización en marketing digital. Tiene un máster en Comunicación Digital y ha trabajado para varias agencias de publicidad. Es responsable de revisar y aprobar todo el contenido antes de su publicación.",
    lastLogin: "2023-05-16T14:45:00",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    role: "Usuario",
    status: "pending",
    description:
      "Carlos es un usuario estándar que se unió recientemente al sistema. Su cuenta está pendiente de verificación completa. Carlos ha solicitado acceso a módulos adicionales incluyendo el panel de análisis avanzado y las herramientas de exportación de datos para integración con sistemas externos. Carlos Esta solicitud está pendiente de aprobación por parte del administrador del sistema. Carlos ha solicitado acceso a módulos adicionales incluyendo el panel de análisis avanzado y las herramientas de exportación de datos para integración con sistemas externos.CarlosEsta solicitud está pendiente de aprobación por parte del administrador del sistema.",
    lastLogin: "2023-05-10T09:20:00",
    subRows: [
      {
        id: "3-1",
        name: "Solicitud de Carlos",
        role: "Ticket",
        status: "pending",
        description:
          "Solicitud de acceso a módulos adicionales presentada el 8 de mayo. Pendiente de revisión por parte del equipo de seguridad.",
        lastLogin: "2023-05-08T11:30:00",
      },
      {
        id: "3-2",
        name: "Documentación de Carlos",
        role: "Archivo",
        status: "active",
        description:
          "Documentación de identidad y certificaciones profesionales proporcionadas por Carlos para verificación.",
        lastLogin: "2023-05-09T14:20:00",
      },
    ],
  },
  {
    id: "4",
    name: "Ana Martínez",
    role: "Administrador",
    status: "inactive",
    description:
      "Ana es una administradora de sistemas especializada en bases de datos. Actualmente está de baja por maternidad y su cuenta ha sido temporalmente desactivada.",
    lastLogin: "2023-04-28T16:10:00",
  },
  {
    id: "5",
    name: "Luis Sánchez",
    role: "Editor",
    status: "active",
    description:
      "Luis es editor de la revista digital y responsable de la revisión final de artículos. Tiene especialización en contenido técnico y científico.",
    lastLogin: "2023-05-17T08:50:00",
  },
]
