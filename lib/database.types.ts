// lib/database.types.ts

export interface Database {
  public: {
    Tables: {
      users_profiles: {
        Row: {
          user_id: string;
          first_name: string | null;
          last_name: string | null;
          public_display_name: string | null;
          public_contact_email: string | null;
          primary_institution: string | null;
          contact_phone: string | null;
          general_notes: string | null;
          preferred_language: string | null;
          pronouns: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          first_name?: string | null;
          last_name?: string | null;
          public_display_name?: string | null;
          public_contact_email?: string | null;
          primary_institution?: string | null;
          contact_phone?: string | null;
          general_notes?: string | null;
          preferred_language?: string | null;
          pronouns?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          user_id?: string;
          first_name?: string | null;
          last_name?: string | null;
          public_display_name?: string | null;
          public_contact_email?: string | null;
          primary_institution?: string | null;
          contact_phone?: string | null;
          general_notes?: string | null;
          preferred_language?: string | null;
          pronouns?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_profiles_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      projects: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          description: string | null;
          institution_name: string | null;
          lead_researcher_user_id: string | null;
          status: string;
          module_bibliography: boolean;
          module_interviews: boolean;
          module_planning: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string | null;
          description?: string | null;
          institution_name?: string | null;
          lead_researcher_user_id?: string | null;
          status?: string;
          module_bibliography?: boolean;
          module_interviews?: boolean;
          module_planning?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string | null;
          description?: string | null;
          institution_name?: string | null;
          lead_researcher_user_id?: string | null;
          status?: string;
          module_bibliography?: boolean;
          module_interviews?: boolean;
          module_planning?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_lead_researcher_user_id_fkey";
            columns: ["lead_researcher_user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      project_roles: {
        Row: {
          id: string;
          project_id: string;
          role_name: string;
          role_description: string | null;
          can_manage_master_data: boolean;
          can_create_batches: boolean;
          can_upload_files: boolean;
          can_bulk_edit_master_data: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          role_name: string;
          role_description?: string | null;
          can_manage_master_data?: boolean;
          can_create_batches?: boolean;
          can_upload_files?: boolean;
          can_bulk_edit_master_data?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          role_name?: string;
          role_description?: string | null;
          can_manage_master_data?: boolean;
          can_create_batches?: boolean;
          can_upload_files?: boolean;
          can_bulk_edit_master_data?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_roles_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      project_members: {
        Row: {
          id: string;
          project_id: string;
          user_id: string;
          project_role_id: string;
          is_active_for_user: boolean;
          ui_theme: string | null;
          ui_font_pair: string | null;
          ui_is_dark_mode: boolean;
          contextual_notes: string | null;
          contact_email_for_project: string | null;
          joined_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          user_id: string;
          project_role_id: string;
          is_active_for_user?: boolean;
          ui_theme?: string | null;
          ui_font_pair?: string | null;
          ui_is_dark_mode?: boolean;
          contextual_notes?: string | null;
          contact_email_for_project?: string | null;
          joined_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          user_id?: string;
          project_role_id?: string;
          is_active_for_user?: boolean;
          ui_theme?: string | null;
          ui_font_pair?: string | null;
          ui_is_dark_mode?: boolean;
          contextual_notes?: string | null;
          contact_email_for_project?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey";
            columns: ["project_id"];
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_members_project_role_id_fkey";
            columns: ["project_role_id"];
            referencedRelation: "project_roles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: { // <--- SECCIÓN MODIFICADA/AÑADIDA
      detailed_project_members: {
        Row: {
          project_member_id: string | null; // Asumiendo que pm.id no es NULL
          user_id: string | null;           // Asumiendo que pm.user_id no es NULL
          project_id: string | null;        // Asumiendo que pm.project_id no es NULL
          project_role_id: string | null;   // Asumiendo que pm.project_role_id no es NULL
          joined_at: string | null;         // timestamptz
          role_name: string | null;         // text
          first_name: string | null;        // text
          last_name: string | null;         // text
          public_display_name: string | null; // text
          public_contact_email: string | null; // text
          primary_institution: string | null; // text
          contact_phone: string | null;     // text
          general_notes: string | null;     // text
          preferred_language: string | null;// text
          pronouns: string | null;          // text
          ui_theme: string | null;          // text
          ui_font_pair: string | null;      // text
          ui_is_dark_mode: boolean | null;  // boolean
          // Campos de permisos del rol (si los incluiste en la VISTA)
          can_manage_master_data?: boolean | null; // boolean
          can_create_batches?: boolean | null;     // boolean
          can_upload_files?: boolean | null;       // boolean
          can_bulk_edit_master_data?: boolean | null; // boolean
          // Otros campos de project_members (si los incluiste en la VISTA)
          is_active_for_user?: boolean | null;      // boolean
          contextual_notes?: string | null;         // text
          contact_email_for_project?: string | null;// text
        };
        // No se definen Insert ni Update para vistas de solo lectura por defecto
      };
    };
    Functions: {
      get_current_auth_context: {
        Args: Record<string, unknown>;
        Returns: {
          current_uid: string | null;
          current_role: string | null;
        }[];
      };
      get_user_by_email: {
        Args: {
          user_email: string;
        };
        Returns: string | null;
      };
      has_permission_in_project: {
        Args: {
          p_user_id: string;
          p_project_id: string;
          p_permission_column: string;
        };
        Returns: boolean;
      };
      is_user_member_of_project: {
        Args: {
            p_user_id: string;
            p_project_id_to_check: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}