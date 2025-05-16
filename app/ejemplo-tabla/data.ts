export type Person = {
  id: string
  name: string
  email: string
  role: string
  status: string
  description: string
  subRows?: Person[]
}

export const data: Person[] = [
  {
    id: "1",
    name: "Juana Pérez",
    email: "juan@example.com",
    role: "Desarrollador",
    status: "active",
    description: "Desarrollador senior con experiencia en React, Node.js y bases de datos SQL.",
    subRows: [
      {
        id: "1-1",
        name: "Proyecto A",
        email: "proyecto-a@example.com",
        role: "Frontend",
        status: "active",
        description: "Desarrollo de interfaz de usuario con React y TypeScript.",
      },
      {
        id: "1-2",
        name: "Proyecto B",
        email: "proyecto-b@example.com",
        role: "Backend",
        status: "pending",
        description: "Implementación de API REST con Node.js y Express.",
      },
    ],
  },
  {
    id: "2",
    name: "María González",
    email: "maria@example.com",
    role: "Diseñadora",
    status: "pending",
    description: "Diseñadora UX/UI con experiencia en Figma y Adobe XD.",
  },
  {
    id: "3",
    name: "Carlos Rodríguez",
    email: "carlos@example.com",
    role: "Gerente",
    status: "inactive",
    description: "Gerente de proyectos con certificación PMP y experiencia en metodologías ágiles.",
    subRows: [
      {
        id: "3-1",
        name: "Equipo A",
        email: "equipo-a@example.com",
        role: "Desarrollo",
        status: "active",
        description: "Equipo de desarrollo frontend y backend.",
      },
      {
        id: "3-2",
        name: "Equipo B",
        email: "equipo-b@example.com",
        role: "Diseño",
        status: "inactive",
        description: "Equipo de diseño UX/UI.",
      },
    ],
  },
  {
    id: "4",
    name: "Ana Martínez",
    email: "ana@example.com",
    role: "QA",
    status: "info",
    description: "Ingeniera de calidad con experiencia en pruebas automatizadas y manuales.",
  },
  {
    id: "5",
    name: "Roberto Sánchez",
    email: "roberto@example.com",
    role: "DevOps",
    status: "neutral",
    description: "Ingeniero DevOps con experiencia en AWS, Docker y Kubernetes.",
  },
  {
    id: "6",
    name: "Laura Díaz",
    email: "laura@example.com",
    role: "Analista",
    status: "neutral",
    description: "Analista de negocios con experiencia en levantamiento de requerimientos y documentación.",
  },
  {
    id: "7",
    name: "Pedro López",
    email: "pedro@example.com",
    role: "Arquitecto",
    status: "",
    description: "Arquitecto de software con experiencia en diseño de sistemas distribuidos.",
  },
  {
    id: "6",
    name: "Roberto Gómez",
    role: "Visitante",
    status: "neutral",
    description: "Roberto es un visitante con acceso temporal al sistema para evaluación.",
    lastAccess: "20/05/2023, 11:15",
  },
]
