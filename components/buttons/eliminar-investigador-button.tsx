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
import { eliminarInvestigador } from "@/app/actions/investigadores-actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface EliminarInvestigadorButtonProps {
  id: number
}

export function EliminarInvestigadorButton({ id }: EliminarInvestigadorButtonProps) {
  const [open, setOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setIsDeleting(true)
    try {
      const result = await eliminarInvestigador(id)

      if (result.error) {
        toast.error(result.error)
        setOpen(false)
      } else {
        toast.success("Investigador eliminado correctamente")
        router.push("/configuracion/investigadores")
        router.refresh()
      }
    } catch (error) {
      toast.error("Error al eliminar el investigador")
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
              Esta acción no se puede deshacer. Esto eliminará permanentemente el investigador.
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
