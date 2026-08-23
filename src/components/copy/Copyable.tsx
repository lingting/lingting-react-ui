import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { copy } from "@lri/lib";
import type { CopyableProps } from "@lri/types";

function CopyableComponent({
  value,
  timeout = 3000,
  debug,
  format,
  message,
  onCopy,
  onFailed,
  onSuccess,
  color = "var(--ant-color-primary)",
  style = { cursor: "pointer" },
  styles,
}: CopyableProps) {
  const [copied, setCopied] = useState(false);
  const isMountedRef = useRef(true);
  const requestIdRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const copyOptions = useMemo(
    () => ({ debug, format, message, onCopy, onFailed, onSuccess }),
    [debug, format, message, onCopy, onFailed, onSuccess],
  );

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      requestIdRef.current += 1;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCopy = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const result = await copy(value, copyOptions);

    if (!isMountedRef.current || requestId !== requestIdRef.current || !result.success) {
      return;
    }

    setCopied(true);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (isMountedRef.current) {
        setCopied(false);
      }
    }, timeout);
  }, [copyOptions, timeout, value]);

  if (copied) {
    return <CheckOutlined style={{ color, ...style, ...styles?.copied }} />;
  }

  return <CopyOutlined onClick={handleCopy} style={{ color, ...style, ...styles?.copy }} />;
}

export const Copyable = memo(CopyableComponent);
