"use server"

import { supabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"
import Papa from "papaparse"
import type { CSVRow } from "@/lib/utils/csv-validator"

type EntrevistaData = {
  codigo_entrevista: string
  fundacion_id: number
  entrevistado_id: number
  investigador_id?: number
  numero_entrevista: number
  fecha_entrevista?: string
  duracion?: number
  notas?: string
  idioma?: string
}

export async function obtenerSiguienteNumeroEntrevista(codigoBase: string) {
  try {
    // Buscar entrevistas con el mismo código base (primeros 4 caracteres)
    const { data, error } = await supabaseClient
      .from("entrevistas")
      .select("codigo_entrevista")
      .like("codigo_entrevista", `${codigoBase}%`)
      .order("codigo_entrevista", { ascending: false })

    if (error) {
      console.error("Error al obtener entrevistas:", error)
      return { error: "Error al obtener el siguiente número de entrevista" }
    }

    // Si no hay entrevistas previas, comenzar con 01
    if (!data || data.length === 0) {
      return { success: true, numero: "01" }
    }

    // Extraer el número más alto y sumar 1
    try {
      const ultimoCodigo = data[0].codigo_entrevista
      const ultimoNumero = Number.parseInt(ultimoCodigo.substring(4), 10)
      const siguienteNumero = (ultimoNumero + 1).toString().padStart(2, "0")
      return { success: true, numero: siguienteNumero }
    } catch (parseError) {
      console.error("Error al parsear el código:", parseError)
      return { success: true, numero: "01" } // En caso de error, comenzar con 01
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function crearEntrevistaParaTranscripcion(data: EntrevistaData) {
  try {
    // Verificar si ya existe una entrevista con el mismo código
    const { data: existingEntrevista, error: checkError } = await supabaseClient
      .from("entrevistas")
      .select("id")
      .eq("codigo_entrevista", data.codigo_entrevista)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar entrevista existente:", checkError)
      return { error: "Error al verificar si la entrevista ya existe" }
    }

    if (existingEntrevista) {
      return { error: `Ya existe una entrevista con el código ${data.codigo_entrevista}` }
    }

    // Insertar la nueva entrevista
    const { data: newEntrevista, error } = await supabaseClient
      .from("entrevistas")
      .insert([
        {
          codigo_entrevista: data.codigo_entrevista,
          fundacion_id: data.fundacion_id,
          entrevistado_id: data.entrevistado_id,
          investigador_id: data.investigador_id || null,
          numero_entrevista: data.numero_entrevista,
          fecha_entrevista: data.fecha_entrevista || null,
          duracion: data.duracion || null,
          notas: data.notas || null,
          idioma: data.idioma || "es-ES",
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error al crear entrevista:", error)
      return { error: "Error al crear la entrevista" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/transcripciones")
    revalidatePath("/entrevistas")

    return { success: true, data: newEntrevista }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function procesarCSVTranscripcion(entrevistaId: number, csvContent: string) {
  try {
    // Parsear el contenido CSV
    const { data, errors } = Papa.parse<CSVRow>(csvContent, {
      header: true,
      skipEmptyLines: true,
    })

    if (errors.length > 0) {
      console.error("Errores al parsear CSV:", errors)
      return { error: "Error al parsear el archivo CSV" }
    }

    if (!data || data.length === 0) {
      return { error: "El archivo CSV no contiene datos" }
    }

    // Preparar los datos para inserción en la tabla transcripciones
    // Eliminamos el campo 'hablante' ya que no existe en la tabla
    const transcripciones = data.map((row) => ({
      entrevista_id: entrevistaId,
      id_segmento: Number.parseInt(row.ID, 10),
      timestamp: row.Timestamp || null,
      rol: row.Rol,
      texto_original: row.Texto_Original,
      texto_normalizado: row.Texto_Normalizado,
      nivel_confianza: Number.parseInt(row.Nivel_de_Confianza, 10),
    }))

    // Insertar las transcripciones en la base de datos
    const { error } = await supabaseClient.from("transcripciones").insert(transcripciones)

    if (error) {
      console.error("Error al insertar transcripciones:", error)
      return { error: "Error al guardar las transcripciones en la base de datos" }
    }

    // Revalidar las rutas para actualizar los datos
    revalidatePath("/transcripciones")
    revalidatePath(`/entrevistas/${entrevistaId}`)

    return {
      success: true,
      message: `Se han cargado ${transcripciones.length} segmentos de transcripción correctamente`,
    }
  } catch (error) {
    console.error("Error al procesar CSV:", error)
    return { error: "Error al procesar el archivo CSV" }
  }
}

export async function obtenerTranscripcionesPorEntrevista(entrevistaId: number) {
  try {
    const { data, error } = await supabaseClient
      .from("transcripciones")
      .select("*")
      .eq("entrevista_id", entrevistaId)
      .order("id_segmento")

    if (error) {
      console.error("Error al obtener transcripciones:", error)
      return { error: "Error al obtener las transcripciones" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerTranscripciones() {
  try {
    const { data, error } = await supabaseClient
      .from("entrevistas")
      .select(`
        id,
        codigo_entrevista,
        fundacion:fundacion_id (
          id,
          codigo,
          nombre
        ),
        entrevistado:entrevistado_id (
          id,
          codigo,
          nombre,
          apellido
        ),
        investigador:investigador_id (
          id,
          codigo,
          nombre,
          apellido
        ),
        fecha_entrevista
      `)
      .order("fecha_entrevista", { ascending: false })

    if (error) {
      console.error("Error al obtener entrevistas:", error)
      return { error: "Error al obtener las entrevistas" }
    }

    const transcripcionesConCantidad = await Promise.all(
      data.map(async (entrevista) => {
        const { data: segmentos, error: segmentosError } = await supabaseClient
          .from("transcripciones")
          .select("id", { count: "exact" })
          .eq("entrevista_id", entrevista.id)

        if (segmentosError) {
          console.error("Error al obtener segmentos:", segmentosError)
          return { entrevista, cantidad_segmentos: 0 }
        }

        return { entrevista, cantidad_segmentos: segmentos ? segmentos.length : 0 }
      }),
    )

    return { success: true, data: transcripcionesConCantidad }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}
