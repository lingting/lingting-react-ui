import type { CSSProperties, ReactNode } from "react"

import type { SidebarLayoutHeaderOptions } from "./SidebarLayout.types"
import { toSidebarLayoutCssSize } from "./SidebarLayoutStyle"

interface SidebarLayoutContentProps {
  children: ReactNode
  header: false | SidebarLayoutHeaderOptions | undefined
}

const headerStyle = (height: CSSProperties["height"]) =>
  ({
    "--sidebar-layout-header-height": toSidebarLayoutCssSize(
      height,
      "3.5rem"
    ),
  }) as CSSProperties

export function SidebarLayoutContent({
  children,
  header,
}: SidebarLayoutContentProps) {
  if (!header) {
    return (
      <main
        className="sidebar-layout-content sidebar-layout-content--without-header"
        data-slot="sidebar-layout-content"
      >
        <div className="sidebar-layout-content__body">{children}</div>
      </main>
    )
  }

  return (
    <section
      className={
        header.fixed
          ? "sidebar-layout-content sidebar-layout-content--fixed-header"
          : "sidebar-layout-content sidebar-layout-content--scrolling-header"
      }
      data-slot="sidebar-layout-content"
    >
      <header
        className="sidebar-layout-content__header"
        style={headerStyle(header.height)}
      >
        <div className="sidebar-layout-content__header-start">
          {header.left}
        </div>
        <div className="sidebar-layout-content__header-end">{header.right}</div>
      </header>
      <main className="sidebar-layout-content__body">{children}</main>
    </section>
  )
}
