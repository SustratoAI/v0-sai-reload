"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { AnimatePresence, motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  hint?: string
  showCharacterCount?: boolean
}

const CustomTextarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(
  ({ className, error, hint, showCharacterCount, ...props }, ref) => {
    // Estados
    const [isFocused, setIsFocused] = React.useState(false)
    const [charCount, setCharCount] = React.useState(props.value ? String(props.value).length : 0)

    // Referencia interna
    const textareaRef = React.useRef<HTMLTextAreaElement>(null)

    // Combinar refs
    const handleRef = (el: HTMLTextAreaElement | null) => {
      textareaRef.current = el || null
      if (typeof ref === "function") ref(el)
      else if (ref) ref.current = el
    }

    // Handlers
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true)
      props.onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false)
      props.onBlur?.(e)
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length)
      props.onChange?.(e)
    }

    // Efecto para sincronizar con valor externo
    React.useEffect(() => {
      if (props.value !== undefined) {
        setCharCount(String(props.value).length)
      }
    }, [props.value])

    // Determinar color del contador
    const getCounterColor = () => {
      if (!props.maxLength) return "text-muted-foreground"
      if (charCount === props.maxLength) return "text-green-500"
      if (charCount > props.maxLength) return "text-red-500"
      if (charCount >= props.maxLength * 0.8) return "text-amber-500"
      return "text-muted-foreground"
    }

    return (
      <div className="w-full">
        <div className="relative">
          {/* Contenedor con borde personalizado */}
          <div
            className={cn(
              "relative rounded-md transition-all duration-200",
              error ? "ring-2 ring-red-500" : isFocused ? "ring-2 ring-blue-500" : "ring-1 ring-gray-300",
              isFocused && !error && "shadow-[0_0_0_4px_rgba(59,130,246,0.25)]",
              error && "shadow-[0_0_0_4px_rgba(239,68,68,0.25)]",
            )}
          >
            <textarea
              {...props}
              ref={handleRef}
              className={cn(
                "w-full min-h-[80px] px-3 py-2 bg-transparent border-0 outline-none text-sm resize-y",
                error && "text-red-900 placeholder:text-red-400",
                className,
              )}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
            />
          </div>

          {/* Icono de error */}
          {error && (
            <div className="absolute right-3 top-3">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          )}
        </div>

        {/* Área de mensajes y contador */}
        <div className="mt-1.5 flex justify-between text-xs">
          <AnimatePresence mode="wait">
            {(error || hint) && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={cn("text-xs", error ? "text-red-500" : "text-muted-foreground")}
              >
                {error || hint}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Contador de caracteres */}
          {showCharacterCount && props.maxLength && (
            <div className={cn("ml-auto text-xs", getCounterColor())}>
              {charCount}/{props.maxLength}
            </div>
          )}
        </div>
      </div>
    )
  },
)

CustomTextarea.displayName = "CustomTextarea"

export { CustomTextarea }
