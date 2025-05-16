"use client";

import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/lib/database.types";

// Crear un cliente de Supabase para el navegador
export function createBrowserSupabaseClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Iniciar sesión con email y contraseña
export async function signInWithEmail(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
}

// Cerrar sesión
export async function signOut() {
  const supabase = createBrowserSupabaseClient();
  
  const { error } = await supabase.auth.signOut();
  
  // Forzar una recarga completa para limpiar el estado
  if (!error) {
    window.location.href = "/login";
  }
  
  return { error };
}

// Registrar un nuevo usuario
export async function signUp(email: string, password: string) {
  const supabase = createBrowserSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
}
