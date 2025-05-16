"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { eliminarEntrevistado } from "@/app/actions/entrevistados-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EliminarEntrevistadoButtonProps {
  id: number
}

export function EliminarEntrevistadoButton({ id }: EliminarEntrevistadoButtonProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await eliminarEntrevistado(id)

      if (result.error) {
        toast.error(result.error)
        setOpen(false)
      } else {
        toast.success("Entrevistado eliminado correctamente")
        router.push("/entrevistados")
        router.refresh()
      }
    } catch (error) {
      toast.error("Error al eliminar el entrevistado")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>
        Eliminar
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Estás seguro?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el entrevistado.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
