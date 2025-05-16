import Papa from "papaparse"
import type { Entrevistado, Investigador } from "@/types/supabase"

// Tipos para la validación
export interface CSVRow {
  ID: string
  Hablante: string
  Timestamp: string
  Rol: string
  Texto_Original: string
  Texto_Normalizado: string
  Nivel_de_Confianza: string
}

export interface ValidationResult {
  isValid: boolean
  blockingErrors: ValidationError[]
  warnings: ValidationWarning[]
  stats: ValidationStats
  segmentsWithIssues: SegmentWithIssues[]
}

export interface ValidationError {
  type: string
  message: string
  details?: string
}

export interface ValidationWarning {
  type: string
  message: string
  details?: string
}

export interface ValidationStats {
  totalSegments: number
  rolesDistribution: { [key: string]: number }
  confidenceLevels: { [key: string]: number }
  averageOriginalLength: number
  averageNormalizedLength: number
  missingTimestamps: number
}

export interface SegmentWithIssues {
  id: string
  row: CSVRow
  errors: string[]
  warnings: string[]
}

export interface ExpresionPermitida {
  expresionOriginal: string
  normalizacionesEsperadas: string[]
  esPermitidaComoNormalizacion: boolean
}

// Función principal de validación
export async function validateCSV(
  csvContent: string,
  entrevistado?: Entrevistado,
  investigador?: Investigador,
  idioma = "es-ES",
): Promise<ValidationResult> {
  // Obtener expresiones permitidas de la base de datos
  let expresionesPermitidas: ExpresionPermitida[] = []

  try {
    const { supabaseClient } = await import("@/lib/supabase")
    // Primero obtenemos las expresiones permitidas
    const { data: expresiones, error } = await supabaseClient
      .from("expresiones_permitidas")
      .select("*")
      .eq("idioma", idioma)

    if (error) {
      console.error("Error al obtener expresiones permitidas:", error)
    } else if (expresiones) {
      // Para cada expresión, obtenemos sus normalizaciones esperadas
      expresionesPermitidas = await Promise.all(
        expresiones.map(async (expresion) => {
          const { data: normalizaciones, error: normError } = await supabaseClient
            .from("normalizaciones_esperadas")
            .select("texto")
            .eq("expresion_id", expresion.id)

          return {
            expresionOriginal: expresion.expresion_original,
            normalizacionesEsperadas: normalizaciones ? normalizaciones.map((n) => n.texto) : [],
            esPermitidaComoNormalizacion: expresion.es_permitida_como_normalizacion,
          }
        }),
      )
    }
  } catch (error) {
    console.error("Error al consultar expresiones permitidas:", error)
    // Si hay error, usamos una lista predeterminada
    expresionesPermitidas = [
      {
        expresionOriginal: "sí",
        normalizacionesEsperadas: ["Afirmación", "Respuesta afirmativa", "Confirma"],
        esPermitidaComoNormalizacion: false,
      },
      {
        expresionOriginal: "no",
        normalizacionesEsperadas: ["Negación", "Respuesta negativa", "Rechaza"],
        esPermitidaComoNormalizacion: false,
      },
      {
        expresionOriginal: "ok",
        normalizacionesEsperadas: ["Expresa conformidad", "Muestra acuerdo", "Acepta"],
        esPermitidaComoNormalizacion: false,
      },
      {
        expresionOriginal: "hmm",
        normalizacionesEsperadas: ["Asentimiento breve", "Muestra duda", "Reflexiona"],
        esPermitidaComoNormalizacion: false,
      },
      {
        expresionOriginal: "Fin.",
        normalizacionesEsperadas: ["Fin."],
        esPermitidaComoNormalizacion: true,
      },
    ]
  }

  // Parsear el CSV
  const { data, errors: parseErrors } = Papa.parse<CSVRow>(csvContent, {
    header: true,
    skipEmptyLines: true,
  })

  if (parseErrors.length > 0) {
    return {
      isValid: false,
      blockingErrors: [
        {
          type: "parse_error",
          message: "Error al parsear el archivo CSV",
          details: parseErrors.map((e) => e.message).join(", "),
        },
      ],
      warnings: [],
      stats: createEmptyStats(),
      segmentsWithIssues: [],
    }
  }

  // Inicializar resultado
  const result: ValidationResult = {
    isValid: true,
    blockingErrors: [],
    warnings: [],
    stats: createEmptyStats(),
    segmentsWithIssues: [],
  }

  // Validar estructura del CSV
  validateStructure(data, result)
  if (result.blockingErrors.length > 0) {
    result.isValid = false
    return result
  }

  // Validar continuidad de IDs
  validateIdContinuity(data, result)

  // Validar niveles de confianza
  validateConfidenceLevels(data, result)

  // Validar marca de fin de archivo
  validateEndMark(data, result)

  // Validar texto normalizado
  validateNormalizedText(data, result, expresionesPermitidas)

  // Validar consistencia de hablantes (si se proporcionan entrevistado e investigador)
  if (entrevistado && investigador) {
    validateSpeakerConsistency(data, result, entrevistado, investigador)
  }

  // Calcular estadísticas
  calculateStats(data, result)

  // Determinar validez final
  result.isValid = result.blockingErrors.length === 0

  return result
}

