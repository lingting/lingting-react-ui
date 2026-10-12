import { ReloadOutlined } from "@ant-design/icons";
import { Flex, Result, Typography } from "antd";

import { Button } from "@lri/components";
import { BasicLayout } from "@lri/layout";
import type { DynamicLoadErrorProps } from "@lri/types";

/**
 * 动态加载异常页：说明加载失败的情况，并提供重新加载入口。
 */
export function DynamicLoadErrorPage({
  message,
  onReload,
  reloadText = "重新加载",
  target,
}: DynamicLoadErrorProps) {
  const handleReload = () => {
    if (onReload) {
      onReload();
      return;
    }

    window.location.reload();
  };

  return (
    <BasicLayout>
      <Result
        extra={
          <Button icon={<ReloadOutlined />} type="primary" onClick={handleReload}>
            {reloadText}
          </Button>
        }
        status="error"
        subTitle={
          <Flex vertical gap="small">
            <Typography.Text>
              {
                "当前页面资源加载失败，常见原因是应用已发布新版本、本地缓存过期或网络异常。请点击下方按钮重新加载；若仍无法打开，请稍后再试。"
              }
            </Typography.Text>
            {target ? <Typography.Text type="secondary">加载目标：{target}</Typography.Text> : null}
            {message ? (
              <Typography.Text type="secondary">失败原因：{message}</Typography.Text>
            ) : null}
          </Flex>
        }
        title="页面加载失败"
      />
    </BasicLayout>
  );
}
