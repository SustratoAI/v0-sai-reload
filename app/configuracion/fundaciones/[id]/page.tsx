import { redirect } from "next/navigation"

export default function DetalleFundacionRedirectConfig({ params }: { params: { id: string } }) {
  redirect(`/fundaciones/${params.id}`)
}
