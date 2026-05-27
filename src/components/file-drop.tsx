"use client";

import { FileUp } from "lucide-react";
import { useRef, useState } from "react";
import { formatBytes } from "@/lib/hash";

type FileDropProps = {
  file?: File | null;
  onFile: (file: File) => void;
  disabled?: boolean;
};

export function FileDrop({ file, onFile, disabled }: FileDropProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`rounded-lg border border-dashed p-6 transition ${
        isDragging
          ? "border-accent bg-accent-soft"
          : "border-border bg-surface"
      } ${disabled ? "opacity-60" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        const dropped = event.dataTransfer.files.item(0);
        if (dropped && !disabled) onFile(dropped);
      }}
    >
      <input
        ref={inputRef}
        className="sr-only"
        disabled={disabled}
        type="file"
        onChange={(event) => {
          const selected = event.target.files?.item(0);
          if (selected) onFile(selected);
        }}
      />
      <button
        className="flex w-full flex-col items-center gap-3 text-center"
        disabled={disabled}
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <span className="grid size-12 place-items-center rounded-md bg-surface-muted">
          <FileUp className="size-5 text-accent" />
        </span>
        <span className="text-sm font-medium">
          {file ? file.name : "Drop a file here or choose one"}
        </span>
        <span className="text-xs text-muted">
          {file
            ? `${formatBytes(file.size)} · ${file.type || "unknown type"}`
            : "The file stays in your browser. OpenProof never uploads it."}
        </span>
      </button>
    </div>
  );
}
