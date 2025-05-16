// Tipos para las tablas de Supabase
export type Fundacion = {
  id: number
  codigo: string
  nombre: string
  descripcion: string | null
}

export type Entrevistado = {
  id: number
  codigo: string
  nombre: string
  apellido: string
  cargo: string | null
  fundacion_id: number
  contacto: string | null
  notas: string | null
  fundacion?: Fundacion
}

export type Investigador = {
  id: number
  codigo: string
  nombre: string
  apellido: string
  email: string | null
  telefono: string | null
  institucion: string | null
  cargo: string | null
  notas: string | null
  fecha_creacion: string
}

export type Entrevista = {
  id: number
  codigo_entrevista: string
  fundacion_id: number
  entrevistado_id: number
  investigador_id: number | null
  numero_entrevista: number
  fecha_entrevista: string | null
  duracion: number | null
  notas: string | null
  fecha_creacion: string
  fundacion?: Fundacion
  entrevistado?: Entrevistado
  investigador?: Investigador
}

export type Transcripcion = {
  id: number
  entrevista_id: number
  id_segmento: number
  hablante: string
  timestamp: string | null
  rol: string
  texto_original: string
  texto_normalizado: string
  nivel_confianza: number
  fecha_creacion: string
  entrevista?: Entrevista
}

export type MatrizCategoria = {
  id: number
  nombre: string
  descripcion: string | null
  orden: number
}

export type MatrizSubcategoria = {
  id: number
  categoria_id: number
  nombre: string
  descripcion: string | null
  orden: number
  categoria?: MatrizCategoria
}

export type MatrizCodigo = {
  id: number
  codigo: string
  categoria_id: number
  subcategoria_id: number
  descripcion: string | null
  categoria?: MatrizCategoria
  subcategoria?: MatrizSubcategoria
}

export type TranscripcionMatriz = {
  id: number
  transcripcion_id: number
  codigo_matriz_id: number
  relevancia: number
  notas: string | null
  transcripcion?: Transcripcion
  codigo_matriz?: MatrizCodigo
}

export type MatrizVaciado = {
  id: number
  entrevistado_id: number
  codigo_matriz_id: number
  contenido: string | null
  fecha_actualizacion: string
  entrevistado?: Entrevistado
  codigo_matriz?: MatrizCodigo
}
