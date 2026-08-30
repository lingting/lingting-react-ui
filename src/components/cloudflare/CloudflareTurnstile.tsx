import { Turnstile, type TurnstileProps } from "@marsidev/react-turnstile";
import { memo, useRef } from "react";

import type { CloudflareTurnstileOptions, CloudflareTurnstileProps } from "@lri/types";

import "./CloudflareTurnstile.css";

export const CLOUDFLARE_TURNSTILE_DEFAULT_OPTIONS: CloudflareTurnstileOptions = {
  appearance: "always",
  execution: "render",
  language: "auto",
  responseField: true,
  retry: "auto",
  retryInterval: 8000,
  theme: "auto",
};

function CloudflareTurnstileComponent({
  onChange,
  className,
  onError,
  options,
  refreshKey,
  siteKey,
  ...props
}: CloudflareTurnstileProps) {
  const onChangeRef = useRef(onChange);
  const onErrorRef = useRef(onError);

  onChangeRef.current = onChange;
  onErrorRef.current = onError;

  const turnstileProps: TurnstileProps = {
    ...props,
    className: `cloudflare-turnstile-root ${className || ""}`,
    options: { ...CLOUDFLARE_TURNSTILE_DEFAULT_OPTIONS, ...options },
    siteKey,
    onError: (errorCode) => {
      onChangeRef.current?.(undefined);
      onErrorRef.current?.(errorCode);
    },
    onExpire: () => onChangeRef.current?.(undefined),
    onSuccess: (token) => onChangeRef.current?.(token),
  };

  return <Turnstile key={refreshKey} {...turnstileProps} />;
}
export const CloudflareTurnstile = memo(CloudflareTurnstileComponent);
