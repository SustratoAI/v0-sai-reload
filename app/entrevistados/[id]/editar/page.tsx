import { EntrevistadoForm } from "@/components/forms/entrevistado-form"
import { obtenerEntrevistadoPorId } from "@/app/actions/entrevistados-actions"
import { obtenerFundaciones } from "@/app/actions/fundaciones-actions"
import { notFound } from "next/navigation"

export default async function EditarEntrevistadoPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const [entrevistadoResult, fundacionesResult] = await Promise.all([
    obtenerEntrevistadoPorId(id),
    obtenerFundaciones(),
  ])

  const { data: entrevistado, error: entrevistadoError } = entrevistadoResult
  const { data: fundaciones = [], error: fundacionesError } = fundacionesResult

  if (entrevistadoError || !entrevistado || fundacionesError || fundaciones.length === 0) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Entrevistado</h1>
      <EntrevistadoForm entrevistado={entrevistado} fundaciones={fundaciones} />
    </div>
  )
}
