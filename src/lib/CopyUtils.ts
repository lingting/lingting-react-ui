import type { CopyOptions, CopyResult } from "@lri/types";

function copyWithExecCommand(text: string): CopyResult {
  if (typeof document === "undefined" || !document.body) {
    return { success: false };
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);

  try {
    textarea.select();
    return document.execCommand("copy")
      ? { success: true, method: "execCommand" }
      : { success: false };
  } catch (error) {
    return { success: false, error };
  } finally {
    textarea.remove();
  }
}

export async function copyText(text: string): Promise<CopyResult> {
  if (
    typeof window !== "undefined" &&
    typeof navigator !== "undefined" &&
    window.isSecureContext &&
    navigator.clipboard
  ) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true, method: "clipboard" };
    } catch {
      // Clipboard API 不可用或写入失败时，继续使用兼容性降级方案。
    }
  }

  return copyWithExecCommand(text);
}

export async function copy(text: string, options?: CopyOptions): Promise<CopyResult> {
  const result = await copyText(text);

  options?.onCopy?.(result);
  if (result.success) {
    options?.onSuccess?.();
  } else {
    if (options?.debug) {
      console.warn("复制失败", result.error);
    }
    options?.onFailed?.();
  }

  return result;
}
