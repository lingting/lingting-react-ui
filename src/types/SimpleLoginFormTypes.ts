import type { ProFormProps } from "@ant-design/pro-components";
import type { FormInstance } from "antd";
import type { ReactNode } from "react";

export type SimpleLoginFormValues<T = Record<string, unknown>> = {
  password: string;
  username: string;
} & T;

export type SimpleLoginFormForget<T = Record<string, unknown>> =
  | false
  | ((formRef: FormInstance<SimpleLoginFormValues<T>>) => void)
  | ReactNode;

export type SimpleLoginFormProps<T = Record<string, unknown>> = {
  afterButton?: ReactNode[];
  bottomForm?: (form: FormInstance<SimpleLoginFormValues<T>>, onSubmit: () => void) => ReactNode[];
  className?: string;
  forget?: SimpleLoginFormForget<T>;
  formProps?: Omit<ProFormProps<SimpleLoginFormValues<T>>, "children" | "form" | "onFinish">;
  formRef?: FormInstance<SimpleLoginFormValues<T>>;
  onFinish: (values: SimpleLoginFormValues<T>) => Promise<void>;
  title?: string | ReactNode;
};
