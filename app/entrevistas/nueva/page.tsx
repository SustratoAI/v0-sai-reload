import { EntrevistaForm } from "@/components/forms/entrevista-form"
import { obtenerFundaciones } from "@/app/actions/fundaciones-actions"
import { obtenerEntrevistados } from "@/app/actions/entrevistados-actions"
import { obtenerInvestigadores } from "@/app/actions/investigadores-actions"
import { redirect } from "next/navigation"

export default async function NuevaEntrevistaPage() {
  const [fundacionesResult, entrevistadosResult, investigadoresResult] = await Promise.all([
    obtenerFundaciones(),
    obtenerEntrevistados(),
    obtenerInvestigadores(),
  ])

  const fundaciones = fundacionesResult.data || []
  const entrevistados = entrevistadosResult.data || []
  const investigadores = investigadoresResult.data || []

  // Solo redirige si realmente no hay datos
  if (fundaciones.length === 0) {
    return redirect("/configuracion/fundaciones?error=Debes crear al menos una fundación antes de crear entrevistas")
  }

  if (entrevistados.length === 0) {
    return redirect(
      "/configuracion/entrevistados?error=Debes crear al menos un entrevistado antes de crear entrevistas",
    )
  }

  if (investigadores.length === 0) {
    return redirect(
      "/configuracion/investigadores?error=Debes crear al menos un investigador antes de crear entrevistas",
    )
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nueva Entrevista</h1>
      <EntrevistaForm fundaciones={fundaciones} entrevistados={entrevistados} investigadores={investigadores} />
    </div>
  )
}
