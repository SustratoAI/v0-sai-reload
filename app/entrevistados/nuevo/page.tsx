import { EntrevistadoForm } from "@/components/forms/entrevistado-form"
import { obtenerFundaciones } from "@/app/actions/fundaciones-actions"
import { redirect } from "next/navigation"

export default async function NuevoEntrevistadoPage() {
  const { data: fundaciones = [], error } = await obtenerFundaciones()

  if (error || fundaciones.length === 0) {
    return redirect("/fundaciones?error=Debes crear al menos una institución antes de crear entrevistados")
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nuevo Entrevistado</h1>
      <EntrevistadoForm fundaciones={fundaciones} />
    </div>
  )
}
