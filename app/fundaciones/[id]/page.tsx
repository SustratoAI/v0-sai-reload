import { Button } from "@/components/ui/button"
import { obtenerFundacionPorId } from "@/app/actions/fundaciones-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EliminarFundacionButton } from "@/components/buttons/eliminar-fundacion-button"

export default async function DetalleFundacionPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const { data: fundacion, error } = await obtenerFundacionPorId(id)

  if (error || !fundacion) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle de Institución</h1>
        <div className="flex space-x-2">
          <Link href={`/fundaciones/${id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <EliminarFundacionButton id={id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{fundacion.nombre}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Código</h3>
            <p className="mt-1 text-lg">{fundacion.codigo}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Descripción</h3>
            <p className="mt-1">{fundacion.descripcion || "Sin descripción"}</p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/fundaciones">
          <Button variant="outline">Volver a Instituciones</Button>
        </Link>
      </div>
    </div>
  )
}
