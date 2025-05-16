import { ExpresionPermitidaForm } from "@/components/forms/expresion-permitida-form"
import { obtenerExpresionesPermitidas } from "@/app/actions/expresiones-permitidas-actions"
import { notFound } from "next/navigation"

export default async function EditarExpresionPermitidaPage({ params }: { params: { id: string } }) {
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
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Editar Expresión Permitida</h1>
      <ExpresionPermitidaForm expresion={expresion} />
    </div>
  )
}
