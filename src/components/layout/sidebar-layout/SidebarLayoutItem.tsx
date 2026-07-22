import { useCallback } from "react"

import { TextIcon } from "@/components/icon/TextIcon"

import type {
  SidebarLayoutActionContext,
  SidebarLayoutItem as SidebarLayoutItemValue,
} from "../SidebarLayout.types"

interface SidebarLayoutItemProps {
  item: SidebarLayoutItemValue
  state: SidebarLayoutActionContext
}

export function SidebarLayoutItem({ item, state }: SidebarLayoutItemProps) {
  const handleClick = useCallback(() => {
    item.onClick?.(state)
  }, [item, state])

  const hasIcon = item.icon !== undefined
  const label = typeof item.content === "string" ? item.content : undefined

  return (
    <button
      aria-label={label}
      className="sidebar-layout-item"
      data-has-icon={hasIcon}
      data-slot="sidebar-layout-item"
      onClick={handleClick}
      type="button"
    >
      {hasIcon && (
        <span aria-hidden="true" className="sidebar-layout-item__icon">
          {typeof item.icon === "string" ? (
            <TextIcon text={item.icon} />
          ) : (
            item.icon
          )}
        </span>
      )}
      <span className="sidebar-layout-item__content">{item.content}</span>
    </button>
  )
}
