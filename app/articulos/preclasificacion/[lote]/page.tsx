"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Brain, ArrowLeft } from "lucide-react"
import ArticleTable from "@/components/articulos/article-table"

export default function LotePreclasificacionPage({ params }: { params: { lote: string } }) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null)
  const [abstractDialogOpen, setAbstractDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("original")
  const [investigador, setInvestigador] = useState<string | null>(null)

  useEffect(() => {
    // Obtener el investigador de la URL
    const urlParams = new URLSearchParams(window.location.search)
    const invParam = urlParams.get("investigador")
    setInvestigador(invParam)
  }, [])

  const handleVolver = () => {
    if (investigador) {
      router.push(`/articulos/preclasificacion?investigador=${investigador}`)
    } else {
      router.push("/articulos/preclasificacion")
    }
  }

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      try {
        // Primero, obtener solo los artículos básicos para verificar las columnas disponibles
        const { data: articlesData, error: articlesError } = await supabase
          .from("articles")
          .select("*")
          .eq("lote", params.lote)
          .order("correlativo", { ascending: true })

        if (articlesError) {
          console.error("Error al cargar artículos:", articlesError)
          setLoading(false)
          return
        }

        if (!articlesData || articlesData.length === 0) {
          console.log("No se encontraron artículos para este lote")
          setArticles([])
          setLoading(false)
          return
        }

        // Obtener los IDs de los artículos para las consultas relacionadas
        const articleIds = articlesData.map((article) => article.id)

        // Obtener las dimensiones de los artículos
        const { data: dimensionsData, error: dimensionsError } = await supabase
          .from("article_dimensions_pivot")
          .select("*")
          .in("article_id", articleIds)

        if (dimensionsError) {
          console.error("Error al cargar dimensiones:", dimensionsError)
        }

        // Obtener las traducciones de los artículos
        const { data: translationsData, error: translationsError } = await supabase
          .from("article_translations")
          .select("*")
          .in("article_id", articleIds)

        if (translationsError) {
          console.error("Error al cargar traducciones:", translationsError)
        }

        // Combinar los datos
        const articlesWithRelations = articlesData.map((article) => {
          return {
            ...article,
            dimensions: dimensionsData?.filter((d) => d.article_id === article.id) || [],
            translations: translationsData?.filter((t) => t.article_id === article.id) || [],
          }
        })

        setArticles(articlesWithRelations)
      } catch (error) {
        console.error("Error general:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [params.lote, supabase])

  const handleAbstractClick = (article: any) => {
    setSelectedArticle(article)
    setAbstractDialogOpen(true)
  }

  const handleCoInvestigadorClick = () => {
    window.open(
      "https://chatgpt.com/g/g-QoD8sYiM3-co-investigador-academico",
      "Co-investigador",
      "width=500,height=700,top=100,left=1200,toolbar=no,menubar=no,scrollbars=yes,resizable=yes",
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        <span className="ml-2 text-lg">Cargando artículos...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleVolver} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <h1 className="text-3xl font-bold">Preclasificación - Lote {params.lote}</h1>
        </div>
        <Button onClick={handleCoInvestigadorClick} className="bg-purple-600 hover:bg-purple-700">
          <Brain className="mr-2 h-4 w-4" />
          Co-investigador AI
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Artículos del lote {params.lote}</CardTitle>
        </CardHeader>
        <CardContent>
          <ArticleTable articles={articles} onAbstractClick={handleAbstractClick} />
        </CardContent>
      </Card>

      {/* Diálogo para mostrar el abstract */}
      <Dialog open={abstractDialogOpen} onOpenChange={setAbstractDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl">{selectedArticle?.Title}</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="original" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="original">Abstract Original</TabsTrigger>
              <TabsTrigger value="traduccion">Traducción</TabsTrigger>
              <TabsTrigger value="resumen">Resumen IA</TabsTrigger>
            </TabsList>

            <TabsContent value="original" className="mt-4">
              <ScrollArea className="h-[50vh]">
                <div className="p-4 space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">Autores</h3>
                    <p>{selectedArticle?.Authors}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Año</h3>
                    <p>{selectedArticle?.Publication_Year}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Abstract</h3>
                    <p className="whitespace-pre-line">{selectedArticle?.Abstract}</p>
                  </div>
                  {selectedArticle?.DOI && (
                    <div>
                      <h3 className="font-semibold text-lg">DOI</h3>
                      <p>{selectedArticle.DOI}</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="traduccion" className="mt-4">
              <ScrollArea className="h-[50vh]">
                <div className="p-4 space-y-4">
                  {selectedArticle?.translations && selectedArticle.translations.length > 0 ? (
                    <>
                      <div>
                        <h3 className="font-semibold text-lg">Título Traducido</h3>
                        <p>{selectedArticle.translations[0].article_title_translation}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">Abstract Traducido</h3>
                        <p className="whitespace-pre-line">{selectedArticle.translations[0].abstract_translation}</p>
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-gray-500 italic">No hay traducción disponible para este artículo.</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="resumen" className="mt-4">
              <ScrollArea className="h-[50vh]">
                <div className="p-4">
                  {selectedArticle?.translations &&
                  selectedArticle.translations.length > 0 &&
                  selectedArticle.translations[0].abstract_summary ? (
                    <div>
                      <h3 className="font-semibold text-lg">Resumen generado por IA</h3>
                      <p className="whitespace-pre-line">{selectedArticle.translations[0].abstract_summary}</p>
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 italic">No hay resumen IA disponible para este artículo.</p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  )
}
