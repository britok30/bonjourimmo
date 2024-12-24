"use client";

import { useDropzone } from "react-dropzone";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { newListingSchema } from "@/lib/listing-form-schema";

type FormSchema = z.infer<typeof newListingSchema>;

const ImagesStep = ({
  form,
  maxFiles,
}: {
  form: UseFormReturn<FormSchema>;
  maxFiles: number;
}) => {
  const t = useTranslations("newListing.images");

  const {
    control,
    setValue,
    formState: { isSubmitting },
  } = form;

  const onDrop = (acceptedFiles: File[]) => {
    const currentFiles = form.getValues("images") || [];
    const newFiles = [...currentFiles, ...acceptedFiles].slice(0, maxFiles);
    setValue("images", newFiles, { shouldValidate: true });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
    },
    maxSize: 25 * 1024 * 1024, // 25MB
    onDrop,
    multiple: true,
  });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">{t("title")}</h2>
      <Separator />

      <FormField
        control={control}
        name="images"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("uploadLabel")}</FormLabel>
            <FormControl>
              <div className="space-y-4">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors",
                    isDragActive && "border-primary bg-primary/10"
                  )}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      {t("dropzone.default", { maxFiles })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t("dropzone.hint")}
                    </p>
                  </div>
                </div>

                {/* Image Preview Grid */}
                {field.value?.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {field.value.map((file, index) => (
                        <div
                          key={index}
                          className="group relative aspect-square rounded-lg overflow-hidden bg-muted"
                        >
                          {/* Image Preview */}
                          <Image
                            src={
                              file instanceof File
                                ? URL.createObjectURL(file)
                                : file.url
                            }
                            alt={`Preview ${index + 1}`}
                            className="object-cover transition-transform group-hover:scale-105"
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                          {/* Image Number Badge */}
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
                            {t("preview.badge", {
                              current: index + 1,
                              total: field.value.length,
                            })}
                          </div>

                          {/* Delete Button */}
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newFiles = field.value.filter(
                                (_, i) => i !== index
                              );
                              setValue("images", newFiles, {
                                shouldValidate: true,
                              });
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          {/* File Name Preview */}
                          {file instanceof File && (
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/70">
                              <p className="text-white text-xs truncate">
                                {t("preview.fileName", { fileName: file.name })}
                              </p>
                            </div>
                          )}

                          {/* Optional: Add a subtle loading state for files being uploaded */}
                          {file instanceof File && isSubmitting && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ImagesStep;