// Funciones auxiliares de validación

function validateStructure(data: CSVRow[], result: ValidationResult): void {
  if (data.length === 0) {
    result.blockingErrors.push({
      type: "empty_file",
      message: "El archivo CSV está vacío",
    })
    return
  }

  // Verificar que todas las filas tengan las columnas requeridas
  const requiredColumns = [
    "ID",
    "Hablante",
    "Timestamp",
    "Rol",
    "Texto_Original",
    "Texto_Normalizado",
    "Nivel_de_Confianza",
  ]
  const firstRow = data[0]

  const missingColumns = requiredColumns.filter((col) => !(col in firstRow))
  if (missingColumns.length > 0) {
    result.blockingErrors.push({
      type: "missing_columns",
      message: "Faltan columnas requeridas en el CSV",
      details: `Columnas faltantes: ${missingColumns.join(", ")}`,
    })
  }
}

function validateIdContinuity(data: CSVRow[], result: ValidationResult): void {
  const ids = data.map((row) => Number.parseInt(row.ID, 10)).filter((id) => !isNaN(id))

  if (ids.length === 0) {
    result.blockingErrors.push({
      type: "invalid_ids",
      message: "No se encontraron IDs válidos en el CSV",
    })
    return
  }

  // Verificar que los IDs sean consecutivos
  ids.sort((a, b) => a - b)
  const min = ids[0]
  const max = ids[ids.length - 1]

  if (max - min + 1 !== ids.length) {
    // Hay lagunas en los IDs
    const expectedIds = Array.from({ length: max - min + 1 }, (_, i) => min + i)
    const missingIds = expectedIds.filter((id) => !ids.includes(id))

    result.blockingErrors.push({
      type: "id_gaps",
      message: "Hay segmentos faltantes en la transcripción",
      details: `IDs faltantes: ${missingIds.join(", ")}`,
    })
  }
}

function validateConfidenceLevels(data: CSVRow[], result: ValidationResult): void {
  const lowConfidenceSegments: string[] = []
  const mediumConfidenceSegments: string[] = []

  data.forEach((row) => {
    const confidenceLevel = Number.parseInt(row.Nivel_de_Confianza, 10)
    if (isNaN(confidenceLevel)) {
      result.blockingErrors.push({
        type: "invalid_confidence",
        message: `Nivel de confianza inválido en el segmento ${row.ID}`,
        details: `Valor: ${row.Nivel_de_Confianza}`,
      })
      return
    }

    if (confidenceLevel <= 2) {
      lowConfidenceSegments.push(row.ID)
    } else if (confidenceLevel === 3) {
      mediumConfidenceSegments.push(row.ID)
    }
  })

  if (lowConfidenceSegments.length > 0) {
    result.blockingErrors.push({
      type: "low_confidence",
      message: "Se detectaron segmentos con baja confianza (≤2)",
      details: `Segmentos: ${lowConfidenceSegments.join(", ")}`,
    })
  }

  if (mediumConfidenceSegments.length > 0) {
    result.warnings.push({
      type: "medium_confidence",
      message: "Algunos segmentos tienen nivel de confianza medio (3)",
      details: `Segmentos: ${mediumConfidenceSegments.join(", ")}`,
    })
  }
}

function validateEndMark(data: CSVRow[], result: ValidationResult): void {
  // Verificar si la última fila tiene rol "S" (Sistema)
  if (data.length === 0) return

  const lastRow = data[data.length - 1]
  if (lastRow.Rol !== "S") {
    result.blockingErrors.push({
      type: "missing_end_mark",
      message: "No se detectó marca de fin de transcripción",
      details: 'El último segmento debe tener rol "S" (Sistema)',
    })
  }
}

