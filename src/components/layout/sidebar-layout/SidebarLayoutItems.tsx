import type {
  SidebarLayoutActionContext,
  SidebarLayoutItem as SidebarLayoutItemValue,
} from "./SidebarLayout.types"
import {
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/shadcn/ui/sidebar"
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
    <SidebarMenu className={className} data-slot="sidebar-layout-items">
      {items.map((item, index) => (
        <SidebarMenuItem key={index}>
          <SidebarLayoutItem item={item} state={state} />
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}
