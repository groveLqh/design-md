"use client";

import { useState } from "react";

interface DesignFileActionsProps {
  content: string;
  filename: string;
  copyLabel?: string;
  downloadLabel?: string;
  size?: "sm" | "md";
}

async function copyText(content: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(content);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = content;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function downloadText(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function DesignFileActions({
  content,
  filename,
  copyLabel = "Copy",
  downloadLabel = "Download",
  size = "sm",
}: DesignFileActionsProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle");

  const buttonClass =
    size === "md"
      ? "rounded-md border border-[var(--card-border)] px-3 py-2 text-xs font-bold"
      : "rounded-md border border-[var(--card-border)] px-3 py-2 text-xs font-bold md:px-2 md:py-1";

  const handleCopy = async () => {
    try {
      await copyText(content);
      setCopyState("copied");
      window.setTimeout(() => setCopyState("idle"), 1600);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 1600);
    }
  };

  return (
    <div className="flex gap-2">
      <button type="button" className={buttonClass} onClick={handleCopy}>
        {copyState === "copied" ? "Copied" : copyState === "error" ? "Copy failed" : copyLabel}
      </button>
      <button type="button" className={buttonClass} onClick={() => downloadText(content, filename)}>
        {downloadLabel}
      </button>
    </div>
  );
}
