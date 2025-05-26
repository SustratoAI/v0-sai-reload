// Componente de Prueba Simple (ej. TestToastButton.tsx)
"use client";
import React from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button"; // Un botón simple de shadcn

export function TestToastButton() {
  const { toast } = useToast();

  const handleClick = () => {
    console.log("TestToastButton: Botón clickeado, intentando toast...");
    toast({
      title: "Toast de Prueba (Botón Aislado)",
      description: "¿Aparezco desde un botón simple?",
      duration: 5000,
    });
    console.log("TestToastButton: Toast debería estar encolado.");
  };

  return (
    <div className="my-4 p-4 border border-dashed">
      <p className="mb-2 font-semibold">Zona de Prueba de Toast Aislado</p>
      <Button onClick={handleClick}>Mostrar Toast de Prueba</Button>
    </div>
  );
}

// Exporta el componente como exportación por defecto
export default function Page() {
  return <TestToastButton />;
}
