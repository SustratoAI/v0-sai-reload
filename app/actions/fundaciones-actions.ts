"use server"

import { supabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

type FundacionData = {
  codigo: string
  nombre: string
  descripcion?: string
}

export async function crearFundacion(data: FundacionData) {
  try {
    // Verificar si ya existe una fundación con el mismo código
    const { data: existingFundacion, error: checkError } = await supabaseClient
      .from("fundaciones")
      .select("id")
      .eq("codigo", data.codigo)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar fundación existente:", checkError)
      return { error: "Error al verificar si la fundación ya existe" }
    }

    if (existingFundacion) {
      return { error: `Ya existe una fundación con el código ${data.codigo}` }
    }

    // Insertar la nueva fundación
    const { data: newFundacion, error } = await supabaseClient
      .from("fundaciones")
      .insert([
        {
          codigo: data.codigo,
          nombre: data.nombre,
          descripcion: data.descripcion || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error al crear fundación:", error)
      return { error: "Error al crear la fundación" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/fundaciones")

    return { success: true, data: newFundacion }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerFundaciones() {
  try {
    const { data, error } = await supabaseClient.from("fundaciones").select("*").order("nombre")

    if (error) {
      console.error("Error al obtener fundaciones:", error)
      return { error: "Error al obtener las fundaciones" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerFundacionPorId(id: number) {
  try {
    const { data, error } = await supabaseClient.from("fundaciones").select("*").eq("id", id).single()

    if (error) {
      console.error("Error al obtener fundación:", error)
      return { error: "Error al obtener la fundación" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function actualizarFundacion(id: number, data: FundacionData) {
  try {
    // Verificar si ya existe otra fundación con el mismo código
    const { data: existingFundacion, error: checkError } = await supabaseClient
      .from("fundaciones")
      .select("id")
      .eq("codigo", data.codigo)
      .neq("id", id)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar fundación existente:", checkError)
      return { error: "Error al verificar si la fundación ya existe" }
    }

    if (existingFundacion) {
      return { error: `Ya existe otra fundación con el código ${data.codigo}` }
    }

    // Actualizar la fundación
    const { data: updatedFundacion, error } = await supabaseClient
      .from("fundaciones")
      .update({
        codigo: data.codigo,
        nombre: data.nombre,
        descripcion: data.descripcion || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar fundación:", error)
      return { error: "Error al actualizar la fundación" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/fundaciones")
    revalidatePath(`/fundaciones/${id}`)
    revalidatePath(`/fundaciones/${id}/editar`)

    return { success: true, data: updatedFundacion }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function eliminarFundacion(id: number) {
  try {
    // Verificar si la fundación está siendo utilizada por entrevistados
    const { data: entrevistados, error: checkError } = await supabaseClient
      .from("entrevistados")
      .select("id")
      .eq("fundacion_id", id)
      .limit(1)

    if (checkError) {
      console.error("Error al verificar entrevistados:", checkError)
      return { error: "Error al verificar si la fundación está siendo utilizada" }
    }

    if (entrevistados && entrevistados.length > 0) {
      return { error: "No se puede eliminar la fundación porque está siendo utilizada por entrevistados" }
    }

    // Eliminar la fundación
    const { error } = await supabaseClient.from("fundaciones").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar fundación:", error)
      return { error: "Error al eliminar la fundación" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/fundaciones")

    return { success: true }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}
