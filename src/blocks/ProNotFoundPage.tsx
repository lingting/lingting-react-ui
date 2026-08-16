import { Typography } from "antd";

import { BasicLayout } from "@/layout";

export function ProNotFoundPage() {
  return (
    <BasicLayout>
      <section>
        <Typography.Paragraph>404</Typography.Paragraph>
        <Typography.Title level={1}>页面不存在</Typography.Title>
        <Typography.Paragraph>请检查访问地址后重试。</Typography.Paragraph>
      </section>
    </BasicLayout>
  );
}
