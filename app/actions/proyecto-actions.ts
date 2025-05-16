// --- EN proyecto-actions.ts ---
"use server";

import { createSupabaseServerClient } from "@/lib/server";
import { Database } from "@/lib/database.types";

// ========================================================================
//  INICIO: DEFINICIONES DE INTERFACES Y TIPOS
// ========================================================================
export interface Project {
  id: string;
  name: string;
  code?: string | null;
  description?: string | null;
  institution_name?: string | null;
  status?: string | null;
  module_bibliography?: boolean | null;
  module_interviews?: boolean | null;
  module_planning?: boolean | null;
}

export interface UserProfile {
  user_id: string;
  first_name?: string | null;
  last_name?: string | null;
  primary_institution?: string | null;
  contact_phone?: string | null;
  general_notes?: string | null;
  public_display_name?: string | null;
  public_contact_email?: string | null;
  preferred_language?: string | null;
  pronouns?: string | null;
}

// Interfaz para los permisos de un rol
export interface RolePermissions {
  role_name?: string | null;
  can_manage_master_data?: boolean | null;
  can_create_batches?: boolean | null;
  can_upload_files?: boolean | null;
  can_bulk_edit_master_data?: boolean | null;
}

export interface UserProjectSetting extends Project {
  project_role_id: string;
  ui_theme: string | null;
  ui_font_pair: string | null;
  ui_is_dark_mode: boolean | null;
  is_active_for_user: boolean;
  contextual_notes?: string | null;
  contact_email_for_project?: string | null;
  permissions?: RolePermissions | null; // Permisos del rol del usuario en este proyecto
}

export interface UserDashboardData {
  profile: UserProfile | null;
  projects: UserProjectSetting[];
}

export type ResultadoOperacion<T> =
  | { success: true; data: T }
  | { error: string; success?: false };
// ========================================================================
//  FIN: DEFINICIONES DE INTERFACES Y TIPOS
// ========================================================================

