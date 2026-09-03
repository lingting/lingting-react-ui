import { ProFormField } from "@ant-design/pro-components";
import { forwardRef } from "react";

import { CloudflareTurnstile } from "@lri/components";
import type { CloudflareTurnstileFormFieldProps, CloudflareTurnstileInstance } from "@lri/types";
export const CloudflareTurnstileFormField = forwardRef<
  CloudflareTurnstileInstance,
  CloudflareTurnstileFormFieldProps
>(({ siteKey, onError, fieldProps, ...props }, ref) => {
  return (
    <ProFormField {...props}>
      <CloudflareTurnstile {...fieldProps} ref={ref} siteKey={siteKey} onError={onError} />
    </ProFormField>
  );
});
