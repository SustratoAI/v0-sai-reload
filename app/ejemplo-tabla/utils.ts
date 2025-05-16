// Función para determinar el estado de una fila basado en algún criterio
export function getRowStatus(row: any): "success" | "warning" | "error" | "info" | "neutral" | null {
  // Ejemplo: determinar el estado basado en el campo 'status' del registro
  if (!row.status) return "neutral"

  switch (row.status.toLowerCase()) {
    case "active":
    case "activo":
      return "success"
    case "pending":
    case "pendiente":
      return "warning"
    case "inactive":
    case "inactivo":
      return "error"
    case "info":
      return "info"
    case "neutral":
      return "neutral"
    default:
      return null
  }
}
