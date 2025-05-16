import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ConfiguracionPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Configuración del Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Fundaciones</CardTitle>
            <CardDescription>Gestiona las fundaciones participantes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Administra el registro de fundaciones, sus códigos y descripciones.</p>
            <Link href="/fundaciones">
              <Button>Ir a Fundaciones</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Entrevistados</CardTitle>
            <CardDescription>Gestiona los entrevistados</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Administra el registro de entrevistados, sus datos y relaciones con fundaciones.</p>
            <Link href="/entrevistados">
              <Button>Ir a Entrevistados</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Investigadores</CardTitle>
            <CardDescription>Gestiona los investigadores</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Administra el registro de investigadores que realizan las entrevistas.</p>
            <Link href="/configuracion/investigadores">
              <Button>Ir a Investigadores</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dimensiones Matriz</CardTitle>
            <CardDescription>Gestiona las dimensiones de la matriz</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Administra las categorías, subcategorías y códigos para la matriz de vaciado.</p>
            <Link href="/configuracion/dimensiones">
              <Button>Ir a Dimensiones</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expresiones Permitidas</CardTitle>
            <CardDescription>Gestiona las expresiones permitidas para validación</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Administra las expresiones cortas permitidas y sus normalizaciones esperadas.</p>
            <div className="flex space-x-2">
              <Link href="/configuracion/expresiones-permitidas">
                <Button>Ir a Expresiones</Button>
              </Link>
              <Link href="/configuracion/expresiones-permitidas/inicializar">
                <Button variant="outline">Inicializar Datos</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
