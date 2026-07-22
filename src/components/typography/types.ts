import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from "react"

export type BuiltInTypography = "basic" | "compact" | "spacious"
export type Typography = BuiltInTypography | (string & {})
export type TypographyVariant = Typography
export type TypographyType = "secondary" | "success" | "warning" | "danger"
export type TypographyTrigger = "icon" | "text" | "both"

export interface TypographyActionRenderProps {
  ariaLabel: string
  buttonProps: ButtonHTMLAttributes<HTMLButtonElement>
  className: string
  icon: ReactNode
  onClick: (event: MouseEvent<HTMLButtonElement>) => void
  title?: string
}

export interface TypographyActionConfig {
  buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>
  icon?: ReactNode
  render?: (props: TypographyActionRenderProps) => ReactNode
}

export interface TypographyCopyableConfig extends TypographyActionConfig {
  text?: string
  tooltips?: boolean | [ReactNode, ReactNode]
  onCopy?: (text: string) => void
}

export interface TypographyEditableConfig extends TypographyActionConfig {
  editing?: boolean
  maxLength?: number
  onCancel?: () => void
  onChange?: (value: string) => void
  onEnd?: (value: string) => void
  onStart?: () => void
  triggerType?: TypographyTrigger | TypographyTrigger[]
}

export interface TypographyEllipsisConfig extends TypographyActionConfig {
  expandable?: boolean | "collapsible"
  onEllipsis?: (isEllipsis: boolean) => void
  onExpand?: (event: MouseEvent<HTMLButtonElement>) => void
  rows?: number
  symbol?: ReactNode
}

export interface TypographyDecorationProps {
  copyable?: boolean | TypographyCopyableConfig
  delete?: boolean
  disabled?: boolean
  editable?: boolean | TypographyEditableConfig
  ellipsis?: boolean | TypographyEllipsisConfig
  italic?: boolean
  keyboard?: boolean
  mark?: boolean
  strong?: boolean
  type?: TypographyType
  underline?: boolean
}
