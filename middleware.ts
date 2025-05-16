// middleware.ts - OPTIMIZADO
import { createMiddlewareClient } from "@/lib/supabase-middleware-client";
import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";
import type { Database } from "@/lib/database.types";

export async function middleware(req: NextRequest) {
  const requestId = Math.floor(Math.random() * 10000);
  console.log(`[MW:${requestId}] Ejecutando para: ${req.nextUrl.pathname}`);
  
  const publicRoutes = ["/login", "/signup", "/reset-password", "/contact"];
  if (publicRoutes.some(route => req.nextUrl.pathname === route || req.nextUrl.pathname.startsWith(`${route}/`))) {
    console.log(`[MW:${requestId}] Ruta pública - acceso permitido`);
    return NextResponse.next();
  }
  
  const skipPatterns = [
    '/_next', '/api/', 'favicon', '.json', '.ico', '.png', '.jpg', '.svg', '.js', '.css', '.woff', '.woff2'
  ];
  if (skipPatterns.some(pattern => req.nextUrl.pathname.includes(pattern))) {
    return NextResponse.next();
  }
  
  const res = NextResponse.next();
  
  try {
    const supabase = createMiddlewareClient(req, res); // createMiddlewareClient es de @supabase/ssr
    
    // CAMBIO SUGERIDO AQUÍ: Usar getUser() en lugar de getSession()
    const { data: { user }, error: userError } = await supabase.auth.getUser(); // getUser() devuelve { data: { user }, error }

    if (userError || !user) { // Si hay error o no hay usuario (sesión inválida/expirada)
      console.log(`[MW:${requestId}] Sin sesión válida (error: ${userError?.message}) o usuario no encontrado - redirigiendo a /login`);
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Si hay usuario, la sesión es válida y ha sido autenticada contra el servidor de Supabase
    console.log(`[MW:${requestId}] Sesión válida y autenticada para usuario: ${user.id.substring(0, 8)}...`);
    return res; // Continuar con la respuesta original (que ya tiene la cookie de sesión actualizada si fue necesario)

  } catch (e) {
    // Este catch es para errores inesperados en el proceso del middleware mismo
    console.error(`[MW:${requestId}] Error inesperado en middleware:`, e);
    // En caso de error, permitir el acceso podría ser una opción, 
    // o podrías redirigir a una página de error o login como fallback seguro.
    // Por ahora, mantendremos NextResponse.next() para no bloquear si algo sale muy mal.
    return NextResponse.next();
  }
}

// Configuración del middleware: asegura que se ejecute en las rutas necesarias
// y excluye las rutas estáticas o de API internas de Next.js.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
