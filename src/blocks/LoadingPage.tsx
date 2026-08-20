import { Spin } from "antd";
import { BasicLayout } from "@lri/layout";

export function LoadingPage() {
  return (
    <BasicLayout>
      <Spin fullscreen size="large" />
    </BasicLayout>
  );
}
