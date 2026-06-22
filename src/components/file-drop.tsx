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
  file, files = [], onFile, onFiles, disabled, multiple, accept, label, helperText, onError,
}: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const selectedCount = files.length || (file ? 1 : 0);
  const defaultHelperText = file
    ? `${formatBytes(file.size)}`
    : `The file stays in your browser. Max: ${formatBytes(maxFileSizeBytes)}.`;

  function handleFiles(selectedFiles: File[]) {
    if (!selectedFiles.length || disabled) return;
    const totalSize = selectedFiles.reduce((sum, f) => sum + f.size, 0);
    const oversized = selectedFiles.find((f) => f.size > maxFileSizeBytes);
    if (oversized) {
      onError?.(`${oversized.name} is too large (max ${formatBytes(maxFileSizeBytes)}).`);
      return;
    }
    if (selectedFiles.length > 1 && totalSize > maxBundleSizeBytes) {
      onError?.(`Bundle too large (max ${formatBytes(maxBundleSizeBytes)}).`);
      return;
    }
    if (multiple && selectedFiles.length) { onFiles?.(selectedFiles); onFile(selectedFiles[0]); }
    else { onFile(selectedFiles[0]); }
  }

  const dl = label || (selectedCount > 1 ? `${selectedCount} files` : file ? file.name : "Choose a file");
  const dh = helperText || (selectedCount > 1 ? "Files are hashed locally." : defaultHelperText);

  return (
    <div
      className={`rounded-2xl p-8 transition-all cursor-pointer ${
        isDragging
          ? "bg-accent/10 ring-2 ring-accent"
          : "bg-bg-surface-muted hover:bg-[#222]"
      } ${disabled ? "opacity-60" : ""}`}
      onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(Array.from(e.dataTransfer.files || [])); }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        accept={accept}
        aria-label={dl}
        className="sr-only"
        disabled={disabled}
        multiple={multiple}
        type="file"
        onChange={(e) => handleFiles(Array.from(e.target.files || []))}
      />
      <div className="flex flex-col items-center gap-4 text-center">
        <span className="grid size-16 place-items-center rounded-full bg-accent/10 text-accent">
          <FileUp className="size-7" />
        </span>
        <span className="text-base font-bold">{dl}</span>
        <span className="max-w-sm text-sm leading-6 text-text-muted">{dh}</span>
      </div>
    </div>
  );
}