function validateNormalizedText(
  data: CSVRow[],
  result: ValidationResult,
  expresionesPermitidas: ExpresionPermitida[],
): void {
  data.forEach((row) => {
    const segmentIssues: SegmentWithIssues = {
      id: row.ID,
      row,
      errors: [],
      warnings: [],
    }

    const textoOriginal = row.Texto_Original.trim()
    const textoNormalizado = row.Texto_Normalizado.trim()

    // Validar longitud mínima del texto normalizado
    if (textoNormalizado.length < 10) {
      // Verificar si es una excepción permitida
      const esExcepcionPermitida = expresionesPermitidas.some(
        (exp) =>
          exp.esPermitidaComoNormalizacion && textoNormalizado.toLowerCase() === exp.expresionOriginal.toLowerCase(),
      )

      if (!esExcepcionPermitida && row.Rol !== "S") {
        // Ignorar para marcas de sistema
        segmentIssues.errors.push(`Texto normalizado demasiado corto (${textoNormalizado.length} caracteres)`)
      }
    }

    // Validar si una expresión corta original ha sido adecuadamente normalizada
    const expresionCorta = expresionesPermitidas.find(
      (exp) => textoOriginal.toLowerCase() === exp.expresionOriginal.toLowerCase(),
    )

    if (expresionCorta) {
      // Si el texto original es una expresión corta conocida
      if (
        textoOriginal.toLowerCase() === textoNormalizado.toLowerCase() &&
        !expresionCorta.esPermitidaComoNormalizacion &&
        row.Rol !== "S"
      ) {
        segmentIssues.errors.push(
          `La expresión "${textoOriginal}" debería normalizarse. Sugerencias: ${expresionCorta.normalizacionesEsperadas.join(", ")}`,
        )
      } else {
        // Verificar si la normalización está entre las esperadas
        const normalizacionEsperada = expresionCorta.normalizacionesEsperadas.some((norm) =>
          textoNormalizado.toLowerCase().includes(norm.toLowerCase()),
        )

        if (!normalizacionEsperada && !expresionCorta.esPermitidaComoNormalizacion && row.Rol !== "S") {
          segmentIssues.warnings.push(
            `La normalización de "${textoOriginal}" podría no ser óptima. Sugerencias: ${expresionCorta.normalizacionesEsperadas.join(", ")}`,
          )
        }
      }
    }

    // Validaciones básicas de formato para texto normalizado
    // Eliminamos esta validación por ser demasiado estricta
    // Solo verificamos si el texto es largo (más de 50 caracteres) y no tiene ningún signo de puntuación
    if (
      textoNormalizado.length > 50 &&
      !textoNormalizado.includes(".") &&
      !textoNormalizado.includes("!") &&
      !textoNormalizado.includes("?") &&
      row.Rol !== "S"
    ) {
      segmentIssues.warnings.push("El texto normalizado es largo y no contiene signos de puntuación")
    }

    // Validar timestamps vacíos (ignorar para rol "S")
    if ((row.Timestamp === "--" || row.Timestamp.trim() === "") && row.Rol !== "S") {
      segmentIssues.warnings.push("El segmento no tiene marca de tiempo")
    }

    // Añadir el segmento a la lista si tiene problemas
    if (segmentIssues.errors.length > 0 || segmentIssues.warnings.length > 0) {
      result.segmentsWithIssues.push(segmentIssues)
    }
  })
}

