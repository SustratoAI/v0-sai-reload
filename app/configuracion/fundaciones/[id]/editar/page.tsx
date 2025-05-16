import { redirect } from "next/navigation"

export default function EditarFundacionRedirectConfig({ params }: { params: { id: string } }) {
  redirect(`/fundaciones/${params.id}/editar`)
}