export async function obtenerProyectosConSettingsUsuario(
  userId: string
): Promise<ResultadoOperacion<UserProjectSetting[]>> {
  const opId = Math.floor(Math.random() * 1000);
  console.log(
    `📄 [PCSU:${opId}] Iniciando obtenerProyectosConSettingsUsuario para: ${userId.substring(
      0,
      8
    )}...`
  );

  try {
    if (!userId || userId.trim() === "") {
      return { error: "Se requiere un ID de usuario válido" };
    }
    const supabase = await createSupabaseServerClient();

    // Verificación de Auth RPC (la mantendremos por ahora para seguridad)
    const { data: authContextResult, error: rpcError } = await supabase.rpc(
      "get_current_auth_context"
    );
    if (rpcError) {
      return { error: `RPC Error: ${rpcError.message}` };
    }

    if (
      !authContextResult ||
      !Array.isArray(authContextResult) ||
      authContextResult.length === 0
    ) {
      return { error: "RPC Auth context no válido" };
    }

    const authContext = authContextResult[0];
    if (
      !authContext ||
      typeof authContext !== "object" ||
      !("current_uid" in authContext) ||
      !("current_role" in authContext)
    ) {
      return { error: "RPC Auth context formato inválido" };
    }

    const { current_uid, current_role } = authContext as {
      current_uid: string | null;
      current_role: string | null;
    };
    if (current_role !== "authenticated") {
      return { error: `Rol no autenticado: ${current_role}` };
    }
    if (current_uid !== userId && current_uid) {
      userId = current_uid;
    }
    console.log(`✅ [PCSU:${opId}] Contexto de DB validado correctamente`);

    const { data: membresias, error: errorMembresias } = await supabase
      .from("project_members")
      .select(
        `
        project_role_id, 
        is_active_for_user,
        ui_theme,
        ui_font_pair,
        ui_is_dark_mode,
        contextual_notes,
        contact_email_for_project,
        joined_at,
        updated_at,
        projects (
          id,
          name,
          code,
          description,
          institution_name,
          status,
          module_bibliography,
          module_interviews,
          module_planning
        ),
        project_roles (
          role_name,
          can_manage_master_data,
          can_create_batches,
          can_upload_files,
          can_bulk_edit_master_data
        )
      `
      )
      .eq("user_id", userId);

    if (errorMembresias) {
      console.error(
        `❌ [PCSU:${opId}] Error al obtener membresías:`,
        errorMembresias
      );
      return {
        error: `Error al obtener membresías: ${errorMembresias.message}`,
      };
    }

    if (!membresias || membresias.length === 0) {
      console.log(
        `ℹ️ [PCSU:${opId}] No se encontraron membresías para el usuario.`
      );
      return { success: true, data: [] };
    }

    // Tipo intermedio que acepta null para usar en map
    type ProyectoSettingOrNull = UserProjectSetting | null;

    const proyectosConSettings: UserProjectSetting[] = membresias
      .map((m): ProyectoSettingOrNull => {
        const proyectoBase = m.projects as Project | null;
        if (!proyectoBase || !proyectoBase.id) {
          return null;
        }

        // Extraer datos de permisos del rol
        const rolePermissionsData = m.project_roles as RolePermissions | null;

        // Crear objeto de permisos (con valores por defecto si son null)
        const permissions: RolePermissions | null = rolePermissionsData
          ? {
              role_name: rolePermissionsData.role_name ?? null,
              can_manage_master_data:
                rolePermissionsData.can_manage_master_data ?? false,
              can_create_batches:
                rolePermissionsData.can_create_batches ?? false,
              can_upload_files: rolePermissionsData.can_upload_files ?? false,
              can_bulk_edit_master_data:
                rolePermissionsData.can_bulk_edit_master_data ?? false,
            }
          : null;

        return {
          // Campos de Project
          id: String(proyectoBase.id),
          name: proyectoBase.name,
          code: proyectoBase.code ?? null,
          description: proyectoBase.description ?? null,
          institution_name: proyectoBase.institution_name ?? null,
          status: proyectoBase.status ?? null,
          module_bibliography: proyectoBase.module_bibliography ?? null,
          module_interviews: proyectoBase.module_interviews ?? null,
          module_planning: proyectoBase.module_planning ?? null,

          // Campos de UserProjectSetting (directos de project_members)
          project_role_id: m.project_role_id!,
          is_active_for_user: m.is_active_for_user ?? false,
          ui_theme: m.ui_theme ?? null,
          ui_font_pair: m.ui_font_pair ?? null,
          ui_is_dark_mode: m.ui_is_dark_mode ?? false,
          contextual_notes: m.contextual_notes ?? null,
          contact_email_for_project: m.contact_email_for_project ?? null,

          // Objeto de permisos del rol
          permissions,
        };
      })
      .filter((p): p is UserProjectSetting => p !== null);

    console.log(
      `🎉 [PCSU:${opId}] ÉXITO: ${proyectosConSettings.length} proyectos con settings obtenidos.`
    );

    // Log detallado para ver la estructura completa de datos
    console.log(
      `📊 [PCSU:${opId}] DETALLE DE DATOS OBTENIDOS:`,
      JSON.stringify(
        {
          totalProyectos: proyectosConSettings.length,
          proyectos: proyectosConSettings.map((p) => ({
            id: p.id,
            name: p.name,
            code: p.code,
            description: p.description,
            institution_name: p.institution_name,
            status: p.status,
            module_bibliography: p.module_bibliography,
            module_interviews: p.module_interviews,
            module_planning: p.module_planning,
            // Settings de UI
            ui_theme: p.ui_theme,
            ui_font_pair: p.ui_font_pair,
            ui_is_dark_mode: p.ui_is_dark_mode,
            // Permisos
            permissions: p.permissions,
            // Otros datos
            project_role_id: p.project_role_id,
            is_active_for_user: p.is_active_for_user,
            contextual_notes: p.contextual_notes,
            contact_email_for_project: p.contact_email_for_project,
          })),
        },
        null,
        2
      )
    );

    return { success: true, data: proyectosConSettings };
  } catch (error) {
    console.error(`❌ [PCSU:${opId}] Excepción:`, error);
    return { error: `Error interno: ${(error as Error).message}` };
  }
}

