"use server"

import { supabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export interface ExpresionPermitida {
  id?: number
  expresion_original: string
  normalizaciones_esperadas: string[]
  es_permitida_como_normalizacion: boolean
  idioma: string
}

export async function crearExpresionPermitida(data: Omit<ExpresionPermitida, "id">) {
  try {
    // Verificar si ya existe una expresión con el mismo texto original e idioma
    const { data: existingExpresion, error: checkError } = await supabaseClient
      .from("expresiones_permitidas")
      .select("id")
      .eq("expresion_original", data.expresion_original)
      .eq("idioma", data.idioma)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar expresión existente:", checkError)
      return { error: "Error al verificar si la expresión ya existe" }
    }

    if (existingExpresion) {
      return {
        error: `Ya existe una expresión con el texto "${data.expresion_original}" para el idioma ${data.idioma}`,
      }
    }

    // Iniciar una transacción para insertar en ambas tablas
    // Primero insertar en expresiones_permitidas
    const { data: newExpresion, error } = await supabaseClient
      .from("expresiones_permitidas")
      .insert([
        {
          expresion_original: data.expresion_original,
          es_permitida_como_normalizacion: data.es_permitida_como_normalizacion,
          idioma: data.idioma,
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Error al crear expresión permitida:", error)
      return { error: "Error al crear la expresión permitida" }
    }

    // Si se creó la expresión, ahora insertar las normalizaciones esperadas
    if (newExpresion && data.normalizaciones_esperadas.length > 0) {
      const normalizacionesInserts = data.normalizaciones_esperadas.map((texto) => ({
        expresion_id: newExpresion.id,
        texto: texto,
      }))

      const { error: normError } = await supabaseClient.from("normalizaciones_esperadas").insert(normalizacionesInserts)

      if (normError) {
        console.error("Error al crear normalizaciones esperadas:", normError)
        // No fallamos la operación completa, solo registramos el error
      }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/configuracion/expresiones-permitidas")

    return { success: true, data: newExpresion }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function obtenerExpresionesPermitidas(idioma?: string) {
  try {
    // Consulta principal para obtener expresiones permitidas
    let query = supabaseClient.from("expresiones_permitidas").select("*")

    if (idioma) {
      query = query.eq("idioma", idioma)
    }

    const { data: expresiones, error } = await query.order("expresion_original")

    if (error) {
      console.error("Error al obtener expresiones permitidas:", error)
      return { error: "Error al obtener las expresiones permitidas" }
    }

    // Para cada expresión, obtener sus normalizaciones esperadas
    if (expresiones && expresiones.length > 0) {
      const expresionesConNormalizaciones = await Promise.all(
        expresiones.map(async (expresion) => {
          const { data: normalizaciones, error: normError } = await supabaseClient
            .from("normalizaciones_esperadas")
            .select("texto")
            .eq("expresion_id", expresion.id)

          if (normError) {
            console.error(`Error al obtener normalizaciones para expresión ${expresion.id}:`, normError)
            return {
              ...expresion,
              normalizaciones_esperadas: [],
            }
          }

          return {
            ...expresion,
            normalizaciones_esperadas: normalizaciones ? normalizaciones.map((n) => n.texto) : [],
          }
        }),
      )

      return { success: true, data: expresionesConNormalizaciones }
    }

    return { success: true, data: expresiones || [] }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function actualizarExpresionPermitida(id: number, data: Omit<ExpresionPermitida, "id">) {
  try {
    // Verificar si ya existe otra expresión con el mismo texto original e idioma
    const { data: existingExpresion, error: checkError } = await supabaseClient
      .from("expresiones_permitidas")
      .select("id")
      .eq("expresion_original", data.expresion_original)
      .eq("idioma", data.idioma)
      .neq("id", id)
      .maybeSingle()

    if (checkError) {
      console.error("Error al verificar expresión existente:", checkError)
      return { error: "Error al verificar si la expresión ya existe" }
    }

    if (existingExpresion) {
      return {
        error: `Ya existe otra expresión con el texto "${data.expresion_original}" para el idioma ${data.idioma}`,
      }
    }

    // Actualizar la expresión principal
    const { data: updatedExpresion, error } = await supabaseClient
      .from("expresiones_permitidas")
      .update({
        expresion_original: data.expresion_original,
        es_permitida_como_normalizacion: data.es_permitida_como_normalizacion,
        idioma: data.idioma,
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar expresión permitida:", error)
      return { error: "Error al actualizar la expresión permitida" }
    }

    // Eliminar normalizaciones existentes y crear nuevas
    // Primero eliminar las existentes
    const { error: deleteError } = await supabaseClient
      .from("normalizaciones_esperadas")
      .delete()
      .eq("expresion_id", id)

    if (deleteError) {
      console.error("Error al eliminar normalizaciones existentes:", deleteError)
      // Continuamos a pesar del error
    }

    // Luego insertar las nuevas normalizaciones
    if (data.normalizaciones_esperadas.length > 0) {
      const normalizacionesInserts = data.normalizaciones_esperadas.map((texto) => ({
        expresion_id: id,
        texto: texto,
      }))

      const { error: insertError } = await supabaseClient
        .from("normalizaciones_esperadas")
        .insert(normalizacionesInserts)

      if (insertError) {
        console.error("Error al crear nuevas normalizaciones:", insertError)
        // No fallamos la operación completa, solo registramos el error
      }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/configuracion/expresiones-permitidas")
    revalidatePath(`/configuracion/expresiones-permitidas/${id}`)
    revalidatePath(`/configuracion/expresiones-permitidas/${id}/editar`)

    return { success: true, data: updatedExpresion }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

export async function eliminarExpresionPermitida(id: number) {
  try {
    // Primero eliminar las normalizaciones relacionadas
    const { error: normError } = await supabaseClient.from("normalizaciones_esperadas").delete().eq("expresion_id", id)

    if (normError) {
      console.error("Error al eliminar normalizaciones relacionadas:", normError)
      // Continuamos a pesar del error
    }

    // Luego eliminar la expresión principal
    const { error } = await supabaseClient.from("expresiones_permitidas").delete().eq("id", id)

    if (error) {
      console.error("Error al eliminar expresión permitida:", error)
      return { error: "Error al eliminar la expresión permitida" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/configuracion/expresiones-permitidas")

    return { success: true }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

// Script para inicializar la tabla con datos predeterminados
export async function inicializarExpresionesPermitidas() {
  try {
    // Verificar si ya hay datos en la tabla
    const { data: existingData, error: checkError } = await supabaseClient
      .from("expresiones_permitidas")
      .select("id")
      .limit(1)

    if (checkError) {
      console.error("Error al verificar datos existentes:", checkError)
      return { error: "Error al verificar si ya existen datos" }
    }

    // Si ya hay datos, no hacer nada
    if (existingData && existingData.length > 0) {
      return { success: true, message: "La tabla ya contiene datos" }
    }

    // Datos predeterminados para inicializar la tabla (sin normalizaciones_esperadas)
    const expresionesIniciales = [
      {
        expresion_original: "sí",
        es_permitida_como_normalizacion: false,
        idioma: "es-ES",
      },
      {
        expresion_original: "no",
        es_permitida_como_normalizacion: false,
        idioma: "es-ES",
      },
      {
        expresion_original: "ok",
        es_permitida_como_normalizacion: false,
        idioma: "es-ES",
      },
      {
        expresion_original: "hmm",
        es_permitida_como_normalizacion: false,
        idioma: "es-ES",
      },
      {
        expresion_original: "Fin.",
        es_permitida_como_normalizacion: true,
        idioma: "es-ES",
      },
      {
        expresion_original: "yes",
        es_permitida_como_normalizacion: false,
        idioma: "en-US",
      },
      {
        expresion_original: "no",
        es_permitida_como_normalizacion: false,
        idioma: "en-US",
      },
      {
        expresion_original: "ok",
        es_permitida_como_normalizacion: false,
        idioma: "en-US",
      },
      {
        expresion_original: "hmm",
        es_permitida_como_normalizacion: false,
        idioma: "en-US",
      },
      {
        expresion_original: "End.",
        es_permitida_como_normalizacion: true,
        idioma: "en-US",
      },
    ]

    // Insertar las expresiones principales
    const { data: expresionesInsertadas, error } = await supabaseClient
      .from("expresiones_permitidas")
      .insert(expresionesIniciales)
      .select()

    if (error) {
      console.error("Error al inicializar expresiones permitidas:", error)
      return { error: "Error al inicializar la tabla de expresiones permitidas" }
    }

    // Ahora insertar las normalizaciones para cada expresión
    if (expresionesInsertadas) {
      // Mapeo de expresiones a sus normalizaciones
      const normalizacionesPorExpresion = {
        sí: ["Afirmación", "Respuesta afirmativa", "Confirma"],
        no: ["Negación", "Respuesta negativa", "Rechaza"],
        ok: ["Expresa conformidad", "Muestra acuerdo", "Acepta"],
        hmm: ["Asentimiento breve", "Muestra duda", "Reflexiona"],
        "Fin.": ["Fin."],
        yes: ["Affirmation", "Affirmative response", "Confirms"],
        // "no" en inglés ya está cubierto por el español
        // "ok" en inglés ya está cubierto por el español
        // "hmm" en inglés ya está cubierto por el español
        "End.": ["End."],
      }

      // Crear array de normalizaciones para insertar
      const normalizacionesParaInsertar = []

      for (const expresion of expresionesInsertadas) {
        const normalizaciones = normalizacionesPorExpresion[expresion.expresion_original]
        if (normalizaciones) {
          for (const texto of normalizaciones) {
            normalizacionesParaInsertar.push({
              expresion_id: expresion.id,
              texto: texto,
            })
          }
        }
      }

      // Insertar normalizaciones si hay alguna
      if (normalizacionesParaInsertar.length > 0) {
        const { error: normError } = await supabaseClient
          .from("normalizaciones_esperadas")
          .insert(normalizacionesParaInsertar)

        if (normError) {
          console.error("Error al inicializar normalizaciones esperadas:", normError)
          // No fallamos la operación completa, solo registramos el error
        }
      }
    }

    return { success: true, message: "Tabla inicializada correctamente" }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}
