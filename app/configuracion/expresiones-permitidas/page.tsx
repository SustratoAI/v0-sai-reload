import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ExpresionesPermitidasTable } from "@/components/tables/expresiones-permitidas-table"
import { obtenerExpresionesPermitidas } from "@/app/actions/expresiones-permitidas-actions"

export default async function ExpresionesPermitidasPage() {
  const { data: expresiones = [], error } = await obtenerExpresionesPermitidas()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Expresiones Permitidas</h1>
        <div className="flex space-x-2">
          <Link href="/configuracion/expresiones-permitidas/nueva">
            <Button>Nueva Expresión</Button>
          </Link>
          <Link href="/configuracion/expresiones-permitidas/inicializar">
            <Button variant="outline">Inicializar Datos</Button>
          </Link>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6">
        <h3 className="text-amber-800 font-medium mb-2">Nota sobre los idiomas</h3>
        <p className="text-amber-700">
          El sistema trata cada variante de idioma (es-ES, es-CL, etc.) como un idioma separado. Las expresiones
          permitidas se filtran por el idioma exacto seleccionado en la validación. Si necesitas las mismas expresiones
          para diferentes variantes del mismo idioma, deberás crearlas para cada variante.
        </p>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error al cargar expresiones permitidas: {error}
        </div>
      ) : expresiones.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-gray-500 mb-4">No hay expresiones permitidas registradas</p>
          <div className="flex justify-center space-x-4">
            <Link href="/configuracion/expresiones-permitidas/nueva">
              <Button>Crear primera expresión</Button>
            </Link>
            <Link href="/configuracion/expresiones-permitidas/inicializar">
              <Button variant="outline">Inicializar con datos predeterminados</Button>
            </Link>
          </div>
        </div>
      ) : (
        <ExpresionesPermitidasTable expresiones={expresiones} />
      )}
    </div>
  )
}
