"use server"

import { supabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

type EntrevistaData = {
  codigo_entrevista: string
  fundacion_id: number
  entrevistado_id: number
  investigador_id?: number
  numero_entrevista: number
  fecha_entrevista?: string
  duracion?: number
  notas?: string
}

export async function crearEntrevista(data: EntrevistaData) {
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
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error al crear entrevista:", error)
      return { error: "Error al crear la entrevista" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/entrevistas")

    return { success: true, data: newEntrevista }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerEntrevistas() {
  try {
    const { data, error } = await supabaseClient
      .from("entrevistas")
      .select(`
        *,
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
        )
      `)
      .order("fecha_entrevista", { ascending: false })

    if (error) {
      console.error("Error al obtener entrevistas:", error)
      return { error: "Error al obtener las entrevistas" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerEntrevistaPorId(id: number) {
  try {
    const { data, error } = await supabaseClient
      .from("entrevistas")
      .select(`
        *,
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
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error al obtener entrevista:", error)
      return { error: "Error al obtener la entrevista" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function eliminarEntrevista(id: number) {
  try {
    // Verificar si la entrevista está siendo utilizada por transcripciones
    const { data: transcripciones, error: checkError } = await supabaseClient
      .from("transcripciones")
      .select("id")
      .eq("entrevista_id", id)
      .limit(1)

    if (checkError) {
      console.error("Error al verificar transcripciones:", checkError)
      return { error: "Error al verificar si la entrevista está siendo utilizada" }
    }

    if (transcripciones && transcripciones.length > 0) {
      return { error: "No se puede eliminar la entrevista porque está siendo utilizada por transcripciones" }
    }

    // Eliminar la entrevista
    const { error } = await supabaseClient.from("entrevistas").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar entrevista:", error)
      return { error: "Error al eliminar la entrevista" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/entrevistas")

    return { success: true }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}
