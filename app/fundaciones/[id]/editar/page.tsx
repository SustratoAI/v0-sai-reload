import { FundacionForm } from "@/components/forms/fundacion-form"
import { obtenerFundacionPorId } from "@/app/actions/fundaciones-actions"
import { notFound } from "next/navigation"

export default async function EditarFundacionPage({ params }: { params: { id: string } }) {
  const id = Number.parseInt(params.id)

  if (isNaN(id)) {
    notFound()
  }

  const { data: fundacion, error } = await obtenerFundacionPorId(id)

  if (error || !fundacion) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Institución</h1>
      <FundacionForm fundacion={fundacion} />
    </div>
  )
}
