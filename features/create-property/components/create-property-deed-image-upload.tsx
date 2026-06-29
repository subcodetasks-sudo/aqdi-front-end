"use client";

import {
  Check,
  CloudDownload,
  Eye,
  ImageIcon,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { RiImageCircleFill } from "react-icons/ri";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import CreatePropertyFieldLabel from "@/features/create-property/components/create-property-field-label";
import type { CreatePropertyLabels } from "@/features/create-property/types/create-property-labels";
import { cn } from "@/lib/utils";

type CreatePropertyDeedImageUploadProps = {
  labels: CreatePropertyLabels["deed"]["deedImage"];
  value: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
  existingFileUrl?: string | null;
};

const ACCEPTED_FILE_TYPES = "image/png,image/jpeg,application/pdf";

function getFileParts(file: File) {
  const extension = file.name.includes(".")
    ? (file.name.split(".").pop()?.toLowerCase() ?? "")
    : "";

  const name = extension
    ? file.name.slice(0, -(extension.length + 1))
    : file.name;

  return { name, extension };
}

function isPdfFile(file: File) {
  return (
    file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
  );
}

function isImageFile(file: File) {
  return file.type.startsWith("image/");
}

function isAcceptedDeedFile(file: File) {
  return isImageFile(file) || isPdfFile(file);
}

type ExistingFileRowProps = {
  fileUrl: string;
  labels: CreatePropertyLabels["deed"]["deedImage"];
};

function ExistingFileRow({ fileUrl, labels }: ExistingFileRowProps) {
  const fileName = fileUrl.split("/").pop() ?? labels.preview;

  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-[#e8e8e8] bg-brand-background px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand">
          <RiImageCircleFill className="size-5 text-white" aria-hidden="true" />
        </span>

        <div className="min-w-0 text-end">
          <p className="truncate text-sm font-bold text-[#333333]">{fileName}</p>
          <p className="text-xs text-[#bdbdbd]">{labels.preview}</p>
        </div>

        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-white">
          <Check className="size-3" aria-hidden="true" />
        </span>
      </div>

      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[#666666] shadow-sm"
        aria-label={labels.preview}
      >
        <Eye className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}

type DeedFileRowProps = {
  file: File;
  labels: CreatePropertyLabels["deed"]["deedImage"];
  onDelete: () => void;
  onPreview: () => void;
};

function DeedFileRow({ file, labels, onDelete, onPreview }: DeedFileRowProps) {
  const { name, extension } = getFileParts(file);
  const previewUrl = useMemo(
    () => (isImageFile(file) ? URL.createObjectURL(file) : null),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="flex items-center justify-between gap-3 rounded-full border border-[#e8e8e8] bg-brand-background px-3 py-2">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <span className="inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand">
          <RiImageCircleFill className="size-5 text-white" aria-hidden="true" />
        </span>

        <div className="min-w-0 text-end">
          <p className="truncate text-sm font-bold text-[#333333]">{name}</p>
          <p className="text-xs text-[#bdbdbd]">{extension}</p>
        </div>

        <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-secondary text-white">
          <Check className="size-3" aria-hidden="true" />
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onPreview}
          className="inline-flex size-9 items-center justify-center rounded-full bg-white text-[#666666] shadow-sm"
          aria-label={labels.preview}
        >
          <Eye className="size-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex size-9 items-center justify-center rounded-full bg-[#ffe8e8] text-red-500"
          aria-label={labels.delete}
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default function CreatePropertyDeedImageUpload({
  labels,
  value,
  onChange,
  multiple = false,
  existingFileUrl = null,
}: CreatePropertyDeedImageUploadProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const canUploadMore = multiple || value.length === 0;
  const showExistingFile = Boolean(existingFileUrl) && value.length === 0;

  const previewUrl = useMemo(() => {
    if (!previewFile) {
      return null;
    }

    return URL.createObjectURL(previewFile);
  }, [previewFile]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []).filter(
      isAcceptedDeedFile,
    );

    if (selectedFiles.length === 0) {
      event.target.value = "";
      return;
    }

    if (multiple) {
      onChange([...value, ...selectedFiles]);
    } else {
      onChange([selectedFiles[0]]);
    }

    event.target.value = "";
  }

  function handleDelete(index: number) {
    onChange(value.filter((_, fileIndex) => fileIndex !== index));
  }

  return (
    <div className="space-y-3">
      <CreatePropertyFieldLabel label={labels.label} />

      {canUploadMore ? (
        <label
          htmlFor={inputId}
          className={cn(
            "flex h-14 w-full cursor-pointer items-center gap-3 rounded-full border border-[#e8e8e8] bg-brand-background px-2 ps-4",
          )}
        >
          <input
            ref={inputRef}
            id={inputId}
            type="file"
            multiple={multiple}
            accept={ACCEPTED_FILE_TYPES}
            className="sr-only"
            onChange={handleFileChange}
          />

          <div className="min-w-0 flex-1 text-start">
            <p className="text-sm leading-snug font-semibold">
              <span className="text-brand-secondary">{labels.clickHere}</span>{" "}
              <span className="text-gray-600">{labels.chooseFile}</span>
            </p>
            <p className="text-xs text-[#bdbdbd]">{labels.acceptedFormats}</p>
          </div>

          <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
            <CloudDownload className="size-5 text-[#bdbdbd]" aria-hidden="true" />
          </span>
        </label>
      ) : null}

      {value.length > 0 ? (
        <div className="space-y-2">
          {value.map((file, index) => (
            <DeedFileRow
              key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
              file={file}
              labels={labels}
              onDelete={() => handleDelete(index)}
              onPreview={() => setPreviewFile(file)}
            />
          ))}
        </div>
      ) : showExistingFile && existingFileUrl ? (
        <ExistingFileRow fileUrl={existingFileUrl} labels={labels} />
      ) : null}

      <Dialog
        open={previewFile !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewFile(null);
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="min-w-3xl gap-0 overflow-hidden rounded-3xl p-0 no-scrollbar"
        >
          <div className="flex items-center justify-between border-b border-[#ececec] px-4 py-3">
            <DialogTitle className="text-base font-bold">
              {labels.previewTitle}
            </DialogTitle>

            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                aria-label={labels.closePreview}
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </DialogClose>
          </div>

          <div className="max-h-[85vh] overflow-auto bg-[#f7f7f7] p-4 no-scrollbar">
            {previewFile && previewUrl ? (
              isPdfFile(previewFile) ? (
                <iframe
                  src={previewUrl}
                  title={previewFile.name}
                  className="h-[65vh] w-full rounded-2xl bg-white"
                />
              ) : isImageFile(previewFile) ? (
                <div className="relative mx-auto aspect-4/3 w-full max-w-2xl overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={previewUrl}
                    alt={previewFile.name}
                    fill
                    unoptimized
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 py-12 text-center">
                  <ImageIcon className="size-10 text-[#bdbdbd]" />
                  <p className="text-sm text-[#666666]">{previewFile.name}</p>
                </div>
              )
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
