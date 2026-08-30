import type { ProFormFieldProps } from "@ant-design/pro-components";
import type { TurnstileProps } from "@marsidev/react-turnstile";

export type CloudflareTurnstileOptions = NonNullable<TurnstileProps["options"]>;

export type CloudflareTurnstileProps = Pick<
  TurnstileProps,
  | "as"
  | "className"
  | "id"
  | "injectScript"
  | "onLoadScript"
  | "onTimeout"
  | "onUnsupported"
  | "onWidgetLoad"
  | "rerenderOnCallbackChange"
  | "scriptOptions"
  | "style"
  | "title"
  | "role"
  | "tabIndex"
> & {
  onChange?: (token?: string) => void;
  onError?: (errorCode: string) => void;
  options?: CloudflareTurnstileOptions;
  refreshKey?: string | number;
  siteKey: string;
};

export type CloudflareTurnstileFormFieldProps = Omit<
  ProFormFieldProps<string, Omit<CloudflareTurnstileProps, "siteKey" | "onError">>,
  "children" | "valuePropName" | "valueType" | keyof CloudflareTurnstileProps
> & {
  siteKey: CloudflareTurnstileProps["siteKey"];
  onError?: CloudflareTurnstileProps["onError"];
};
