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
        className="flex w-full flex-col items-center gap-4 text-center"
        disabled={disabled}
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <span className="grid size-16 place-items-center rounded-3xl bg-base-blue text-white shadow-[0_18px_45px_rgba(0,82,255,0.25)]">
          <FileUp className="size-7" />
        </span>
        <span className="text-base font-semibold">
          {file ? file.name : "Drop a file here or choose one"}
        </span>
        <span className="max-w-sm text-sm leading-6 text-muted">
          {file
            ? `${formatBytes(file.size)} - ${file.type || "unknown type"}`
            : "The file stays in your browser. OpenProof never uploads it."}
        </span>
      </button>
    </div>
  );
}
