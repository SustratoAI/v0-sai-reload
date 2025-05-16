"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CustomButton } from "@/components/ui/custom-button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// Añadir un nuevo import para los iconos
import { Check, ChevronRight, Download, Mail, Plus, Trash, X } from "lucide-react"

export default function ShowroomButtonPage() {
  const [loading, setLoading] = useState(false)
  // Añadir un nuevo estado para el resultado de la acción
  const [actionResult, setActionResult] = useState<"success" | "error" | null>(null)

  const handleLoadingDemo = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  // Añadir una nueva función para simular una acción con resultado
  const handleActionWithResult = (result: "success" | "error") => {
    setLoading(true)
    setActionResult(null)

    setTimeout(() => {
      setLoading(false)
      setActionResult(result)

      // Resetear después de mostrar el resultado
      setTimeout(() => {
        setActionResult(null)
      }, 2000)
    }, 2000)
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Showroom de Botones</h1>
      <p className="text-muted-foreground mb-8">
        Esta página muestra todas las variantes y funcionalidades del componente CustomButton.
      </p>

      <Tabs defaultValue="variants">
        <TabsList className="mb-8">
          <TabsTrigger value="variants">Variantes</TabsTrigger>
          <TabsTrigger value="sizes">Tamaños</TabsTrigger>
          <TabsTrigger value="colors">Colores</TabsTrigger>
          <TabsTrigger value="features">Características</TabsTrigger>
        </TabsList>

        <TabsContent value="variants">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Variantes básicas</CardTitle>
                <CardDescription>Diferentes estilos visuales para el botón</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Solid (Default)</h3>
                  <CustomButton>Botón Solid</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Outline</h3>
                  <CustomButton variant="outline">Botón Outline</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Ghost</h3>
                  <CustomButton variant="ghost">Botón Ghost</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Link</h3>
                  <CustomButton variant="link">Botón Link</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Subtle</h3>
                  <CustomButton variant="subtle">Botón Subtle</CustomButton>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estados</CardTitle>
                <CardDescription>Diferentes estados del botón</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Normal</h3>
                  <CustomButton>Botón Normal</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Disabled</h3>
                  <CustomButton disabled>Botón Deshabilitado</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Loading</h3>
                  <CustomButton loading={loading} onClick={handleLoadingDemo}>
                    {loading ? "Cargando..." : "Click para cargar"}
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Loading con texto personalizado</h3>
                  <CustomButton loading={loading} loadingText="Procesando..." onClick={handleLoadingDemo}>
                    Click para procesar
                  </CustomButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sizes">
          <Card>
            <CardHeader>
              <CardTitle>Tamaños</CardTitle>
              <CardDescription>Diferentes tamaños disponibles para el botón</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-end gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">XS</h3>
                <CustomButton size="xs">Botón XS</CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">SM</h3>
                <CustomButton size="sm">Botón SM</CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">MD (Default)</h3>
                <CustomButton size="md">Botón MD</CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">LG</h3>
                <CustomButton size="lg">Botón LG</CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">XL</h3>
                <CustomButton size="xl">Botón XL</CustomButton>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Botones con iconos</CardTitle>
              <CardDescription>Diferentes tamaños con iconos</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap items-end gap-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Con icono izquierdo</h3>
                <CustomButton leftIcon={<Mail />}>Enviar email</CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Con icono derecho</h3>
                <CustomButton rightIcon={<ChevronRight />}>Continuar</CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Solo icono (XS)</h3>
                <CustomButton size="xs" iconOnly>
                  <Plus />
                </CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Solo icono (SM)</h3>
                <CustomButton size="sm" iconOnly>
                  <Plus />
                </CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Solo icono (MD)</h3>
                <CustomButton size="md" iconOnly>
                  <Plus />
                </CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Solo icono (LG)</h3>
                <CustomButton size="lg" iconOnly>
                  <Plus />
                </CustomButton>
              </div>
              <div>
                <h3 className="text-sm font-medium mb-2">Solo icono (XL)</h3>
                <CustomButton size="xl" iconOnly>
                  <Plus />
                </CustomButton>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Colores (Solid)</CardTitle>
                <CardDescription>Diferentes colores para la variante solid</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Default</h3>
                  <CustomButton color="default">Botón Default</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Primary</h3>
                  <CustomButton color="primary">Botón Primary</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Secondary</h3>
                  <CustomButton color="secondary">Botón Secondary</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Tertiary</h3>
                  <CustomButton color="tertiary">Botón Tertiary</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Accent</h3>
                  <CustomButton color="accent">Botón Accent</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Success</h3>
                  <CustomButton color="success" leftIcon={<Check />}>
                    Botón Success
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Warning</h3>
                  <CustomButton color="warning">Botón Warning</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Danger</h3>
                  <CustomButton color="danger" leftIcon={<Trash />}>
                    Botón Danger
                  </CustomButton>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Colores (Outline)</CardTitle>
                <CardDescription>Diferentes colores para la variante outline</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Default</h3>
                  <CustomButton variant="outline" color="default">
                    Botón Default
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Primary</h3>
                  <CustomButton variant="outline" color="primary">
                    Botón Primary
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Secondary</h3>
                  <CustomButton variant="outline" color="secondary">
                    Botón Secondary
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Tertiary</h3>
                  <CustomButton variant="outline" color="tertiary">
                    Botón Tertiary
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Accent</h3>
                  <CustomButton variant="outline" color="accent">
                    Botón Accent
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Success</h3>
                  <CustomButton variant="outline" color="success" leftIcon={<Check />}>
                    Botón Success
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Warning</h3>
                  <CustomButton variant="outline" color="warning">
                    Botón Warning
                  </CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Danger</h3>
                  <CustomButton variant="outline" color="danger" leftIcon={<Trash />}>
                    Botón Danger
                  </CustomButton>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Características adicionales</CardTitle>
                <CardDescription>Funcionalidades adicionales del botón</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Full Width</h3>
                  <CustomButton fullWidth>Botón de ancho completo</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Gradient</h3>
                  <CustomButton gradient>Botón con gradiente</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Elevated</h3>
                  <CustomButton elevated>Botón con elevación</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Gradient + Elevated</h3>
                  <CustomButton gradient elevated>
                    Botón con gradiente y elevación
                  </CustomButton>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bordes redondeados</CardTitle>
                <CardDescription>Diferentes niveles de redondeo para los bordes</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">None</h3>
                  <CustomButton rounded="none">Botón sin redondeo</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Small</h3>
                  <CustomButton rounded="sm">Botón con redondeo pequeño</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Medium (Default)</h3>
                  <CustomButton rounded="md">Botón con redondeo medio</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Large</h3>
                  <CustomButton rounded="lg">Botón con redondeo grande</CustomButton>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-2">Full</h3>
                  <CustomButton rounded="full">Botón completamente redondeado</CustomButton>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2 mt-8">
              <CardHeader>
                <CardTitle>Botones con estados de acción</CardTitle>
                <CardDescription>Ejemplos de botones que muestran el resultado de una acción</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Acción con resultado</h3>
                    <div className="flex flex-col gap-2">
                      {actionResult === "success" ? (
                        <CustomButton color="success" leftIcon={<Check />}>
                          ¡Acción completada!
                        </CustomButton>
                      ) : actionResult === "error" ? (
                        <CustomButton color="danger" leftIcon={<X />}>
                          Error al procesar
                        </CustomButton>
                      ) : (
                        <CustomButton
                          loading={loading}
                          onClick={() => handleActionWithResult("success")}
                          color="primary"
                        >
                          {loading ? "Procesando..." : "Acción exitosa"}
                        </CustomButton>
                      )}

                      <div className="mt-2">
                        <CustomButton
                          variant="outline"
                          color="danger"
                          onClick={() => handleActionWithResult("error")}
                          disabled={loading || actionResult !== null}
                        >
                          Simular error
                        </CustomButton>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Botón con confirmación</h3>
                    <div className="flex flex-wrap gap-2">
                      {actionResult === "success" ? (
                        <CustomButton color="success" variant="subtle" leftIcon={<Check />}>
                          Archivo guardado
                        </CustomButton>
                      ) : (
                        <CustomButton
                          loading={loading}
                          loadingText="Guardando..."
                          onClick={() => handleActionWithResult("success")}
                          leftIcon={<Download />}
                          color="secondary"
                        >
                          Guardar archivo
                        </CustomButton>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Ejemplos de uso común</CardTitle>
                <CardDescription>Ejemplos de botones en contextos comunes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Formulario de contacto</h3>
                    <div className="flex flex-col gap-2">
                      <CustomButton leftIcon={<Mail />} color="primary">
                        Enviar mensaje
                      </CustomButton>
                      <CustomButton variant="outline" color="default">
                        Cancelar
                      </CustomButton>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Acciones de documento</h3>
                    <div className="flex flex-wrap gap-2">
                      <CustomButton leftIcon={<Download />} size="sm">
                        Descargar
                      </CustomButton>
                      <CustomButton variant="outline" size="sm" leftIcon={<Plus />}>
                        Nuevo
                      </CustomButton>
                      <CustomButton variant="ghost" size="sm" color="danger" leftIcon={<Trash />}>
                        Eliminar
                      </CustomButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
