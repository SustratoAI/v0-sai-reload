import { Button } from "@/components/ui/button"
import { obtenerEntrevistadoPorId } from "@/app/actions/entrevistados-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EliminarEntrevistadoButton } from "@/components/buttons/eliminar-entrevistado-button"

export default async function DetalleEntrevistadoPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const { data: entrevistado, error } = await obtenerEntrevistadoPorId(id)

  if (error || !entrevistado) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle de Entrevistado</h1>
        <div className="flex space-x-2">
          <Link href={`/entrevistados/${id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <EliminarEntrevistadoButton id={id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{`${entrevistado.nombre} ${entrevistado.apellido}`}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Código</h3>
              <p className="mt-1 text-lg">{entrevistado.codigo}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Institución</h3>
              <p className="mt-1 text-lg">{entrevistado.fundacion?.nombre || "-"}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Cargo</h3>
            <p className="mt-1">{entrevistado.cargo || "Sin cargo"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Contacto</h3>
            <p className="mt-1">{entrevistado.contacto || "Sin información de contacto"}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Notas</h3>
            <p className="mt-1">{entrevistado.notas || "Sin notas"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/entrevistados">
          <Button variant="outline">Volver a Entrevistados</Button>
        </Link>
      </div>
    </div>
  )
}
