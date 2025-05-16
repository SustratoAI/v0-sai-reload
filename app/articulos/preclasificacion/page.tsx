"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface Investigador {
  id: number
  codigo: string
  nombre: string
  apellido: string
}

interface Lote {
  lote: number
  codigo_investigador: string
  modelo_ai: string
  inicio: string | null
  fin: string | null
}

export default function PreclasificacionPage() {
  const searchParams = useSearchParams()
  const [investigadores, setInvestigadores] = useState<Investigador[]>([])
  const [selectedInvestigador, setSelectedInvestigador] = useState<string>("")
  const [lotes, setLotes] = useState<Lote[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const router = useRouter()

  // Cargar investigadores y verificar si hay uno en la URL
  useEffect(() => {
    async function fetchInvestigadores() {
      try {
        const { data, error } = await supabase
          .from("investigadores")
          .select("id, codigo, nombre, apellido")
          .order("apellido")

        if (error) throw error
        setInvestigadores(data || [])

        // Verificar si hay un investigador en la URL
        const invFromUrl = searchParams.get("investigador")
        if (invFromUrl) {
          setSelectedInvestigador(invFromUrl)
        } else {
          // Verificar si hay un investigador en localStorage
          const savedInv = localStorage.getItem("selectedInvestigador")
          if (savedInv) {
            setSelectedInvestigador(savedInv)
          }
        }
      } catch (error) {
        console.error("Error al cargar investigadores:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestigadores()
  }, [searchParams])

  // Cargar lotes cuando se selecciona un investigador
  useEffect(() => {
    if (!selectedInvestigador) {
      setLotes([])
      return
    }

    // Guardar el investigador seleccionado en localStorage
    localStorage.setItem("selectedInvestigador", selectedInvestigador)

    async function fetchLotes() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from("lote_revision_control")
          .select("*")
          .eq("codigo_investigador", selectedInvestigador)
          .order("lote")

        if (error) throw error
        setLotes(data || [])
      } catch (error) {
        console.error("Error al cargar lotes:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLotes()
  }, [selectedInvestigador])

  // Determinar el estado del lote
  const getLoteStatus = (lote: Lote) => {
    if (!lote.inicio && !lote.fin) return "por-procesar"
    if (lote.inicio && !lote.fin) return "en-proceso"
    return "procesado"
  }

  // Obtener etiqueta del estado
  const getStatusLabel = (status: string) => {
    switch (status) {
      case "por-procesar":
        return "Por procesar"
      case "en-proceso":
        return "En proceso"
      case "procesado":
        return "Procesado"
      default:
        return ""
    }
  }

  // Obtener icono según estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "por-procesar":
        return <AlertCircle className="h-5 w-5" />
      case "en-proceso":
        return <Clock className="h-5 w-5" />
      case "procesado":
        return <CheckCircle className="h-5 w-5" />
      default:
        return null
    }
  }

  // Manejar clic en lote
  const handleLoteClick = async (lote: Lote) => {
    // Si el lote no ha sido iniciado, actualizar la fecha de inicio
    if (!lote.inicio) {
      try {
        await supabase
          .from("lote_revision_control")
          .update({ inicio: new Date().toISOString() })
          .eq("lote", lote.lote)
          .eq("codigo_investigador", lote.codigo_investigador)
      } catch (error) {
        console.error("Error al actualizar fecha de inicio:", error)
      }
    }

    // Navegar a la página de detalle del lote
    router.push(`/articulos/preclasificacion/${lote.lote}?investigador=${lote.codigo_investigador}`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Preclasificación de Artículos Académicos</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Selección de Investigador</CardTitle>
          <CardDescription>
            Seleccione un investigador para ver los lotes asignados para preclasificación
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative z-50">
            <Select value={selectedInvestigador} onValueChange={setSelectedInvestigador}>
              <SelectTrigger className="w-full md:w-[300px]">
                <SelectValue placeholder="Seleccione un investigador" />
              </SelectTrigger>
              <SelectContent>
                {investigadores.map((investigador) => (
                  <SelectItem key={investigador.codigo} value={investigador.codigo}>
                    {investigador.nombre} {investigador.apellido} ({investigador.codigo})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {loading && selectedInvestigador ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Cargando lotes...</span>
        </div>
      ) : selectedInvestigador && lotes.length === 0 ? (
        <div className="text-center py-12 bg-muted rounded-lg">
          <h3 className="text-xl font-medium mb-2">No hay lotes asignados</h3>
          <p className="text-muted-foreground">No se encontraron lotes asignados al investigador seleccionado.</p>
        </div>
      ) : selectedInvestigador ? (
        <div>
          {selectedInvestigador && (
            <div className="mb-4">
              <p className="text-muted-foreground">
                Investigador seleccionado:{" "}
                <span className="font-medium">
                  {investigadores.find((inv) => inv.codigo === selectedInvestigador)?.nombre}{" "}
                  {investigadores.find((inv) => inv.codigo === selectedInvestigador)?.apellido} ({selectedInvestigador})
                </span>
              </p>
            </div>
          )}
          <h2 className="text-2xl font-semibold mb-4">Lotes Asignados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {lotes.map((lote) => {
              const status = getLoteStatus(lote)
              return (
                <Card
                  key={lote.lote}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    status === "por-procesar"
                      ? "border-red-200 hover:border-red-300"
                      : status === "en-proceso"
                        ? "border-yellow-200 hover:border-yellow-300"
                        : "border-green-200 hover:border-green-300"
                  }`}
                  onClick={() => handleLoteClick(lote)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Lote #{lote.lote}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Modelo IA: <span className="font-medium">{lote.modelo_ai || "No especificado"}</span>
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div
                      className={`flex items-center px-3 py-1 rounded-full text-sm ${
                        status === "por-procesar"
                          ? "bg-red-100 text-red-800"
                          : status === "en-proceso"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {getStatusIcon(status)}
                      <span className="ml-1">{getStatusLabel(status)}</span>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
