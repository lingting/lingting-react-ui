import clsx from "clsx";
import { Children, type ReactNode } from "react";

import type { SidebarLayoutClassNames } from "./SidebarLayoutTypes";

type SidebarLayoutItemsProps = {
  baseItems: readonly ReactNode[];
  bottomItems: readonly ReactNode[];
  classNames?: SidebarLayoutClassNames;
};

/** 平铺与抽屉两种展示方式共用的侧栏内容 */
export function SidebarLayoutItems({
  baseItems,
  bottomItems,
  classNames,
}: SidebarLayoutItemsProps) {
  return (
    <>
      {baseItems.length > 0 && (
        <div className={clsx("sidebar-layout__base-items", classNames?.baseItems)}>
          {Children.toArray(baseItems)}
        </div>
      )}
      {bottomItems.length > 0 && (
        <div className={clsx("sidebar-layout__bottom-items", classNames?.bottomItems)}>
          {Children.toArray(bottomItems)}
        </div>
      )}
    </>
  );
}
