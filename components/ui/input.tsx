"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, X, CheckCircle, Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/app/theme-provider";
import type {
  InputVariant,
  InputSize,
  InputTokens,
} from "@/lib/theme/components/input-tokens";
import { generateInputTokens } from "@/lib/theme/components/input-tokens";
import { Icon } from "@/components/ui/icon";
import tinycolor from "tinycolor2";

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  leadingIcon?: LucideIcon;
  trailingIcon?: LucideIcon;
  error?: string;
  success?: boolean;
  successMessage?: string;
  hint?: string;
  isEditing?: boolean;
  showCharacterCount?: boolean;
  onClear?: () => void;
  variant?: InputVariant;
  size?: InputSize;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      leadingIcon,
      trailingIcon,
      error,
      success,
      successMessage,
      hint,
      isEditing,
      showCharacterCount,
      onClear,
      variant = "default",
      size = "md",
      disabled,
      ...props
    },
    ref
  ) => {
    const { appColorTokens, mode } = useTheme();

    const inputTokens: InputTokens | null = React.useMemo(() => {
      if (!appColorTokens || !mode) return null;
      return generateInputTokens(appColorTokens, mode);
    }, [appColorTokens, mode]);

    if (!inputTokens) {
      return (
        <div className="w-full">
          <input
            type={type}
            className={cn(
              "peer flex w-full rounded-md transition-all h-10 px-3 py-2 text-sm",
              "border border-gray-300 bg-gray-100",
              disabled && "cursor-not-allowed opacity-50",
              className
            )}
            ref={ref}
            disabled={disabled}
            {...props}
            placeholder="Loading..."
          />
        </div>
      );
    }

    const variantTokens = inputTokens.variants[variant];
    const sizeTokens = inputTokens.sizes[size];

    const [charCount, setCharCount] = React.useState(
      props.value ? String(props.value).length : 0
    );

    const [showPassword, setShowPassword] = React.useState(false);

    const inputType = type === "password" && showPassword ? "text" : type;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setCharCount(e.target.value.length);
      props.onChange?.(e);
    };

    React.useEffect(() => {
      if (props.value !== undefined) {
        setCharCount(String(props.value).length);
      }
    }, [props.value]);

    const getCounterColor = () => {
      if (!props.maxLength)
        return appColorTokens?.neutral.text || "text-neutral-500";
      if (charCount === props.maxLength)
        return appColorTokens?.success.text || "text-green-500";
      if (charCount > props.maxLength)
        return appColorTokens?.danger.text || "text-red-500";
      if (charCount >= props.maxLength * 0.8)
        return appColorTokens?.warning?.text || "text-amber-500";
      return appColorTokens?.neutral.text || "text-neutral-500";
    };

    const mapInputSizeToIconSize = (inputSize: InputSize) => {
      switch (inputSize) {
        case "sm":
          return "xs";
        case "lg":
          return "md";
        default:
          return "sm";
      }
    };

    const iconSize = mapInputSizeToIconSize(size);
    const hasLeadingIcon = !!leadingIcon;
    const hasTrailingIcon =
      !!trailingIcon ||
      (props.value && onClear) ||
      !!error ||
      success ||
      type === "password";

    const getLeadingPadding = () => {
      if (!hasLeadingIcon) return "";
      switch (size) {
        case "sm":
          return "pl-7";
        case "lg":
          return "pl-12";
        default:
          return "pl-10";
      }
    };

    const getTrailingPadding = () => {
      if (!hasTrailingIcon) return "";
      switch (size) {
        case "sm":
          return "pr-7";
        case "lg":
          return "pr-12";
        default:
          return "pr-10";
      }
    };

    const getBackgroundColor = () => {
      if (disabled) return variantTokens.disabledBackground;
      if (error) return variantTokens.errorBackground;
      if (success) return variantTokens.successBackground;
      if (isEditing) return variantTokens.editingBackground;
      return variantTokens.background;
    };

    const getBorderColor = () => {
      if (disabled) return variantTokens.disabledBorder;
      if (error) return variantTokens.errorBorder;
      if (success) return variantTokens.successBorder;
      return variantTokens.border;
    };

    const getTextColor = () => {
      if (disabled) return variantTokens.disabledText;
      return variantTokens.text;
    };

    const getIconLeftPosition = () => {
      switch (size) {
        case "sm":
          return "left-2.5";
        case "lg":
          return "left-4";
        default:
          return "left-3";
      }
    };

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

    React.useEffect(() => {
      // console.log("Input border color:", getBorderColor());
      // console.log("Input focus border:", variantTokens.focusBorder);
      // console.log("Input semantic primary:", semantic.primary.border);
    }, [variantTokens]);

    return (
      <div className="w-full">
        <div className="relative w-full">
          <input
            type={inputType}
            className={cn(
              "peer flex w-full rounded-md transition-all",
              sizeTokens.height,
              sizeTokens.fontSize,
              !hasLeadingIcon ? sizeTokens.paddingX : "pr-3",
              sizeTokens.paddingY,
              getLeadingPadding(),
              getTrailingPadding(),
              "border",
              disabled && "disabled:cursor-not-allowed",
              className
            )}
            style={{
              backgroundColor: getBackgroundColor(),
              borderColor: getBorderColor(),
              color: getTextColor(),
              outline: "none",
              boxShadow: "none",
            }}
            onFocus={(e) => {
              const target = e.target as HTMLInputElement;
              if (error) {
                target.style.borderColor = variantTokens.errorBorder;
                target.style.boxShadow = `0 0 0 4px ${variantTokens.errorRing}`;
              } else if (success) {
                target.style.borderColor = variantTokens.successBorder;
                target.style.boxShadow = `0 0 0 4px ${variantTokens.successRing}`;
              } else {
                target.style.borderColor = variantTokens.focusBorder;
                target.style.boxShadow = `0 0 0 4px ${variantTokens.focusRing}`;
              }
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              const target = e.target as HTMLInputElement;
              target.style.borderColor = getBorderColor();
              target.style.boxShadow = "none";
              props.onBlur?.(e);
            }}
            ref={ref}
            onChange={handleChange}
            disabled={disabled}
            autoComplete={props.autoComplete === "on" ? "on" : "new-password"}
            {...props}
          />

          {leadingIcon && (
            <div
              className={`absolute ${getIconLeftPosition()} top-0 h-full flex items-center`}
              style={{
                color: disabled
                  ? variantTokens.disabledText
                  : variantTokens.iconColor,
              }}
            >
              {React.createElement(leadingIcon, {
                size: iconSize === "xs" ? 14 : iconSize === "sm" ? 16 : 20,
              })}
            </div>
          )}

          <div className="absolute right-3 top-0 h-full flex items-center gap-2">
            {type === "password" && (
              <button
                type="button"
                className="outline-none focus:outline-none"
                onClick={togglePasswordVisibility}
                tabIndex={-1}
                style={{
                  color: disabled
                    ? variantTokens.disabledText
                    : variantTokens.iconColor,
                }}
              >
                {React.createElement(showPassword ? EyeOff : Eye, {
                  size: iconSize === "xs" ? 14 : iconSize === "sm" ? 16 : 20,
                })}
              </button>
            )}

            {props.value && onClear && (
              <button
                type="button"
                className="outline-none focus:outline-none"
                onClick={onClear}
                tabIndex={-1}
                style={{
                  color: disabled
                    ? variantTokens.disabledText
                    : error && appColorTokens?.danger.text
                    ? appColorTokens.danger.text
                    : variantTokens.iconColor,
                }}
              >
                {React.createElement(X, {
                  size: iconSize === "xs" ? 14 : iconSize === "sm" ? 16 : 20,
                })}
              </button>
            )}

            {(error || success) && (
              <div
                style={{
                  color: error
                    ? appColorTokens?.danger.text
                    : appColorTokens?.success.text,
                }}
              >
                {React.createElement(error ? AlertCircle : CheckCircle, {
                  size: iconSize === "xs" ? 14 : iconSize === "sm" ? 16 : 20,
                })}
              </div>
            )}

            {trailingIcon && !error && !success && (
              <div
                style={{
                  color: disabled
                    ? variantTokens.disabledText
                    : variantTokens.iconColor,
                }}
              >
                {React.createElement(trailingIcon, {
                  size: iconSize === "xs" ? 14 : iconSize === "sm" ? 16 : 20,
                })}
              </div>
            )}
          </div>
        </div>

        {showCharacterCount && props.maxLength && (
          <div className="flex justify-end mt-1">
            <span className={`text-xs ${getCounterColor()}`}>
              {charCount}/{props.maxLength}
            </span>
          </div>
        )}

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5"
            >
              <div
                className="flex items-center text-sm"
                style={{ color: appColorTokens?.danger.text }}
              >
                <span>{error}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {success && successMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mt-1.5"
            >
              <div
                className="flex items-center text-sm"
                style={{ color: appColorTokens?.success.text }}
              >
                <span>{successMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {hint && !error && !success && (
          <div
            className="mt-1.5 text-sm"
            style={{
              color: appColorTokens?.neutral.text
                ? tinycolor(appColorTokens.neutral.text)
                    .setAlpha(0.7)
                    .toRgbString()
                : "#71717a",
            }}
          >
            {hint}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export { Input };
