"use server"

import { supabaseClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

interface PerfilInvestigadorData {
  user_id?: string
  proyecto_id: string
  cargo_id: string
  nombre: string
  apellido: string
  institucion?: string
  telefono?: string
  notas?: string
}

/**
 * Verifica si un usuario tiene permiso para asignar investigadores
 */
export async function verificarPermisoAsignarInvestigadores(userId: string, proyectoId: string) {
  try {
    // Obtener el perfil del investigador actual
    const { data: perfilActual, error: perfilError } = await supabaseClient
      .from("perfil_investigador")
      .select("cargo_id")
      .eq("user_id", userId)
      .eq("proyecto_id", proyectoId)
      .single()

    if (perfilError) {
      console.error("Error al obtener perfil del investigador:", perfilError)
      return { tienePermiso: false, error: "Error al verificar permisos" }
    }

    if (!perfilActual) {
      return { tienePermiso: false, error: "No tiene un perfil en este proyecto" }
    }

    // Verificar si el cargo tiene permiso para asignar investigadores
    const { data: cargo, error: cargoError } = await supabaseClient
      .from("cargo")
      .select("asignar_investigadores")
      .eq("id", perfilActual.cargo_id)
      .single()

    if (cargoError) {
      console.error("Error al obtener información del cargo:", cargoError)
      return { tienePermiso: false, error: "Error al verificar permisos del cargo" }
    }

    return { 
      tienePermiso: cargo?.asignar_investigadores || false, 
      error: null 
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { tienePermiso: false, error: "Ocurrió un error inesperado" }
  }
}

/**
 * Obtiene todos los investigadores de un proyecto específico
 */
export async function obtenerInvestigadoresProyecto(proyectoId: string) {
  try {
    console.log('Intentando obtener investigadores para proyecto ID:', proyectoId);
    
    // Consulta simplificada: solo intentar obtener los datos básicos sin joins
    const { data, error } = await supabaseClient
      .from("perfil_investigador")
      .select("id, nombre, apellido, institucion")
      .eq("proyecto_id", proyectoId);

    if (error) {
      console.error("Error específico al obtener investigadores:", error);
      return { error: `Error al obtener investigadores: ${error.message || JSON.stringify(error)}` };
    }

    console.log('Datos obtenidos:', data ? data.length : 0, 'registros');
    return { success: true, data: data || [] };
  } catch (error) {
    console.error("Error inesperado:", error);
    return { error: `Error inesperado: ${error instanceof Error ? error.message : JSON.stringify(error)}` };
  }
}

/**
 * Verifica si un usuario ya tiene un perfil en el proyecto
 */
export async function verificarUsuarioTienePerfil(email: string, proyectoId: string) {
  try {
    // Primero obtenemos el user_id a partir del email
    const { data: userData, error: userError } = await supabaseClient
      .rpc("get_user_by_email", { email_param: email })

    if (userError || !userData || userData.length === 0) {
      console.error("Error al obtener usuario por email:", userError)
      return { tienePerfil: false, error: "No se encontró el usuario con ese email" }
    }

    const userId = userData[0].id

    // Ahora verificamos si ya tiene perfil en el proyecto
    const { data: perfilExistente, error: perfilError } = await supabaseClient
      .rpc("check_user_has_profile", { 
        user_id_param: userId, 
        proyecto_id_param: proyectoId 
      })

    if (perfilError) {
      console.error("Error al verificar perfil existente:", perfilError)
      return { tienePerfil: false, error: "Error al verificar perfil existente" }
    }

    return { 
      tienePerfil: perfilExistente, 
      userId: userId,
      error: null 
    }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { tienePerfil: false, error: "Ocurrió un error inesperado" }
  }
}

/**
 * Crea un nuevo perfil de investigador
 */
export async function crearPerfilInvestigador(data: PerfilInvestigadorData) {
  try {
    // Si no se proporciona user_id, pero sí un email, obtener el user_id
    if (!data.user_id && data.email) {
      const { userId, tienePerfil, error } = await verificarUsuarioTienePerfil(data.email, data.proyecto_id)
      
      if (error) {
        return { error }
      }
      
      if (tienePerfil) {
        return { error: "Este usuario ya tiene un perfil en el proyecto" }
      }
      
      data.user_id = userId
    }

    // Insertar el nuevo perfil
    const { data: nuevoPerfil, error } = await supabaseClient
      .from("perfil_investigador")
      .insert([{
        user_id: data.user_id,
        proyecto_id: data.proyecto_id,
        cargo_id: data.cargo_id,
        nombre: data.nombre,
        apellido: data.apellido,
        institucion: data.institucion || null,
        telefono: data.telefono || null,
        notas: data.notas || null
      }])
      .select()
      .single()

    if (error) {
      console.error("Error al crear perfil de investigador:", error)
      return { error: "Error al crear el perfil de investigador" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/datos-maestros/investigadores")

    return { success: true, data: nuevoPerfil }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

/**
 * Actualiza un perfil de investigador existente
 */
export async function actualizarPerfilInvestigador(id: string, data: Partial<PerfilInvestigadorData>) {
  try {
    const { data: perfilActualizado, error } = await supabaseClient
      .from("perfil_investigador")
      .update({
        cargo_id: data.cargo_id,
        nombre: data.nombre,
        apellido: data.apellido,
        institucion: data.institucion || null,
        telefono: data.telefono || null,
        notas: data.notas || null
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error al actualizar perfil de investigador:", error)
      return { error: "Error al actualizar el perfil de investigador" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/datos-maestros/investigadores")

    return { success: true, data: perfilActualizado }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

/**
 * Elimina un perfil de investigador
 */
export async function eliminarPerfilInvestigador(id: string) {
  try {
    const { error } = await supabaseClient
      .from("perfil_investigador")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error al eliminar perfil de investigador:", error)
      return { error: "Error al eliminar el perfil de investigador" }
    }

    // Revalidar la ruta para actualizar los datos
    revalidatePath("/datos-maestros/investigadores")

    return { success: true }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}

/**
 * Obtiene todos los cargos disponibles para un proyecto
 */
export async function obtenerCargosProyecto(proyectoId: string) {
  try {
    const { data, error } = await supabaseClient
      .from("cargo")
      .select("id, nombre, asignar_investigadores")
      .eq("proyecto_id", proyectoId)
      .order("nombre")

    if (error) {
      console.error("Error al obtener cargos:", error)
      return { error: "Error al obtener los cargos disponibles" }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Ocurrió un error inesperado" }
  }
}
