import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type { FixedVirtualListProps } from "@lri/types";

import "./FixedVirtualList.css";

type VirtualListStyle = CSSProperties & {
  "--fixed-virtual-list-content-height": string;
  "--fixed-virtual-list-item-height": string;
  "--fixed-virtual-list-offset": string;
};

const DEFAULT_ITEM_SIZE = 10;

/**
 * 固定高度子项虚拟列表。
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
function FixedVirtualListComponent<T>({
  className,
  classNames,
  data,
  itemRender,
  filter,
  itemHeight,
  itemSize = DEFAULT_ITEM_SIZE,
}: FixedVirtualListProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const filterItems = useMemo(() => {
    const filteredData = filter ? filter(data) : data;
    return filteredData.map((item, index) => ({ id: index, data: item }));
  }, [data, filter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height);
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const visibleCount = Math.max(Math.ceil(containerHeight / itemHeight), itemSize);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const visibleItems = filterItems.slice(startIndex, startIndex + visibleCount);
  const virtualListStyle: VirtualListStyle = {
    "--fixed-virtual-list-content-height": `${filterItems.length * itemHeight}px`,
    "--fixed-virtual-list-item-height": `${itemHeight}px`,
    "--fixed-virtual-list-offset": `${startIndex * itemHeight}px`,
  };

  return (
    <div
      ref={containerRef}
      className={["fixed-virtual-list", className].filter(Boolean).join(" ")}
      style={virtualListStyle}
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
    >
      <div
        className={["fixed-virtual-list-content", classNames?.content].filter(Boolean).join(" ")}
      >
        <div className="fixed-virtual-list-viewport">
          {visibleItems.map((item) => (
            <div
              key={item.id}
              className={["fixed-virtual-list-item", classNames?.item].filter(Boolean).join(" ")}
            >
              {itemRender(item.data)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const FixedVirtualList = memo(FixedVirtualListComponent) as typeof FixedVirtualListComponent;
