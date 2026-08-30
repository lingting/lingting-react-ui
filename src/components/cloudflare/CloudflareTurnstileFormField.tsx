import { ProFormField } from "@ant-design/pro-components";

import { CloudflareTurnstile } from "@lri/components";
import type { CloudflareTurnstileFormFieldProps } from "@lri/types";

export function CloudflareTurnstileFormField({
  siteKey,
  onError,
  fieldProps,
  ...props
}: CloudflareTurnstileFormFieldProps) {
  return (
    <ProFormField {...props}>
      <CloudflareTurnstile {...fieldProps} siteKey={siteKey} onError={onError} />
    </ProFormField>
  );
}
