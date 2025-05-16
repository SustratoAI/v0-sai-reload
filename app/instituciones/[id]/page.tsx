import { redirect } from "next/navigation"

export default function InstitucionPage({ params }: { params: { id: string } }) {
  redirect(`/fundaciones/${params.id}`)
}
