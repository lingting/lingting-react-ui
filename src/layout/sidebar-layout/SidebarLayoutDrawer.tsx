import { Drawer, Layout } from "antd";
import clsx from "clsx";
import { useCallback, type ReactNode } from "react";

import { useSidebarLayout } from "./SidebarLayoutContext";
import { SidebarCollapsed, type SidebarLayoutClassNames } from "./SidebarLayoutTypes";

type SidebarLayoutDrawerProps = {
  classNames?: SidebarLayoutClassNames;
  content: ReactNode;
  display: SidebarCollapsed;
  header: ReactNode;
  items: ReactNode;
  rootClassName: string;
  width: number | string;
};

/**
 * 抽屉展示方式：侧栏脱离文档流，仅通过 `SidebarToggle` 打开与关闭。
 *
 * 抽屉统一从左侧滑出，遮罩与 Esc 关闭复用 antd 默认行为。
 */
export function SidebarLayoutDrawer({
  classNames,
  content,
  display,
  header,
  items,
  rootClassName,
  width,
}: SidebarLayoutDrawerProps) {
  const { setCollapsed } = useSidebarLayout();
  const handleClose = useCallback(() => setCollapsed(SidebarCollapsed.Hidden), [setCollapsed]);

  return (
    <>
      <Layout className={rootClassName}>
        <Layout className={clsx("sidebar-layout__main", classNames?.main)}>
          {header}
          {content}
        </Layout>
      </Layout>
      <Drawer
        rootClassName={clsx("sidebar-layout__drawer", classNames?.sidebar)}
        closable={false}
        onClose={handleClose}
        open={display === SidebarCollapsed.Expanded}
        placement="left"
        width={width}
      >
        {items}
      </Drawer>
    </>
  );
}
