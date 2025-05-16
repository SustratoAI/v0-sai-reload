"use client";

import type React from "react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea"; // Changed from Input
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Text } from "@/components/ui/text";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import { FontThemeSwitcher } from "@/components/ui/font-theme-switcher";
import { Divider } from "@/components/ui/divider";
import type {
  TextareaVariant,
  TextareaSize,
} from "@/lib/theme/components/textarea-tokens"; // Added Textarea types

export default function ShowroomTextarea() {
  // Changed function name
  const [values, setValues] = useState({
    default: "This is some default text in the textarea.",
    withError: "This text might have an error.",
    withSuccess: "This text looks good!",
    withHint: "Enter your bio here...",
    withCounter: "Count my characters!",
    disabled: "This textarea is disabled.",
    longText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  });

  const handleChange =
    (key: keyof typeof values) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [key]: e.target.value }));
    };

  // Textarea variants and sizes from textarea-tokens.ts
  const variants: TextareaVariant[] = [
    "default",
    "primary",
    "secondary",
    "tertiary",
    "neutral",
    "white",
    "success",
    "warning",
    "danger",
    "info",
  ];
  const sizes: TextareaSize[] = ["sm", "md", "lg"];

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <Text variant="heading">Textarea Showroom</Text> {/* Changed title */}
        <div className="flex gap-4">
          <ThemeSwitcher />
          <FontThemeSwitcher />
        </div>
      </div>

      <Tabs defaultValue="variants">
        <TabsList className="mb-4">
          <TabsTrigger value="variants">Variants</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
        </TabsList>

        <TabsContent value="variants">
          <Card>
            <CardHeader>
              <CardTitle>Textarea Variants</CardTitle>
              <CardDescription>
                Different visual styles for the Textarea component
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {variants.map((variant) => (
                <div key={variant} className="space-y-2">
                  <Text variant="label" className="capitalize">
                    {variant}
                  </Text>
                  <Textarea
                    variant={variant}
                    placeholder={`${variant} textarea`}
                    value={values.default}
                    onChange={handleChange("default")}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sizes">
          <Card>
            <CardHeader>
              <CardTitle>Textarea Sizes</CardTitle>
              <CardDescription>
                Different size options for the Textarea component
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              {sizes.map((size) => (
                <div key={size} className="space-y-2">
                  <Text variant="label" className="capitalize">
                    {size}
                  </Text>
                  <Textarea
                    size={size}
                    placeholder={`${size} textarea`}
                    value={values.default}
                    onChange={handleChange("default")}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="states">
          <Card>
            <CardHeader>
              <CardTitle>Textarea States</CardTitle>
              <CardDescription>
                Different states of the Textarea component
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Text variant="label">Default</Text>
                <Textarea
                  placeholder="Default textarea"
                  value={values.default}
                  onChange={handleChange("default")}
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Error</Text>
                <Textarea
                  placeholder="Textarea with error"
                  value={values.withError}
                  onChange={handleChange("withError")}
                  error="This field has an error and the message is a bit long to test wrapping."
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Success</Text>
                <Textarea
                  placeholder="Textarea with success"
                  value={values.withSuccess}
                  onChange={handleChange("withSuccess")}
                  isSuccess // Use isSuccess prop
                  // Textarea doesn't have a successMessage prop, hint can be used or error styling implies success through icon/border
                  hint="This field is valid and looks great!"
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">With Hint</Text>
                <Textarea
                  placeholder="Textarea with hint"
                  value={values.withHint}
                  onChange={handleChange("withHint")}
                  hint="This is a helpful hint for the textarea."
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Disabled</Text>
                <Textarea
                  placeholder="Disabled textarea"
                  value={values.disabled}
                  onChange={handleChange("disabled")}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Is Editing</Text>
                <Textarea
                  placeholder="Textarea in editing mode"
                  value={values.default}
                  onChange={handleChange("default")}
                  isEditing
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="examples">
          <Card>
            <CardHeader>
              <CardTitle>Textarea Examples</CardTitle>
              <CardDescription>
                Common use cases for the Textarea component
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Text variant="label">With Character Count</Text>
                <Textarea
                  placeholder="Limited to 150 characters for a short bio."
                  value={values.withCounter}
                  onChange={handleChange("withCounter")}
                  maxLength={150}
                  showCharacterCount
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Long Content</Text>
                <Textarea
                  placeholder="Enter a long description or comment..."
                  value={values.longText}
                  onChange={handleChange("longText")}
                  rows={6} // Suggest a larger initial size
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Primary Variant Example</Text>
                <Textarea
                  variant="primary"
                  placeholder="Primary variant textarea"
                  value={values.default}
                  onChange={handleChange("default")}
                  hint="This textarea uses the primary variant."
                />
              </div>

              <div className="space-y-2">
                <Text variant="label">Error State with Max Length</Text>
                <Textarea
                  placeholder="Try to exceed 50 chars"
                  value={values.withError}
                  onChange={handleChange("withError")}
                  maxLength={50}
                  showCharacterCount
                  error={
                    values.withError.length > 50
                      ? "Character limit exceeded!"
                      : "This field has a warning if too long."
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
