import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FundacionesTable } from "@/components/tables/fundaciones-table"
import { obtenerFundaciones } from "@/app/actions/fundaciones-actions"

export default async function FundacionesPage() {
  const { data: fundaciones = [], error } = await obtenerFundaciones()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Instituciones</h1>
        <Link href="/fundaciones/nueva">
          <Button>Nueva Institución</Button>
        </Link>
      </div>

      {error ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error al cargar instituciones: {error}
        </div>
      ) : fundaciones.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-gray-500 mb-4">No hay instituciones registradas</p>
          <Link href="/fundaciones/nueva">
            <Button>Crear primera institución</Button>
          </Link>
        </div>
      ) : (
        <FundacionesTable fundaciones={fundaciones} />
      )}
    </div>
  )
}
