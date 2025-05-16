"use server"

import { supabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

type EntrevistadoData = {
  codigo: string
  nombre: string
  apellido: string
  cargo?: string
  fundacion_id: number
  contacto?: string
  notas?: string
}

export async function crearEntrevistado(data: EntrevistadoData) {
  try {
    // Verificar si ya existe un entrevistado con el mismo código
    const { data: existingEntrevistado, error: checkError } = await supabaseClient
      .from("entrevistados")
      .select("id")
      .eq("codigo", data.codigo)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar entrevistado existente:", checkError)
      return { error: "Error al verificar si el entrevistado ya existe" }
    }

    if (existingEntrevistado) {
      return { error: `Ya existe un entrevistado con el código ${data.codigo}` }
    }

    // Insertar el nuevo entrevistado
    const { data: newEntrevistado, error } = await supabaseClient
      .from("entrevistados")
      .insert([
        {
          codigo: data.codigo,
          nombre: data.nombre,
          apellido: data.apellido,
          cargo: data.cargo || null,
          fundacion_id: data.fundacion_id,
          contacto: data.contacto || null,
          notas: data.notas || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error al crear entrevistado:", error)
      return { error: "Error al crear el entrevistado" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/entrevistados")

    return { success: true, data: newEntrevistado }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerEntrevistados() {
  try {
    const { data, error } = await supabaseClient
      .from("entrevistados")
      .select(`
        *,
        fundacion:fundacion_id (
          id,
          codigo,
          nombre
        )
      `)
      .order("apellido")

    if (error) {
      console.error("Error al obtener entrevistados:", error)
      return { error: "Error al obtener los entrevistados" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerEntrevistadoPorId(id: number) {
  try {
    const { data, error } = await supabaseClient
      .from("entrevistados")
      .select(`
        *,
        fundacion:fundacion_id (
          id,
          codigo,
          nombre
        )
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error al obtener entrevistado:", error)
      return { error: "Error al obtener el entrevistado" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function actualizarEntrevistado(id: number, data: EntrevistadoData) {
  try {
    // Verificar si ya existe otro entrevistado con el mismo código
    const { data: existingEntrevistado, error: checkError } = await supabaseClient
      .from("entrevistados")
      .select("id")
      .eq("codigo", data.codigo)
      .neq("id", id)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar entrevistado existente:", checkError)
      return { error: "Error al verificar si el entrevistado ya existe" }
    }

    if (existingEntrevistado) {
      return { error: `Ya existe otro entrevistado con el código ${data.codigo}` }
    }

    // Actualizar el entrevistado
    const { data: updatedEntrevistado, error } = await supabaseClient
      .from("entrevistados")
      .update({
        codigo: data.codigo,
        nombre: data.nombre,
        apellido: data.apellido,
        cargo: data.cargo || null,
        fundacion_id: data.fundacion_id,
        contacto: data.contacto || null,
        notas: data.notas || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar entrevistado:", error)
      return { error: "Error al actualizar el entrevistado" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/entrevistados")
    revalidatePath(`/entrevistados/${id}`)
    revalidatePath(`/entrevistados/${id}/editar`)

    return { success: true, data: updatedEntrevistado }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function eliminarEntrevistado(id: number) {
  try {
    // Verificar si el entrevistado está siendo utilizado por entrevistas
    const { data: entrevistas, error: checkError } = await supabaseClient
      .from("entrevistas")
      .select("id")
      .eq("entrevistado_id", id)
      .limit(1)

    if (checkError) {
      console.error("Error al verificar entrevistas:", checkError)
      return { error: "Error al verificar si el entrevistado está siendo utilizado" }
    }

    if (entrevistas && entrevistas.length > 0) {
      return { error: "No se puede eliminar el entrevistado porque está siendo utilizado por entrevistas" }
    }

    // Eliminar el entrevistado
    const { error } = await supabaseClient.from("entrevistados").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar entrevistado:", error)
      return { error: "Error al eliminar el entrevistado" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/entrevistados")

    return { success: true }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}
