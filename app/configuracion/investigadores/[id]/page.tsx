import { Button } from "@/components/ui/button"
import { obtenerInvestigadorPorId } from "@/app/actions/investigadores-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EliminarInvestigadorButton } from "@/components/buttons/eliminar-investigador-button"

export default async function DetalleInvestigadorPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const { data: investigador, error } = await obtenerInvestigadorPorId(id)

  if (error || !investigador) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle de Investigador</h1>
        <div className="flex space-x-2">
          <Link href={`/configuracion/investigadores/${id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <EliminarInvestigadorButton id={id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{`${investigador.nombre} ${investigador.apellido}`}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Código</h3>
              <p className="mt-1 text-lg">{investigador.codigo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Institución</h3>
              <p className="mt-1 text-lg">{investigador.institucion || "-"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Cargo</h3>
            <p className="mt-1">{investigador.cargo || "Sin cargo"}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="mt-1">{investigador.email || "Sin email"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Teléfono</h3>
              <p className="mt-1">{investigador.telefono || "Sin teléfono"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Notas</h3>
            <p className="mt-1">{investigador.notas || "Sin notas"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/configuracion/investigadores">
          <Button variant="outline">Volver a Investigadores</Button>
        </Link>
      </div>
    </div>
  )
}
