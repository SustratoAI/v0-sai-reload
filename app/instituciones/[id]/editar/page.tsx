import { redirect } from "next/navigation"

export default function EditarInstitucionPage({ params }: { params: { id: string } }) {
  redirect(`/fundaciones/${params.id}/editar`)
}
