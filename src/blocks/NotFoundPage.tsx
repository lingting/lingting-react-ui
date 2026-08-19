import { HomeOutlined } from "@ant-design/icons";
import { Result, theme } from "antd";

import { Button } from "@lri/components";
import { useRouter } from "@lri/hooks";
import { BasicLayout } from "@lri/layout";

export function NotFoundPage() {
  const { token } = theme.useToken();
  const { navigate } = useRouter();

  return (
    <BasicLayout>
      <main
        style={{
          alignItems: "center",
          display: "flex",
          flex: 1,
          justifyContent: "center",
          minHeight: 0,
          padding: token.paddingLG,
        }}
      >
        <Result
          status="404"
          styles={{
            root: {
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              boxShadow: token.boxShadowTertiary,
              maxWidth: token.screenMD,
              paddingBlock: token.paddingXL,
              width: "100%",
            },
          }}
          title="页面不存在"
          subTitle="您访问的地址可能已变更、失效，或暂时无法使用。"
          extra={
            <Button icon={<HomeOutlined />} type="primary" onClick={() => navigate("/")}>
              返回首页
            </Button>
          }
        />
      </main>
    </BasicLayout>
  );
}
