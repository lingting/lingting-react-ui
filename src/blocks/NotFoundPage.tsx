import { HomeOutlined } from "@ant-design/icons";
import { Result } from "antd";

import { Button } from "@lri/components";
import { useRouter } from "@lri/hooks";
import { BasicLayout } from "@lri/layout";

export function NotFoundPage() {
  const { navigate } = useRouter();

  return (
    <BasicLayout>
      <Result
        status="404"
        title="页面不存在"
        subTitle="您访问的地址可能已变更、失效，或暂时无法使用。"
        extra={
          <Button icon={<HomeOutlined />} type="primary" onClick={() => navigate("/")}>
            返回首页
          </Button>
        }
      />
    </BasicLayout>
  );
}
