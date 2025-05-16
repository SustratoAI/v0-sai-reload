import { CargarTranscripcionForm } from "@/components/forms/cargar-transcripcion-form"
import { obtenerEntrevistados } from "@/app/actions/entrevistados-actions"
import { obtenerInvestigadores } from "@/app/actions/investigadores-actions"
import { redirect } from "next/navigation"

export default async function CargarTranscripcionPage() {
  const [entrevistadosResult, investigadoresResult] = await Promise.all([
    obtenerEntrevistados(),
    obtenerInvestigadores(),
  ])

  const entrevistados = entrevistadosResult.data || []
  const investigadores = investigadoresResult.data || []

  // Verificar si hay datos necesarios
  if (entrevistados.length === 0) {
    return redirect("/entrevistados?error=Debes crear al menos un entrevistado antes de cargar transcripciones")
  }

  if (investigadores.length === 0) {
    return redirect(
      "/configuracion/investigadores?error=Debes crear al menos un investigador antes de cargar transcripciones",
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Cargar Transcripción</h1>
      <CargarTranscripcionForm entrevistados={entrevistados} investigadores={investigadores} />
    </div>
  )
}
