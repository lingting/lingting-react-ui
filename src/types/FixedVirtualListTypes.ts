import type { ReactNode } from "react";

/**
 * 固定高度子项虚拟列表的属性。
 *
 * FixedVirtualList 会自动获取自身高度，因此调用者必须通过父容器或自身 CSS
 * 让组件拥有可计算的高度，否则无法正确计算虚拟渲染区域。
 *
 * 父容器可使用固定高度：
 * ```css
 * .container { height: 500px; }
 * ```
 *
 * 或使用 flex 布局：
 * ```css
 * .parent { display: flex; flex-direction: column; height: 100%; }
 * .fixed-virtual-list { flex: 1; min-height: 0; }
 * ```
 */
export type FixedVirtualListProps<T> = {
  className?: string;
  classNames?: {
    content?: string;
    item?: string;
  };
  data: T[];
  itemRender: (item: T) => ReactNode;
  filter?: (items: T[]) => T[];
  itemHeight: number;
  itemSize?: number;
};
