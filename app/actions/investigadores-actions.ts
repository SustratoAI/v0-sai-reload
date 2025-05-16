"use server"

import { supabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

type InvestigadorData = {
  codigo: string
  nombre: string
  apellido: string
  email?: string
  telefono?: string
  institucion?: string
  cargo?: string
  notas?: string
}

export async function crearInvestigador(data: InvestigadorData) {
  try {
    // Verificar si ya existe un investigador con el mismo código
    const { data: existingInvestigador, error: checkError } = await supabaseClient
      .from("investigadores")
      .select("id")
      .eq("codigo", data.codigo)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar investigador existente:", checkError)
      return { error: "Error al verificar si el investigador ya existe" }
    }

    if (existingInvestigador) {
      return { error: `Ya existe un investigador con el código ${data.codigo}` }
    }

    // Insertar el nuevo investigador
    const { data: newInvestigador, error } = await supabaseClient
      .from("investigadores")
      .insert([
        {
          codigo: data.codigo,
          nombre: data.nombre,
          apellido: data.apellido,
          email: data.email || null,
          telefono: data.telefono || null,
          institucion: data.institucion || null,
          cargo: data.cargo || null,
          notas: data.notas || null,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error al crear investigador:", error)
      return { error: "Error al crear el investigador" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/configuracion/investigadores")

    return { success: true, data: newInvestigador }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerInvestigadores() {
  try {
    const { data, error } = await supabaseClient.from("investigadores").select("*").order("apellido")

    if (error) {
      console.error("Error al obtener investigadores:", error)
      return { error: "Error al obtener los investigadores" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerInvestigadorPorId(id: number) {
  try {
    const { data, error } = await supabaseClient.from("investigadores").select("*").eq("id", id).single()

    if (error) {
      console.error("Error al obtener investigador:", error)
      return { error: "Error al obtener el investigador" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function actualizarInvestigador(id: number, data: InvestigadorData) {
  try {
    // Verificar si ya existe otro investigador con el mismo código
    const { data: existingInvestigador, error: checkError } = await supabaseClient
      .from("investigadores")
      .select("id")
      .eq("codigo", data.codigo)
      .neq("id", id)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar investigador existente:", checkError)
      return { error: "Error al verificar si el investigador ya existe" }
    }

    if (existingInvestigador) {
      return { error: `Ya existe otro investigador con el código ${data.codigo}` }
    }

    // Actualizar el investigador
    const { data: updatedInvestigador, error } = await supabaseClient
      .from("investigadores")
      .update({
        codigo: data.codigo,
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email || null,
        telefono: data.telefono || null,
        institucion: data.institucion || null,
        cargo: data.cargo || null,
        notas: data.notas || null,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar investigador:", error)
      return { error: "Error al actualizar el investigador" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/configuracion/investigadores")
    revalidatePath(`/configuracion/investigadores/${id}`)
    revalidatePath(`/configuracion/investigadores/${id}/editar`)

    return { success: true, data: updatedInvestigador }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function eliminarInvestigador(id: number) {
  try {
    // Verificar si el investigador está siendo utilizado por entrevistas
    const { data: entrevistas, error: checkError } = await supabaseClient
      .from("entrevistas")
      .select("id")
      .eq("investigador_id", id)
      .limit(1)

    if (checkError) {
      console.error("Error al verificar entrevistas:", checkError)
      return { error: "Error al verificar si el investigador está siendo utilizado" }
    }

    if (entrevistas && entrevistas.length > 0) {
      return { error: "No se puede eliminar el investigador porque está siendo utilizado por entrevistas" }
    }

    // Eliminar el investigador
    const { error } = await supabaseClient.from("investigadores").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar investigador:", error)
      return { error: "Error al eliminar el investigador" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/configuracion/investigadores")

    return { success: true }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}
