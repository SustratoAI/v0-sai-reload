"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User, Session } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "./client";
import { signInWithEmail, signOut, signUp } from "./client";
import { obtenerProyectosUsuario, obtenerProyectoPorId, type Proyecto } from "@/app/actions/proyecto-actions";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  proyectoActual: Proyecto | null;
  proyectosDisponibles: Proyecto[];
  cargandoProyectos: boolean;
  seleccionarProyecto: (proyectoId: string) => Promise<void>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{
    error: any;
    success: boolean;
  }>;
  signUp: (
    email: string,
    password: string
  ) => Promise<{
    error: any;
    success: boolean;
  }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [proyectoActual, setProyectoActual] = useState<Proyecto | null>(null);
  const [proyectosDisponibles, setProyectosDisponibles] = useState<Proyecto[]>([]);
  const [cargandoProyectos, setCargandoProyectos] = useState(false);
  const [mostrarSelectorProyecto, setMostrarSelectorProyecto] = useState(false);

  // Función para cargar los proyectos del usuario
  const cargarProyectosUsuario = async (userId: string) => {
    if (!userId) return;
    
    console.log("🔍 Cargando proyectos para usuario:", userId);
    setCargandoProyectos(true);
    try {
      const resultado = await obtenerProyectosUsuario(userId);
      console.log("📊 Proyectos obtenidos:", resultado);
      
      if (resultado.success && resultado.data) {
        setProyectosDisponibles(resultado.data);
        console.log(`🔢 Número de proyectos encontrados: ${resultado.data.length}`);
        
        // Verificar si hay un proyecto guardado en localStorage
        const proyectoGuardadoId = localStorage.getItem('proyectoActualId');
        console.log("💾 Proyecto guardado en localStorage:", proyectoGuardadoId);
        
        if (proyectoGuardadoId) {
          // Intentar cargar el proyecto guardado
          const proyectoEncontrado = resultado.data.find((p: Proyecto) => p.id === proyectoGuardadoId);
          
          if (proyectoEncontrado) {
            console.log("✅ Usando proyecto guardado:", proyectoEncontrado);
            setProyectoActual(proyectoEncontrado);
          } else if (resultado.data.length > 0) {
            // Si el proyecto guardado no existe pero hay proyectos disponibles,
            // mostrar el selector
            console.log("⚠️ Proyecto guardado no encontrado, mostrando selector");
            setMostrarSelectorProyecto(true);
          }
        } else if (resultado.data.length === 1) {
          // Si solo hay un proyecto, seleccionarlo automáticamente
          console.log("🔄 Auto-seleccionando único proyecto disponible");
          setProyectoActual(resultado.data[0]);
          localStorage.setItem('proyectoActualId', resultado.data[0].id);
        } else if (resultado.data.length > 1) {
          // Si hay múltiples proyectos, mostrar selector
          console.log("🔄 Múltiples proyectos, mostrando selector:", resultado.data);
          setMostrarSelectorProyecto(true);
        }
      }
    } catch (error) {
      console.error("❌ Error al cargar proyectos del usuario:", error);
    } finally {
      setCargandoProyectos(false);
    }
  };
  
  // Función para seleccionar un proyecto
  const seleccionarProyecto = async (proyectoId: string) => {
    try {
      const resultado = await obtenerProyectoPorId(proyectoId);
      if (resultado.success && resultado.data) {
        setProyectoActual(resultado.data);
        localStorage.setItem('proyectoActualId', proyectoId);
        setMostrarSelectorProyecto(false);
        console.log("✅ Proyecto seleccionado:", resultado.data);
      } else {
        console.error("❌ Error al seleccionar proyecto:", resultado.error);
      }
    } catch (error) {
      console.error("❌ Excepción al seleccionar proyecto:", error);
    }
  };

  // Efecto para inicializar la sesión
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      try {
        const supabase = createBrowserSupabaseClient();
        
        // Obtener la sesión actual
        const { data } = await supabase.auth.getSession();
        
        if (data.session) {
          setSession(data.session);
          setUser(data.session.user);
          
          // Cargar proyectos con un pequeño retraso para asegurar que las cookies estén sincronizadas
          setTimeout(() => {
            cargarProyectosUsuario(data.session.user.id);
          }, 500);
        }
      } catch (error) {
        console.error("Error al inicializar la autenticación:", error);
      } finally {
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    // Configurar el listener para cambios en la autenticación
    const supabase = createBrowserSupabaseClient();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("🔄 Evento de autenticación:", event);
        
        setSession(session);
        setUser(session?.user || null);
        
        if (event === "SIGNED_IN" && session) {
          console.log("✅ Usuario autenticado:", session.user.id);
          
          // Cargar proyectos con un retraso para asegurar que las cookies estén sincronizadas
          setTimeout(() => {
            cargarProyectosUsuario(session.user.id);
          }, 1000);
        } else if (event === "SIGNED_OUT") {
          console.log("🚪 Usuario cerró sesión");
          setProyectoActual(null);
          setProyectosDisponibles([]);
          localStorage.removeItem('proyectoActualId');
        }
      }
    );
    
    // Limpiar la suscripción al desmontar
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await signInWithEmail(email, password);
      
      if (error) {
        console.error("❌ Error en login:", error);
        return { error, success: false };
      }
      
      console.log("✅ Login exitoso");
      return { error: null, success: true };
    } catch (error) {
      console.error("❌ Excepción en login:", error);
      return { error, success: false };
    }
  };

  // Función para registrarse
  const signup = async (email: string, password: string) => {
    try {
      const { data, error } = await signUp(email, password);
      
      if (error) {
        return { error, success: false };
      }
      
      return { error: null, success: true };
    } catch (error) {
      return { error, success: false };
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      // Limpiar estado local primero
      setUser(null);
      setSession(null);
      setProyectoActual(null);
      setProyectosDisponibles([]);
      localStorage.removeItem('proyectoActualId');
      
      // Cerrar sesión en Supabase
      await signOut();
    } catch (error) {
      console.error("❌ Error al cerrar sesión:", error);
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        proyectoActual,
        proyectosDisponibles,
        cargandoProyectos,
        seleccionarProyecto,
        signIn: login,
        signUp: signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
