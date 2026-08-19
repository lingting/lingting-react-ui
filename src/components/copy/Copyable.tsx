import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { copy } from "@lri/lib";
import type { CopyableProps } from "@lri/types";
import { Button } from "@lri/components";

function CopyableComponent({
  value,
  timeout = 3000,
  debug,
  format,
  message,
  onCopy,
  onFailed,
  onSuccess,
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

  return (
    <Button
      color="primary"
      icon={copied ? <CheckOutlined /> : <CopyOutlined />}
      onClick={handleCopy}
      type="text"
    />
  );
}

export const Copyable = memo(CopyableComponent);
