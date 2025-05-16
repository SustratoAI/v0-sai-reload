import { redirect } from "next/navigation"

export default function DetalleEntrevistadoRedirectConfig({ params }: { params: { id: string } }) {
  redirect(`/entrevistados/${params.id}`)
}
