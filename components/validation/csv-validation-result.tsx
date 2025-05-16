"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"
import type { ValidationResult } from "@/lib/utils/csv-validator"

interface CSVValidationResultProps {
  validationResult: ValidationResult
  onContinue: () => void
  onCancel: () => void
}

export function CSVValidationResult({ validationResult, onContinue, onCancel }: CSVValidationResultProps) {
  const [showAllSegments, setShowAllSegments] = useState(false)
  const [activeTab, setActiveTab] = useState<"summary" | "errors" | "warnings" | "stats">("summary")

  const segmentsToShow = showAllSegments
    ? validationResult.segmentsWithIssues
    : validationResult.segmentsWithIssues.slice(0, 5)

  const hasMoreSegments = validationResult.segmentsWithIssues.length > 5

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resultado de Validación CSV</CardTitle>
          {validationResult.isValid ? (
            <Badge className="bg-green-500">Válido</Badge>
          ) : (
            <Badge className="bg-red-500">Inválido</Badge>
          )}
        </div>
        <CardDescription>
          Se analizaron {validationResult.stats.totalSegments} segmentos de transcripción
        </CardDescription>
      </CardHeader>

      <div className="border-b px-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("summary")}
            className={`py-2 border-b-2 ${
              activeTab === "summary"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Resumen
          </button>
          <button
            onClick={() => setActiveTab("errors")}
            className={`py-2 border-b-2 flex items-center ${
              activeTab === "errors"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Errores
            {validationResult.blockingErrors.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {validationResult.blockingErrors.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("warnings")}
            className={`py-2 border-b-2 flex items-center ${
              activeTab === "warnings"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Advertencias
            {validationResult.warnings.length > 0 && (
              <Badge variant="outline" className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                {validationResult.warnings.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("stats")}
            className={`py-2 border-b-2 ${
              activeTab === "stats"
                ? "border-primary text-primary font-medium"
                : "border-transparent text-muted-foreground"
            }`}
          >
            Estadísticas
          </button>
        </div>
      </div>

      <CardContent className="pt-6">
        {activeTab === "summary" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center">
                    <Info className="mr-2 h-5 w-5 text-blue-500" />
                    Segmentos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{validationResult.stats.totalSegments}</p>
                  <p className="text-sm text-muted-foreground">Total de segmentos analizados</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center">
                    <XCircle className="mr-2 h-5 w-5 text-red-500" />
                    Errores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{validationResult.blockingErrors.length}</p>
                  <p className="text-sm text-muted-foreground">Problemas que impiden la carga</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-lg flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                    Advertencias
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{validationResult.warnings.length}</p>
                  <p className="text-sm text-muted-foreground">Problemas que requieren atención</p>
                </CardContent>
              </Card>
            </div>

            {validationResult.segmentsWithIssues.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-2">Segmentos con problemas</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Texto Original</TableHead>
                      <TableHead>Texto Normalizado</TableHead>
                      <TableHead>Problemas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {segmentsToShow.map((segment) => (
                      <TableRow key={segment.id}>
                        <TableCell>{segment.id}</TableCell>
                        <TableCell>{segment.row.Rol}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{segment.row.Texto_Original}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{segment.row.Texto_Normalizado}</TableCell>
                        <TableCell>
                          {segment.errors.length > 0 && (
                            <Badge variant="destructive" className="mr-1">
                              {segment.errors.length} {segment.errors.length === 1 ? "error" : "errores"}
                            </Badge>
                          )}
                          {segment.warnings.length > 0 && (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                              {segment.warnings.length} {segment.warnings.length === 1 ? "advertencia" : "advertencias"}
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {hasMoreSegments && (
                  <Button variant="outline" className="mt-2" onClick={() => setShowAllSegments(!showAllSegments)}>
                    {showAllSegments
                      ? "Mostrar menos segmentos"
                      : `Ver todos los segmentos (${validationResult.segmentsWithIssues.length})`}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "errors" && (
          <div className="space-y-4">
            {validationResult.blockingErrors.length === 0 ? (
              <div className="flex items-center justify-center p-6 text-center">
                <div>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-2 text-lg font-medium">No se encontraron errores</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    El archivo CSV no tiene errores críticos que impidan su carga.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Errores críticos detectados</AlertTitle>
                  <AlertDescription>
                    Se encontraron {validationResult.blockingErrors.length} errores que impiden la carga del archivo.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  {validationResult.blockingErrors.map((error, index) => (
                    <Alert key={index} variant="destructive">
                      <AlertTitle>{error.message}</AlertTitle>
                      {error.details && <AlertDescription>{error.details}</AlertDescription>}
                    </Alert>
                  ))}
                </div>

                {validationResult.segmentsWithIssues.filter((s) => s.errors.length > 0).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Segmentos con errores</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Texto Original</TableHead>
                          <TableHead>Texto Normalizado</TableHead>
                          <TableHead>Errores</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResult.segmentsWithIssues
                          .filter((s) => s.errors.length > 0)
                          .map((segment) => (
                            <TableRow key={segment.id}>
                              <TableCell>{segment.id}</TableCell>
                              <TableCell>{segment.row.Rol}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{segment.row.Texto_Original}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{segment.row.Texto_Normalizado}</TableCell>
                              <TableCell>
                                <ul className="list-disc pl-5 text-sm">
                                  {segment.errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "warnings" && (
          <div className="space-y-4">
            {validationResult.warnings.length === 0 &&
            validationResult.segmentsWithIssues.filter((s) => s.warnings.length > 0).length === 0 ? (
              <div className="flex items-center justify-center p-6 text-center">
                <div>
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                  <h3 className="mt-2 text-lg font-medium">No se encontraron advertencias</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    El archivo CSV no tiene advertencias que requieran atención.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {validationResult.warnings.length > 0 && (
                  <div className="space-y-2">
                    <Alert className="bg-yellow-50 border-yellow-200">
                      <AlertTriangle className="h-4 w-4 text-yellow-800" />
                      <AlertTitle className="text-yellow-800">Advertencias generales</AlertTitle>
                      <AlertDescription className="text-yellow-800">
                        Se encontraron {validationResult.warnings.length} advertencias que requieren atención.
                      </AlertDescription>
                    </Alert>

                    {validationResult.warnings.map((warning, index) => (
                      <Alert key={index} className="bg-yellow-50 border-yellow-200">
                        <AlertTitle className="text-yellow-800">{warning.message}</AlertTitle>
                        {warning.details && (
                          <AlertDescription className="text-yellow-800">{warning.details}</AlertDescription>
                        )}
                      </Alert>
                    ))}
                  </div>
                )}

                {validationResult.segmentsWithIssues.filter((s) => s.warnings.length > 0).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2">Segmentos con advertencias</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Rol</TableHead>
                          <TableHead>Texto Original</TableHead>
                          <TableHead>Texto Normalizado</TableHead>
                          <TableHead>Advertencias</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {validationResult.segmentsWithIssues
                          .filter((s) => s.warnings.length > 0)
                          .map((segment) => (
                            <TableRow key={segment.id}>
                              <TableCell>{segment.id}</TableCell>
                              <TableCell>{segment.row.Rol}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{segment.row.Texto_Original}</TableCell>
                              <TableCell className="max-w-[200px] truncate">{segment.row.Texto_Normalizado}</TableCell>
                              <TableCell>
                                <ul className="list-disc pl-5 text-sm">
                                  {segment.warnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                  ))}
                                </ul>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(validationResult.stats.rolesDistribution).map(([role, count]) => (
                      <div key={role} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Badge className="mr-2">
                            {role === "I"
                              ? "Investigador"
                              : role === "E"
                                ? "Entrevistado"
                                : role === "S"
                                  ? "Sistema"
                                  : role}
                          </Badge>
                          <span>{count} segmentos</span>
                        </div>
                        <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${(count / validationResult.stats.totalSegments) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Niveles de Confianza</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(validationResult.stats.confidenceLevels)
                      .sort((a, b) => Number(b[0]) - Number(a[0]))
                      .map(([level, count]) => (
                        <div key={level} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Badge
                              className={`mr-2 ${
                                Number(level) <= 2
                                  ? "bg-red-500"
                                  : Number(level) === 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                            >
                              Nivel {level}
                            </Badge>
                            <span>{count} segmentos</span>
                          </div>
                          <div className="w-1/2 bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                Number(level) <= 2
                                  ? "bg-red-500"
                                  : Number(level) === 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              }`}
                              style={{ width: `${(count / validationResult.stats.totalSegments) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Texto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Longitud promedio (original)</p>
                    <p className="text-2xl font-bold">{validationResult.stats.averageOriginalLength} caracteres</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Longitud promedio (normalizado)</p>
                    <p className="text-2xl font-bold">{validationResult.stats.averageNormalizedLength} caracteres</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Timestamps faltantes</p>
                    <p className="text-2xl font-bold">{validationResult.stats.missingTimestamps} segmentos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={onContinue} disabled={!validationResult.isValid}>
          {validationResult.isValid ? "Continuar con la carga" : "Corregir errores"}
        </Button>
      </CardFooter>
    </Card>
  )
}
