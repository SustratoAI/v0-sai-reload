import { Button } from "@/components/ui/button"
import { obtenerExpresionesPermitidas } from "@/app/actions/expresiones-permitidas-actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EliminarExpresionPermitidaButton } from "@/components/buttons/eliminar-expresion-permitida-button"

export default async function DetalleExpresionPermitidaPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const { data: expresiones, error } = await obtenerExpresionesPermitidas()
  const expresion = expresiones?.find((exp) => exp.id === id)

  if (error || !expresion) {
    notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Detalle de Expresión Permitida</h1>
        <div className="flex space-x-2">
          <Link href={`/configuracion/expresiones-permitidas/${id}/editar`}>
            <Button variant="outline">Editar</Button>
          </Link>
          <EliminarExpresionPermitidaButton id={id} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{expresion.expresion_original}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Idioma</h3>
            <p className="mt-1">
              <Badge>{expresion.idioma}</Badge>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Normalizaciones Esperadas</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {expresion.normalizaciones_esperadas.map((norm, index) => (
                <Badge key={index} variant="outline" className="bg-blue-50">
                  {norm}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Permitida como Normalización</h3>
            <p className="mt-1">
              {expresion.es_permitida_como_normalizacion ? (
                <Badge className="bg-green-100 text-green-800">Sí</Badge>
              ) : (
                <Badge variant="outline" className="text-gray-500">
                  No
                </Badge>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/configuracion/expresiones-permitidas">
          <Button variant="outline">Volver a Expresiones Permitidas</Button>
        </Link>
      </div>
    </div>
  )
}
