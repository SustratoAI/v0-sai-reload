import { InvestigadorForm } from "@/components/forms/investigador-form"
import { obtenerInvestigadorPorId } from "@/app/actions/investigadores-actions"
import { notFound } from "next/navigation"

export default async function EditarInvestigadorPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const { data: investigador, error } = await obtenerInvestigadorPorId(id)

  if (error || !investigador) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Investigador</h1>
      <InvestigadorForm investigador={investigador} />
    </div>
  )
}
