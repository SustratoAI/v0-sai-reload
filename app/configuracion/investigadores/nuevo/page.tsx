import { InvestigadorForm } from "@/components/forms/investigador-form"

export default function NuevoInvestigadorPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Nuevo Investigador</h1>
      <InvestigadorForm />
    </div>
  )
}
