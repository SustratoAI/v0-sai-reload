"use client"

import type React from "react"

import { useState } from "react"
import { CustomInput } from "./custom-input"
import { CustomTextarea } from "./custom-textarea"
import { Building, Mail } from "lucide-react"

export function ExampleForm() {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    email: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold">Formulario de ejemplo</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="code" className="block text-sm font-medium mb-1">
            Código
          </label>
          <CustomInput
            id="code"
            name="code"
            placeholder="Ej: FR"
            value={formData.code}
            onChange={handleChange}
            leadingIcon={<Building className="h-4 w-4" />}
            hint="Código de 2 caracteres para identificar la institución"
            maxLength={2}
            showCharacterCount
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nombre
          </label>
          <CustomInput
            id="name"
            name="name"
            placeholder="Ej: Fundación Las Rosas"
            value={formData.name}
            onChange={handleChange}
            hint="Nombre completo de la institución"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </label>
          <CustomInput
            id="email"
            name="email"
            type="email"
            placeholder="correo@ejemplo.com"
            value={formData.email}
            onChange={handleChange}
            leadingIcon={<Mail className="h-4 w-4" />}
            error={formData.email && !formData.email.includes("@") ? "Email inválido" : undefined}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Descripción
          </label>
          <CustomTextarea
            id="description"
            name="description"
            placeholder="Describe la institución..."
            value={formData.description}
            onChange={handleChange}
            maxLength={200}
            showCharacterCount
          />
        </div>
      </div>
    </div>
  )
}
