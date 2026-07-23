import type { ReactNode } from "react"

interface DemoSectionProps {
  children: ReactNode
  description?: string
  title: string
}

export function DemoSection({
  children,
  description,
  title,
}: DemoSectionProps) {
  return (
    <section
      className="components-demo-section"
      data-slot="components-demo-section"
    >
      <div className="components-demo-section__heading">
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      <div className="components-demo-section__content">{children}</div>
    </section>
  )
}
