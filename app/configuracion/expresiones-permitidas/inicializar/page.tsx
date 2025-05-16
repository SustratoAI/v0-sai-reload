"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { inicializarExpresionesPermitidas } from "@/app/actions/expresiones-permitidas-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

export default function InicializarExpresionesPermitidasPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null)
  const router = useRouter()

  const handleInitialize = async () => {
    setIsInitializing(true)
    try {
      const result = await inicializarExpresionesPermitidas()
      setResult(result)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message || "Expresiones permitidas inicializadas correctamente")
      }
    } catch (error) {
      console.error("Error al inicializar expresiones permitidas:", error)
      setResult({ error: "Error inesperado al inicializar expresiones permitidas" })
      toast.error("Error inesperado al inicializar expresiones permitidas")
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Inicializar Expresiones Permitidas</CardTitle>
          <CardDescription>
            Esta acción inicializará la tabla de expresiones permitidas con datos predeterminados. Solo se ejecutará si
            la tabla está vacía.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">Se crearán expresiones permitidas para los siguientes idiomas:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>Español (es-ES)</li>
            <li>Inglés (en-US)</li>
          </ul>
          <p className="text-amber-600">
            <strong>Nota:</strong> Esta acción solo añadirá datos si la tabla está vacía. Si ya existen datos, no se
            realizará ningún cambio.
          </p>

          {result && (
            <div
              className={`mt-4 p-4 rounded-md ${result.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              {result.success ? (
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-700">Operación exitosa</p>
                    <p className="text-green-600">{result.message}</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-700">Error</p>
                    <p className="text-red-600">{result.error}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => router.push("/configuracion/expresiones-permitidas")}
            disabled={isInitializing}
          >
            Cancelar
          </Button>
          <Button onClick={handleInitialize} disabled={isInitializing}>
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inicializando...
              </>
            ) : (
              "Inicializar Expresiones Permitidas"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
