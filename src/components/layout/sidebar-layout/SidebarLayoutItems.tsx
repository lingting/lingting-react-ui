import type {
  SidebarLayoutActionContext,
  SidebarLayoutItem as SidebarLayoutItemValue,
} from "../SidebarLayout.types"
import { SidebarLayoutItem } from "./SidebarLayoutItem"

interface SidebarLayoutItemsProps {
  className: string
  items: readonly SidebarLayoutItemValue[]
  state: SidebarLayoutActionContext
}

export function SidebarLayoutItems({
  className,
  items,
  state,
}: SidebarLayoutItemsProps) {
  return (
    <div className={className} data-slot="sidebar-layout-items">
      {items.map((item, index) => (
        <SidebarLayoutItem item={item} key={index} state={state} />
      ))}
    </div>
  )
}
