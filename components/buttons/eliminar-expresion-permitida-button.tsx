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
import { eliminarExpresionPermitida } from "@/app/actions/expresiones-permitidas-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EliminarExpresionPermitidaButtonProps {
  id: number
}

export function EliminarExpresionPermitidaButton({ id }: EliminarExpresionPermitidaButtonProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await eliminarExpresionPermitida(id)

      if (result.error) {
        toast.error(result.error)
        setOpen(false)
      } else {
        toast.success("Expresión permitida eliminada correctamente")
        router.push("/configuracion/expresiones-permitidas")
        router.refresh()
      }
    } catch (error) {
      toast.error("Error al eliminar la expresión permitida")
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente la expresión permitida.
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
