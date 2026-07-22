import type {ReactNode} from "react"

export type BuiltInTypography = "basic" | "compact" | "spacious"
export type Typography = BuiltInTypography | (string & {})
export type TypographyVariant = Typography
export type TypographyType = "secondary" | "success" | "warning" | "danger"
export type TypographyTrigger = "icon" | "text" | "both"

export interface TypographyCopyableConfig {
    text?: string
    tooltips?: boolean | [ReactNode, ReactNode]
    onCopy?: (text: string) => void
}

export interface TypographyEditableConfig {
    editing?: boolean
    maxLength?: number
    onCancel?: () => void
    onChange?: (value: string) => void
    onEnd?: (value: string) => void
    onStart?: () => void
    triggerType?: TypographyTrigger | TypographyTrigger[]
}

export interface TypographyEllipsisConfig {
    expandable?: boolean | "collapsible"
    onEllipsis?: (isEllipsis: boolean) => void
    onExpand?: (event: React.MouseEvent<HTMLButtonElement>) => void
    rows?: number
    symbol?: ReactNode
}

export interface TypographyDecorationProps {
    code?: boolean
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
