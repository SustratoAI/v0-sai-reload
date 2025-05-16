"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme-provider";
import type {
  TextareaSize,
  TextareaVariant,
  TextareaTokens,
} from "@/lib/theme/components/textarea-tokens";
import { generateTextareaTokens } from "@/lib/theme/components/textarea-tokens";
import { Icon } from "./icon";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  hint?: string;
  isEditing?: boolean;
  showCharacterCount?: boolean;
  size?: TextareaSize;
  variant?: TextareaVariant;
  isSuccess?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      hint,
      isEditing,
      showCharacterCount,
      size = "md",
      variant = "default",
      isSuccess,
      ...props
    },
    ref
  ) => {
    const [charCount, setCharCount] = React.useState(
      props.value ? String(props.value).length : 0
    );
    const { appColorTokens, mode } = useTheme();

    const textareaTokens: TextareaTokens | null = React.useMemo(() => {
      if (!appColorTokens || !mode) return null;
      return generateTextareaTokens(appColorTokens, mode);
    }, [appColorTokens, mode]);

    if (!textareaTokens) {
      return (
        <div className="w-full">
          <textarea
            className={cn(
              "flex w-full min-h-[80px] rounded-md px-3 py-2 transition-all",
              "border border-gray-300 bg-gray-100 text-sm",
              "placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            disabled={props.disabled}
            placeholder="Loading..."
            {...props}
          />
        </div>
      );
    }

    const variantTokens = textareaTokens.variants[variant];
    const sizeTokens = textareaTokens.sizes[size];

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    React.useEffect(() => {
      if (props.value !== undefined) {
        setCharCount(String(props.value).length);
      }
    }, [props.value]);

    const getCounterColor = () => {
      if (!props.maxLength) return variantTokens.placeholder;
      if (charCount === props.maxLength) return variantTokens.successText;
      if (charCount > props.maxLength) return variantTokens.errorText;
      if (charCount >= props.maxLength * 0.8)
        return variantTokens.warningText || variantTokens.placeholder;
      return variantTokens.placeholder;
    };

    const mapTextareaSizeToIconSize = (textareaSize: TextareaSize) => {
      switch (textareaSize) {
        case "sm":
          return "xs";
        case "lg":
          return "md";
        default:
          return "sm";
      }
    };
    const iconSize = mapTextareaSizeToIconSize(size);

    const currentBorderColor = error
      ? variantTokens.errorBorder
      : isSuccess
      ? variantTokens.successBorder
      : variantTokens.border;

    const currentFocusBorderColor = error
      ? variantTokens.errorBorder
      : isSuccess
      ? variantTokens.successBorder
      : variantTokens.focusBorder;

    const currentFocusRingColor = error
      ? variantTokens.errorRing
      : isSuccess
      ? variantTokens.successRing
      : variantTokens.focusRing;

    const currentBackgroundColor = props.disabled
      ? variantTokens.disabledBackground
      : error
      ? variantTokens.errorBackground
      : isSuccess
      ? variantTokens.successBackground
      : isEditing
      ? variantTokens.editingBackground
      : variantTokens.background;

    return (
      <div className="w-full">
        <div className="relative w-full">
          <textarea
            className={cn(
              "peer flex w-full rounded-md transition-all",
              sizeTokens.minHeight,
              sizeTokens.paddingX,
              sizeTokens.paddingY,
              sizeTokens.fontSize,
              "border",
              "placeholder:text-muted-foreground",
              props.disabled &&
                "disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            onChange={handleChange}
            style={{
              backgroundColor: currentBackgroundColor,
              color: props.disabled
                ? variantTokens.disabledText
                : variantTokens.text,
              borderColor: currentBorderColor,
              outline: "none",
              boxShadow: "none",
            }}
            onFocus={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.borderColor = currentFocusBorderColor;
              target.style.boxShadow = `0 0 0 4px ${currentFocusRingColor}`;
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.borderColor = currentBorderColor;
              target.style.boxShadow = "none";
              props.onBlur?.(e);
            }}
            placeholder={props.placeholder}
            {...props}
          />

          <AnimatePresence>
            {error && (
              <motion.div
                key="textarea-error-icon"
                className="absolute right-3 top-3"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ color: variantTokens.errorText }}>
                  {React.createElement(AlertCircle, {
                    size: iconSize === "xs" ? 12 : iconSize === "sm" ? 14 : 16,
                  })}
                </div>
              </motion.div>
            )}
            {isSuccess && !error && (
              <motion.div
                key="textarea-success-icon"
                className="absolute right-3 top-3"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div style={{ color: variantTokens.successText }}>
                  {React.createElement(CheckCircle, {
                    size: iconSize === "xs" ? 12 : iconSize === "sm" ? 14 : 16,
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-1.5 flex justify-between text-xs">
          <div
            className={cn("text-xs")}
            style={{
              color: error
                ? variantTokens.errorText
                : isSuccess
                ? variantTokens.successText
                : variantTokens.placeholder,
            }}
          >
            {error ? error : hint}
          </div>

          {showCharacterCount && props.maxLength && (
            <div
              className={cn("ml-auto text-xs", getCounterColor())}
              style={{ color: getCounterColor() }}
            >
              {charCount}/{props.maxLength}
            </div>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export { Textarea };
