"use server"

import { createClient } from "@/lib/supabase"
import { revalidatePath } from "next/cache"

export async function createInstitucion(data: {
  codigo: string
  nombre: string
  descripcion: string
}) {
  const supabase = createClient()

  const { error } = await supabase.from("instituciones").insert([
    {
      codigo: data.codigo.toUpperCase(),
      nombre: data.nombre,
      descripcion: data.descripcion,
    },
  ])

  if (error) {
    console.error("Error al crear institución:", error)
    throw new Error("No se pudo crear la institución")
  }

  revalidatePath("/instituciones")
}

export async function getInstituciones() {
  const supabase = createClient()

  const { data, error } = await supabase.from("instituciones").select("*").order("nombre")

  if (error) {
    console.error("Error al obtener instituciones:", error)
    return []
  }

  return data
}
