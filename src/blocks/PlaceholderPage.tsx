import { Flex, Typography } from "antd";
import { useRouter } from "@lri/hooks";

const PlaceholderPage = () => {
  const { current } = useRouter();
  const title = current.title ?? current.path ?? "未知页面";

  return (
    <Flex vertical gap="small">
      <Typography.Title level={1}>{title}</Typography.Title>
      <Typography.Paragraph>当前页面正在建设中。</Typography.Paragraph>
    </Flex>
  );
};

export { PlaceholderPage };
