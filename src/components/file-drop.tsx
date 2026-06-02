"use client";

import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { formatBytes, maxBundleSizeBytes, maxFileSizeBytes } from "@/lib/hash";

type FileDropProps = {
  file?: File | null;
  files?: File[];
  onFile: (file: File) => void;
  onFiles?: (files: File[]) => void;
  disabled?: boolean;
  multiple?: boolean;
  accept?: string;
  label?: string;
  helperText?: string;
  onError?: (message: string) => void;
};

export function FileDrop({
  file,
  files = [],
  onFile,
  onFiles,
  disabled,
  multiple,
  accept,
  label,
  helperText,
  onError,
}: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const selectedCount = files.length || (file ? 1 : 0);
  const defaultHelperText = file
    ? `${formatBytes(file.size)} - ${file.type || "unknown type"}`
    : `The file stays in your browser. Max file: ${formatBytes(
        maxFileSizeBytes,
      )}. Max bundle: ${formatBytes(maxBundleSizeBytes)}.`;

  function handleFiles(selectedFiles: File[]) {
    if (!selectedFiles.length || disabled) return;
    const totalSize = selectedFiles.reduce((sum, selectedFile) => sum + selectedFile.size, 0);
    const oversized = selectedFiles.find((selectedFile) => selectedFile.size > maxFileSizeBytes);

    if (oversized) {
      onError?.(
        `${oversized.name} is too large. OpenProof supports files up to ${formatBytes(
          maxFileSizeBytes,
        )}.`,
      );
      return;
    }

    if (selectedFiles.length > 1 && totalSize > maxBundleSizeBytes) {
      onError?.(
        `This bundle is too large. OpenProof supports bundles up to ${formatBytes(
          maxBundleSizeBytes,
        )}.`,
      );
      return;
    }

    if (multiple && selectedFiles.length) {
      onFiles?.(selectedFiles);
      onFile(selectedFiles[0]);
    } else {
      onFile(selectedFiles[0]);
    }
  }

  const dropZoneLabel = label ||
    (selectedCount > 1
      ? `${selectedCount} files selected`
      : file
        ? file.name
        : "Drop a file here or choose one");

  const dropZoneHelper = helperText ||
    (selectedCount > 1
      ? "The bundle is hashed locally. File contents never leave your browser."
      : defaultHelperText);

  return (
    <div
      className={`rounded-[2rem] border border-dashed p-8 transition ${
        isDragging
          ? "border-base-blue bg-base-blue/10 shadow-[0_0_0_6px_rgba(0,82,255,0.08)]"
          : "border-base-blue/25 bg-surface hover:border-base-blue/60 hover:bg-surface-muted"
      } ${disabled ? "opacity-60" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(Array.from(event.dataTransfer.files || []));
      }}
    >
      <input
        ref={inputRef}
        accept={accept}
        aria-label={dropZoneLabel}
        className="sr-only"
        disabled={disabled}
        multiple={multiple}
        type="file"
        onChange={(event) => {
          handleFiles(Array.from(event.target.files || []));
        }}
      />
      <button
        aria-describedby={file ? undefined : "file-drop-helper"}
        aria-label={dropZoneLabel}
        className="flex w-full flex-col items-center gap-4 text-center"
        disabled={disabled}
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <span className="grid size-16 place-items-center rounded-3xl bg-base-blue text-white shadow-[0_18px_45px_rgba(0,82,255,0.25)]">
          <FileUp className="size-7" />
        </span>
        <span className="text-base font-semibold">
          {dropZoneLabel}
        </span>
        <span
          id="file-drop-helper"
          className="max-w-sm text-sm leading-6 text-muted"
        >
          {dropZoneHelper}
        </span>
      </button>
    </div>
  );
}