export async function cargarDatosDashboardUsuario(
  userId: string
): Promise<ResultadoOperacion<UserDashboardData>> {
  const opId = Math.floor(Math.random() * 1000);
  console.log(
    `📄 [CDDU:${opId}] Iniciando cargarDatosDashboardUsuario para: ${userId.substring(
      0,
      8
    )}...`
  );

  try {
    const supabase = await createSupabaseServerClient();

    // 1. Obtener perfil general del usuario
    console.log(`🔍 [CDDU:${opId}] Obteniendo perfil general...`);
    const { data: profileData, error: profileError } = await supabase
      .from("users_profiles")
      .select(
        `
          user_id, 
          first_name, 
          last_name, 
          public_display_name,
          public_contact_email,
          primary_institution, 
          contact_phone, 
          general_notes,
          preferred_language,
          pronouns
      `
      )
      .eq("user_id", userId)
      .single();

    if (profileError && profileError.code !== "PGRST116") {
      console.error(`❌ [CDDU:${opId}] Error obteniendo perfil:`, profileError);
      return { error: `Error obteniendo perfil: ${profileError.message}` };
    }

    // 2. Obtener proyectos con sus settings de membresía
    console.log(`🔍 [CDDU:${opId}] Obteniendo proyectos con settings...`);
    const proyectosSettingsResultado = await obtenerProyectosConSettingsUsuario(
      userId
    );

    if (!proyectosSettingsResultado.success) {
      console.error(
        `❌ [CDDU:${opId}] Error obteniendo proyectos con settings:`,
        proyectosSettingsResultado.error
      );
      return { error: proyectosSettingsResultado.error };
    }

    const dashboardData: UserDashboardData = {
      profile: profileData as UserProfile | null,
      projects: proyectosSettingsResultado.data,
    };

    console.log(
      `🎉 [CDDU:${opId}] ÉXITO: Datos del dashboard cargados. Perfil: ${
        profileData ? "OK" : "No encontrado"
      }, Proyectos: ${dashboardData.projects.length}`
    );

    // Log detallado del perfil del usuario
    console.log(
      `👤 [CDDU:${opId}] DETALLE DEL PERFIL:`,
      JSON.stringify(dashboardData.profile, null, 2)
    );

    // Resumen de temas y fuentes configurados por proyecto
    console.log(`🎨 [CDDU:${opId}] CONFIGURACIONES DE UI POR PROYECTO:`);
    dashboardData.projects.forEach((project) => {
      console.log(`  - Proyecto "${project.name}" (${project.id.substring(
        0,
        8
      )}...):
        • Tema UI: ${project.ui_theme || "No configurado"}
        • Par de Fuentes: ${project.ui_font_pair || "No configurado"}
        • Modo Oscuro: ${
          project.ui_is_dark_mode ? "Activado" : "Desactivado"
        }`);
    });

    return { success: true, data: dashboardData };
  } catch (error) {
    console.error(`❌ [CDDU:${opId}] Excepción:`, error);
    return { error: `Error interno: ${(error as Error).message}` };
  }
}

// Otras funciones pueden implementarse según sea necesario
export async function obtenerProyectoPorId(
  proyectoId: string
): Promise<ResultadoOperacion<Project | null>> {
  const opId = Math.floor(Math.random() * 1000);
  console.log(
    `📄 [PPI:${opId}] Iniciando obtenerProyectoPorId para: ${proyectoId}`
  );

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("projects")
      .select(
        "id, name, code, description, institution_name, status, module_bibliography, module_interviews, module_planning"
      )
      .eq("id", proyectoId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return { success: true, data: null };
      }
      return { error: `Error al obtener proyecto: ${error.message}` };
    }

    const proyectoFormateado: Project = data as Project;
    return { success: true, data: proyectoFormateado };
  } catch (error) {
    return { error: `Error interno: ${(error as Error).message}` };
  }
}

export async function obtenerPerfilesMiembrosProyecto(
  proyectoId: string
): Promise<ResultadoOperacion<UserProfile[]>> {
  const opId = Math.floor(Math.random() * 1000);
  console.log(
    `📄 [PMP:${opId}] Iniciando obtenerPerfilesMiembrosProyecto para: ${proyectoId}`
  );

  try {
    const supabase = await createSupabaseServerClient();

    const { data: miembros, error } = await supabase
      .from("project_members")
      .select(
        `
          user_id,
          project_role_id, 
          users_profiles (
              user_id,
              first_name,
              last_name,
              primary_institution,
              contact_phone,
              general_notes,
              public_display_name,
              public_contact_email,
              preferred_language,
              pronouns
          )
      `
      )
      .eq("project_id", proyectoId);

    if (error) {
      return {
        error: `Error obteniendo miembros: ${(error as Error).message}`,
      };
    }
    if (!miembros) {
      return { success: true, data: [] };
    }

    const perfiles: UserProfile[] = miembros
      .map((m) => {
        const perfilData = m.users_profiles;
        if (
          perfilData &&
          typeof perfilData === "object" &&
          "user_id" in perfilData
        ) {
          return perfilData as UserProfile;
        }
        return null;
      })
      .filter((p): p is UserProfile => p !== null);

    console.log(
      `🎉 [PMP:${opId}] ÉXITO: ${perfiles.length} perfiles encontrados para proyecto ${proyectoId}.`
    );
    return { success: true, data: perfiles };
  } catch (error) {
    return { error: `Error interno: ${(error as Error).message}` };
  }
}

