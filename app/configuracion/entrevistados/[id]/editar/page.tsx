import { redirect } from "next/navigation"

export default function EditarEntrevistadoRedirectConfig({ params }: { params: { id: string } }) {
  redirect(`/entrevistados/${params.id}/editar`)
}
