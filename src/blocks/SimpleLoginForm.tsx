import type { SimpleLoginFormProps, SimpleLoginFormValues } from "@/types";
import { Alert, Flex, Row, Spin, Typography } from "antd";
import { ProForm, ProFormText } from "@ant-design/pro-components";
import { Children, useCallback, useMemo, useState } from "react";

import { Button, LinkButton } from "@/components";

import "./SimpleLoginForm.css";

function LoginMessage({ text }: { text?: string }) {
  if (text?.trim().length) {
    return <Alert className="simple-login-form__message" title={text} type="error" showIcon />;
  }

  return <div className="simple-login-form__message" />;
}

function SimpleLoginForm<T = Record<string, unknown>>({
  afterButton,
  bottomForm,
  className,
  forget = false,
  formProps,
  formRef,
  onFinish,
  title,
}: SimpleLoginFormProps<T>) {
  const [form] = ProForm.useForm<SimpleLoginFormValues<T>>(formRef);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const forgetContent = useMemo(() => {
    if (forget === false) return undefined;
    if (typeof forget === "function") {
      return <LinkButton text="忘记密码?" onClick={() => forget(form)} />;
    }

    return forget;
  }, [forget, form]);
  const errorAlert = useMemo(() => <LoginMessage text={error} />, [error]);

  const onLogin = useCallback(
    (values: SimpleLoginFormValues<T>) => {
      setLoading(true);
      setError("");

      return onFinish(values)
        .catch((reason: unknown) => {
          const message = reason instanceof Error ? reason.message : String(reason || "登录异常!");
          setError(message);
        })
        .finally(() => setLoading(false));
    },
    [onFinish],
  );

  const onSubmit = useCallback(() => {
    setError("");
    void form.validateFields().then(onLogin);
  }, [form, onLogin]);

  const bottomFields = useMemo(
    () => bottomForm?.(form, onSubmit) ?? [],
    [bottomForm, form, onSubmit],
  );

  return (
    <Spin spinning={loading} className={className}>
      <Flex vertical className="simple-login-form">
        {title}
        {errorAlert}
        <ProForm<SimpleLoginFormValues<T>>
          layout="vertical"
          submitter={false}
          {...formProps}
          form={form}
          onFinish={undefined}
        >
          <ProFormText
            label="账号"
            name="username"
            rules={[{ required: true }]}
            fieldProps={{ onPressEnter: onSubmit }}
          />
          <ProFormText.Password
            label={
              <Row justify="space-between">
                <Typography.Text>密码</Typography.Text>
                {forgetContent}
              </Row>
            }
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
            fieldProps={{ onPressEnter: onSubmit }}
          />
          {Children.toArray(bottomFields)}
        </ProForm>
        <Button text="登录" type="primary" onClick={onSubmit} />
        {afterButton ? Children.toArray(afterButton) : null}
      </Flex>
    </Spin>
  );
}

export { SimpleLoginForm };
export default SimpleLoginForm;
