// app/layout.tsx
import React, { Suspense } from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "./providers"; // Tu archivo de providers (theme, etc.)
import { getAllFontVariables } from "@/lib/fonts";
import { AuthLayoutWrapper } from "./auth-layout-wrapper";
import { SustratoLoadingLogo } from "@/components/ui/sustrato-loading-logo";
import { Toaster } from "@/components/ui/toaster"; // Asegúrate de que tu Toaster esté aquí
import { LoadingProvider } from "@/contexts/LoadingContext"; // <--- IMPORTA EL NUEVO PROVIDER

export const metadata: Metadata = {
  title: "Sustrato.ai", // Ejemplo
  description: "Investigación Cualitativa Aumentada", // Ejemplo
  // ... otros metadatos ...
};

const GlobalLoadingIndicator = () => (
  <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center bg-background/80 backdrop-blur-sm">
    <SustratoLoadingLogo
      size={96}
      variant="spin-pulse"
      speed="fast"
      breathingEffect
      colorTransition
      text="Cargando página..." // Texto para el fallback de Suspense
    />
  </div>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVariables = getAllFontVariables();

  return (
    <html lang="es" suppressHydrationWarning className={fontVariables}>
      <body className="h-full bg-background text-foreground antialiased"> {/* Estilos base */}
        <Providers> {/* Tu provider de tema y otros globales */}
          <LoadingProvider> {/* <--- ENVUELVE CON LOADINGPROVIDER */}
            <AuthLayoutWrapper>
              <Suspense fallback={<GlobalLoadingIndicator />}>
                {children}
              </Suspense>
            </AuthLayoutWrapper>
            <Toaster /> {/* El Toaster para los mensajes de shadcn/ui o sonner */}
          </LoadingProvider> {/* <--- CIERRA LOADINGPROVIDER */}
        </Providers>
      </body>
    </html>
  );
}