function validateSpeakerConsistency(
  data: CSVRow[],
  result: ValidationResult,
  entrevistado: Entrevistado,
  investigador: Investigador,
): void {
  // Crear una advertencia general si no hay coincidencia de hablantes
  const inconsistentEntrevistadoSegments: string[] = []
  const inconsistentInvestigadorSegments: string[] = []

  // Preparar nombres para comparación (en minúsculas)
  const entrevistadoNombre = `${entrevistado.nombre} ${entrevistado.apellido}`.toLowerCase()
  const entrevistadoNombreSolo = entrevistado.nombre.toLowerCase()
  const entrevistadoApellidoSolo = entrevistado.apellido.toLowerCase()

  const investigadorNombre = `${investigador.nombre} ${investigador.apellido}`.toLowerCase()
  const investigadorNombreSolo = investigador.nombre.toLowerCase()
  const investigadorApellidoSolo = investigador.apellido.toLowerCase()

  data.forEach((row) => {
    const hablante = row.Hablante.toLowerCase()
    const palabrasHablante = hablante.split(/\s+/) // Dividir el hablante en palabras

    if (row.Rol === "E") {
      // Verificar si el hablante coincide con el entrevistado
      // Consideramos coincidencia si:
      // 1. El hablante es exactamente igual al nombre completo del entrevistado
      // 2. El hablante contiene el nombre Y apellido completos (en cualquier orden)
      // 3. El hablante es exactamente igual al nombre o apellido del entrevistado
      const coincideNombreCompleto = hablante === entrevistadoNombre
      const contieneNombreYApellido =
        hablante.includes(entrevistadoNombreSolo) && hablante.includes(entrevistadoApellidoSolo)
      const esExactamenteNombreOApellido =
        palabrasHablante.includes(entrevistadoNombreSolo) || palabrasHablante.includes(entrevistadoApellidoSolo)

      const coincideEntrevistado = coincideNombreCompleto || contieneNombreYApellido || esExactamenteNombreOApellido

      if (!coincideEntrevistado) {
        inconsistentEntrevistadoSegments.push(row.ID)

        // Añadir advertencia al segmento específico
        const segmentIndex = result.segmentsWithIssues.findIndex((s) => s.id === row.ID)
        if (segmentIndex >= 0) {
          result.segmentsWithIssues[segmentIndex].warnings.push(
            `El hablante "${row.Hablante}" no coincide con el entrevistado seleccionado (${entrevistado.nombre} ${entrevistado.apellido})`,
          )
        } else {
          result.segmentsWithIssues.push({
            id: row.ID,
            row,
            errors: [],
            warnings: [
              `El hablante "${row.Hablante}" no coincide con el entrevistado seleccionado (${entrevistado.nombre} ${entrevistado.apellido})`,
            ],
          })
        }
      }
    } else if (row.Rol === "I") {
      // Verificar si el hablante coincide con el investigador
      // Usamos la misma lógica que para el entrevistado
      const coincideNombreCompleto = hablante === investigadorNombre
      const contieneNombreYApellido =
        hablante.includes(investigadorNombreSolo) && hablante.includes(investigadorApellidoSolo)
      const esExactamenteNombreOApellido =
        palabrasHablante.includes(investigadorNombreSolo) || palabrasHablante.includes(investigadorApellidoSolo)

      const coincideInvestigador = coincideNombreCompleto || contieneNombreYApellido || esExactamenteNombreOApellido

      if (!coincideInvestigador) {
        inconsistentInvestigadorSegments.push(row.ID)

        // Añadir advertencia al segmento específico
        const segmentIndex = result.segmentsWithIssues.findIndex((s) => s.id === row.ID)
        if (segmentIndex >= 0) {
          result.segmentsWithIssues[segmentIndex].warnings.push(
            `El hablante "${row.Hablante}" no coincide con el investigador seleccionado (${investigador.nombre} ${investigador.apellido})`,
          )
        } else {
          result.segmentsWithIssues.push({
            id: row.ID,
            row,
            errors: [],
            warnings: [
              `El hablante "${row.Hablante}" no coincide con el investigador seleccionado (${investigador.nombre} ${investigador.apellido})`,
            ],
          })
        }
      }
    }
  })

  // Añadir advertencias generales si hay inconsistencias
  if (inconsistentEntrevistadoSegments.length > 0) {
    result.warnings.push({
      type: "inconsistent_entrevistado",
      message: `Hay ${inconsistentEntrevistadoSegments.length} segmentos donde el hablante no coincide con el entrevistado seleccionado`,
      details: `Segmentos: ${inconsistentEntrevistadoSegments.join(", ")}`,
    })
  }

  if (inconsistentInvestigadorSegments.length > 0) {
    result.warnings.push({
      type: "inconsistent_investigador",
      message: `Hay ${inconsistentInvestigadorSegments.length} segmentos donde el hablante no coincide con el investigador seleccionado`,
      details: `Segmentos: ${inconsistentInvestigadorSegments.join(", ")}`,
    })
  }
}

function calculateStats(data: CSVRow[], result: ValidationResult): void {
  const stats: ValidationStats = {
    totalSegments: data.length,
    rolesDistribution: {},
    confidenceLevels: {},
    averageOriginalLength: 0,
    averageNormalizedLength: 0,
    missingTimestamps: 0,
  }

  let totalOriginalLength = 0
  let totalNormalizedLength = 0

  data.forEach((row) => {
    // Contar distribución de roles
    stats.rolesDistribution[row.Rol] = (stats.rolesDistribution[row.Rol] || 0) + 1

    // Contar niveles de confianza
    const confidenceLevel = row.Nivel_de_Confianza
    stats.confidenceLevels[confidenceLevel] = (stats.confidenceLevels[confidenceLevel] || 0) + 1

    // Sumar longitudes de texto
    totalOriginalLength += row.Texto_Original.length
    totalNormalizedLength += row.Texto_Normalizado.length

    // Contar timestamps vacíos
    if (row.Timestamp === "--" || row.Timestamp.trim() === "") {
      stats.missingTimestamps++
    }
  })

  // Calcular promedios
  stats.averageOriginalLength = data.length > 0 ? Math.round(totalOriginalLength / data.length) : 0
  stats.averageNormalizedLength = data.length > 0 ? Math.round(totalNormalizedLength / data.length) : 0

  result.stats = stats
}

function createEmptyStats(): ValidationStats {
  return {
    totalSegments: 0,
    rolesDistribution: {},
    confidenceLevels: {},
    averageOriginalLength: 0,
    averageNormalizedLength: 0,
    missingTimestamps: 0,
  }
}