// Nueva server action para actualizar preferencias UI de un proyecto para un usuario
export async function actualizarPreferenciasUI(
  userId: string,
  proyectoId: string,
  preferencias: {
    ui_theme?: string | null;
    ui_font_pair?: string | null;
    ui_is_dark_mode?: boolean | null;
  }
): Promise<ResultadoOperacion<null>> {
  const opId = Math.floor(Math.random() * 1000);
  console.log(
    `📄 [APU:${opId}] Iniciando actualizarPreferenciasUI para usuario: ${userId.substring(
      0,
      8
    )}, proyecto: ${proyectoId.substring(0, 8)}`
  );

  try {
    if (!userId || !proyectoId) {
      return { error: "Se requiere ID de usuario y proyecto válidos" };
    }

    const supabase = await createSupabaseServerClient();

    // Actualizar solo los campos proporcionados
    const actualizaciones: any = {};
    if (preferencias.ui_theme !== undefined)
      actualizaciones.ui_theme = preferencias.ui_theme;
    if (preferencias.ui_font_pair !== undefined)
      actualizaciones.ui_font_pair = preferencias.ui_font_pair;
    if (preferencias.ui_is_dark_mode !== undefined)
      actualizaciones.ui_is_dark_mode = preferencias.ui_is_dark_mode;

    // Solo proceder si hay algo que actualizar
    if (Object.keys(actualizaciones).length === 0) {
      console.log(`ℹ️ [APU:${opId}] No hay cambios que actualizar`);
      return { success: true, data: null };
    }

    console.log(`📝 [APU:${opId}] Actualizando preferencias:`, actualizaciones);

    const { error } = await supabase
      .from("project_members")
      .update(actualizaciones)
      .eq("user_id", userId)
      .eq("project_id", proyectoId);

    if (error) {
      console.error(
        `❌ [APU:${opId}] Error al actualizar preferencias:`,
        error
      );
      return { error: `Error al actualizar preferencias: ${error.message}` };
    }

    console.log(`✅ [APU:${opId}] Preferencias actualizadas exitosamente`);
    return { success: true, data: null };
  } catch (error) {
    console.error(`❌ [APU:${opId}] Excepción:`, error);
    return { error: `Error interno: ${(error as Error).message}` };
  }
}

// Nueva server action para actualizar el proyecto activo
export async function actualizarProyectoActivo(
  userId: string,
  proyectoId: string
): Promise<ResultadoOperacion<null>> {
  const opId = Math.floor(Math.random() * 1000);
  console.log(
    `📄 [APA:${opId}] Iniciando actualizarProyectoActivo para usuario: ${userId.substring(
      0,
      8
    )}, proyecto: ${proyectoId.substring(0, 8)}`
  );

  try {
    if (!userId || !proyectoId) {
      return { error: "Se requiere ID de usuario y proyecto válidos" };
    }

    const supabase = await createSupabaseServerClient();

    // Primero desactivamos todos los proyectos del usuario
    console.log(
      `🔄 [APA:${opId}] Desactivando todos los proyectos del usuario`
    );
    const { error: desactivarError } = await supabase
      .from("project_members")
      .update({ is_active_for_user: false })
      .eq("user_id", userId);

    if (desactivarError) {
      console.error(
        `❌ [APA:${opId}] Error al desactivar proyectos:`,
        desactivarError
      );
      return {
        error: `Error al desactivar proyectos: ${desactivarError.message}`,
      };
    }

    // Luego activamos el proyecto seleccionado
    console.log(`🔄 [APA:${opId}] Activando proyecto seleccionado`);
    const { error: activarError } = await supabase
      .from("project_members")
      .update({ is_active_for_user: true })
      .eq("user_id", userId)
      .eq("project_id", proyectoId);

    if (activarError) {
      console.error(
        `❌ [APA:${opId}] Error al activar proyecto:`,
        activarError
      );
      return { error: `Error al activar proyecto: ${activarError.message}` };
    }

    console.log(`✅ [APA:${opId}] Proyecto activo actualizado exitosamente`);
    return { success: true, data: null };
  } catch (error) {
    console.error(`❌ [APA:${opId}] Excepción:`, error);
    return { error: `Error interno: ${(error as Error).message}` };
  }
}
