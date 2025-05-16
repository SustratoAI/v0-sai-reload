import { obtenerEntrevistaPorId } from "@/app/actions/entrevistas-actions";
import { obtenerTranscripcionesPorEntrevista } from "@/app/actions/transcripciones-actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProTable } from "@/components/ui/pro-table";
import {
  crearColumnasTranscripciones,
  type SegmentoTranscripcion,
} from "@/components/tables/transcripciones-entrevista-columns";

export default async function TranscripcionesEntrevistaPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number.parseInt(params.id);

  if (isNaN(id)) {
    notFound();
  }

  const [entrevistaResult, transcripcionesResult] = await Promise.all([
    obtenerEntrevistaPorId(id),
    obtenerTranscripcionesPorEntrevista(id),
  ]);

  const { data: entrevista, error: entrevistaError } = entrevistaResult;
  const { data: transcripciones = [], error: transcripcionesError } =
    transcripcionesResult;

  if (entrevistaError || !entrevista) {
    notFound();
  }

  // Obtener nombres de hablantes para mostrar en la tabla
  const investigadorNombre = entrevista.investigador
    ? `${entrevista.investigador.nombre} ${entrevista.investigador.apellido}`
    : "Investigador";

  const entrevistadoNombre = entrevista.entrevistado
    ? `${entrevista.entrevistado.nombre} ${entrevista.entrevistado.apellido}`
    : "Entrevistado";

  // Crear las columnas para la tabla
  const columnas = crearColumnasTranscripciones(
    investigadorNombre,
    entrevistadoNombre
  );

  // Función para determinar el color de fondo de las filas según el nivel de confianza
  const getRowStatus = (row: SegmentoTranscripcion) => {
    const nivelConfianza = Number(row.nivel_confianza);
    if (nivelConfianza <= 2) return "error";
    if (nivelConfianza === 3) return "warning";
    return "success";
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Transcripciones de Entrevista</h1>
        <div className="flex space-x-2">
          <Link href={`/entrevistas/${id}`}>
            <Button variant="outline">Volver a Entrevista</Button>
          </Link>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{entrevista.codigo_entrevista}</CardTitle>
          <CardDescription>
            {entrevista.entrevistado
              ? `Entrevistado: ${entrevista.entrevistado.nombre} ${entrevista.entrevistado.apellido}`
              : ""}
            {entrevista.fecha_entrevista
              ? ` • Fecha: ${new Date(
                  entrevista.fecha_entrevista
                ).toLocaleDateString("es-ES")}`
              : ""}
          </CardDescription>
        </CardHeader>
      </Card>

      {transcripcionesError ? (
        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          Error al cargar transcripciones: {transcripcionesError}
        </div>
      ) : transcripciones.length === 0 ? (
        <div className="p-8 text-center border rounded-md">
          <p className="text-gray-500 mb-4">
            No hay transcripciones para esta entrevista
          </p>
          <Link href="/transcripciones/cargar">
            <Button>Cargar Transcripción</Button>
          </Link>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Segmentos de Transcripción</CardTitle>
            <CardDescription>
              Total: {transcripciones.length} segmentos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-md">
              <ProTable
                columns={columnas}
                data={transcripciones}
                enableTooltips={true}
                showColumnSelector={true}
                placeholder="Buscar en transcripciones..."
                getRowStatus={getRowStatus}
                lineClamp={5} // Configuramos 5 líneas visibles para todas las celdas
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
