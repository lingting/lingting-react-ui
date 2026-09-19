import { CloseOutlined, CompressOutlined, ExpandOutlined, MinusOutlined } from "@ant-design/icons";
import { Flex } from "antd";

import { AntdButton } from "@lri/components";

export type DesktopWindowActionsProps = {
  isMaximized: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
};

export function DesktopWindowActions({
  isMaximized,
  onClose,
  onMinimize,
  onToggleMaximize,
}: DesktopWindowActionsProps) {
  return (
    <Flex align="center" className="desktop-sidebar-layout__window-actions" gap="small">
      <AntdButton icon={<MinusOutlined />} tooltip="最小化" type="text" onClick={onMinimize} />
      <AntdButton
        hidden={!isMaximized}
        icon={<CompressOutlined />}
        tooltip="还原"
        type="text"
        onClick={onToggleMaximize}
      />
      <AntdButton
        hidden={isMaximized}
        icon={<ExpandOutlined />}
        tooltip="最大化"
        type="text"
        onClick={onToggleMaximize}
      />
      <AntdButton
        className="desktop-sidebar-layout__window-close"
        icon={<CloseOutlined />}
        tooltip="关闭"
        type="text"
        onClick={onClose}
      />
    </Flex>
  );
}
