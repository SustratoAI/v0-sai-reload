"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function TxtToCsvConverter() {
  const [inputText, setInputText] = useState("")
  const [csvContent, setCsvContent] = useState("")
  const [isConverted, setIsConverted] = useState(false)

  // Reemplazar la función convertToCsv con esta nueva versión:
  const convertToCsv = () => {
    if (!inputText.trim()) {
      alert("Por favor, ingresa el texto a convertir")
      return
    }

    try {
      // Dividir el texto en líneas
      const lines = inputText.split("\n")

      const csvRows = []
      let currentRole = ""
      let currentContent = []
      let idCounter = 1 // Contador para el ID autonumérico

      // Agregar encabezados CSV
      csvRows.push(["ID", "Hablante", "Timestamp", "Rol", "Texto_original", "Texto_normalizado", "Nivel_confianza"])

      // Procesar cada línea
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()

        // Si la línea está vacía, continuamos
        if (!line) continue

        // Verificar si es una línea que indica el rol
        if (line.includes("Entrevistadora:")) {
          // Si ya teníamos contenido previo, lo guardamos
          if (currentRole && currentContent.length > 0) {
            const texto = currentContent.join(" ")
            csvRows.push([
              idCounter++, // ID autonumérico
              currentRole === "Entrevistadora" ? "entrevistadora" : "entrevistado", // Hablante
              "", // Timestamp (vacío)
              currentRole === "Entrevistadora" ? "I" : "E", // Rol (I o E)
              texto, // Texto_original
              texto, // Texto_normalizado (duplicado)
              "5", // Nivel de confianza
            ])
            currentContent = []
          }
          currentRole = "Entrevistadora"
          // Capturar el contenido que podría estar en la misma línea
          const content = line.replace("Entrevistadora:", "").trim()
          if (content) currentContent.push(content)
        } else if (line.includes("Entrevistado:")) {
          // Si ya teníamos contenido previo, lo guardamos
          if (currentRole && currentContent.length > 0) {
            const texto = currentContent.join(" ")
            csvRows.push([
              idCounter++, // ID autonumérico
              currentRole === "Entrevistadora" ? "entrevistadora" : "entrevistado", // Hablante
              "", // Timestamp (vacío)
              currentRole === "Entrevistadora" ? "I" : "E", // Rol (I o E)
              texto, // Texto_original
              texto, // Texto_normalizado (duplicado)
              "5", // Nivel de confianza
            ])
            currentContent = []
          }
          currentRole = "Entrevistado"
          // Capturar el contenido que podría estar en la misma línea
          const content = line.replace("Entrevistado:", "").trim()
          if (content) currentContent.push(content)
        } else if (currentRole) {
          // Si ya tenemos un rol definido, agregamos esta línea al contenido actual
          currentContent.push(line)
        }
      }

      // Agregar el último bloque de contenido si existe
      if (currentRole && currentContent.length > 0) {
        const texto = currentContent.join(" ")
        csvRows.push([
          idCounter++, // ID autonumérico
          currentRole === "Entrevistadora" ? "entrevistadora" : "entrevistado", // Hablante
          "", // Timestamp (vacío)
          currentRole === "Entrevistadora" ? "I" : "E", // Rol (I o E)
          texto, // Texto_original
          texto, // Texto_normalizado (duplicado)
          "5", // Nivel de confianza
        ])
      }

      // Agregar una fila final para el sistema (marca de fin)
      csvRows.push([
        idCounter++, // ID autonumérico
        "sistema", // Hablante
        "", // Timestamp (vacío)
        "S", // Rol (S para sistema)
        "Fin de la transcripción", // Texto_original
        "Fin de la transcripción", // Texto_normalizado
        "5", // Nivel de confianza
      ])

      // Convertir las filas a formato CSV
      const csvOutput = csvRows
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
        .join("\n")

      setCsvContent(csvOutput)
      setIsConverted(true)
    } catch (error) {
      console.error("Error al convertir:", error)
      alert("Ocurrió un error al convertir el texto. Por favor, verifica el formato.")
    }
  }

  // Actualizar el nombre del archivo de descarga
  const downloadCsv = () => {
    if (!csvContent) return

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "transcripcion_formato.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Conversor de Texto a CSV</h1>
        <Link href="/transcripciones">
          <Button variant="outline">Volver a Transcripciones</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Conversor de Transcripción TXT a CSV (Formato Específico)</CardTitle>
          <CardDescription>
            Convierte transcripciones a formato CSV con campos ID, Hablante, Timestamp, Rol, Texto_original,
            Texto_normalizado y Nivel_confianza
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="inputText" className="block text-sm font-medium mb-2">
              Texto de la transcripción:
            </label>
            <Textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Pega aquí el texto de la transcripción..."
              className="min-h-[300px]"
            />
          </div>

          {isConverted && (
            <div>
              <label htmlFor="csvOutput" className="block text-sm font-medium mb-2">
                Resultado en formato CSV:
              </label>
              <Textarea id="csvOutput" value={csvContent} readOnly className="min-h-[200px] font-mono text-sm" />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={convertToCsv}>Convertir a CSV</Button>
          {isConverted && (
            <Button onClick={downloadCsv} variant="outline">
              Descargar CSV
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
