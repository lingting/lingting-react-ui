import * as React from "react"
import {Check, Clipboard, Pencil, X} from "lucide-react"
import {cn} from "@/lib/utils"
import type {
    TypographyCopyableConfig,
    TypographyDecorationProps,
    TypographyEditableConfig,
    TypographyEllipsisConfig,
} from "./types"

interface TypographyContentProps extends TypographyDecorationProps {
    children: React.ReactNode
    className?: string
    component: React.ElementType
    componentProps: Record<string, unknown>
    defaultEllipsisRows?: number
}

function resolveConfig<T>(value: boolean | T | undefined): T | null {
    return value && value !== true ? value : value ? {} as T : null
}

function decorationClassName({
                                 code,
                                 delete: deleted,
                                 disabled,
                                 italic,
                                 keyboard,
                                 mark,
                                 strong,
                                 type,
                                 underline
                             }: TypographyDecorationProps) {
    return cn(
        disabled && "pointer-events-none cursor-not-allowed text-muted-foreground opacity-60",
        type === "secondary" && "text-muted-foreground",
        type === "success" && "text-emerald-600 dark:text-emerald-400",
        type === "warning" && "text-amber-600 dark:text-amber-400",
        type === "danger" && "text-destructive",
        strong && "font-semibold",
        italic && "italic",
        underline && "underline underline-offset-4",
        deleted && "line-through",
        mark && "bg-yellow-200 px-1 text-inherit dark:bg-yellow-500/30",
        code && "rounded bg-muted px-1.5 py-0.5 font-mono text-[0.875em]",
        keyboard && "rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[0.875em] shadow-xs"
    )
}

async function copyToClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return
    }

    const textarea = document.createElement("textarea")
    textarea.value = text
    textarea.style.position = "fixed"
    textarea.style.opacity = "0"
    document.body.append(textarea)
    textarea.select()
    document.execCommand("copy")
    textarea.remove()
}

export function TypographyContent({
                                      children,
                                      className,
                                      component: Component,
                                      componentProps,
                                      copyable,
                                      defaultEllipsisRows = 1,
                                      editable,
                                      ellipsis,
                                      ...decorationProps
                                  }: TypographyContentProps) {
    const copyConfig = resolveConfig<TypographyCopyableConfig>(copyable)
    const editableConfig = resolveConfig<TypographyEditableConfig>(editable)
    const ellipsisConfig = resolveConfig<TypographyEllipsisConfig>(ellipsis)
    const contentText = typeof children === "string" ? children : ""
    const [editing, setEditing] = React.useState(editableConfig?.editing ?? false)
    const [value, setValue] = React.useState(contentText)
    const [copied, setCopied] = React.useState(false)
    const [expanded, setExpanded] = React.useState(false)

    React.useEffect(() => {
        setValue(contentText)
    }, [contentText])

    React.useEffect(() => {
        if (editableConfig?.editing !== undefined) {
            setEditing(editableConfig.editing)
        }
    }, [editableConfig?.editing])

    React.useEffect(() => {
        ellipsisConfig?.onEllipsis?.(Boolean(ellipsisConfig && !expanded))
    }, [ellipsisConfig, expanded])

    const startEditing = React.useCallback(() => {
        setEditing(true)
        editableConfig?.onStart?.()
    }, [editableConfig])
    const cancelEditing = React.useCallback(() => {
        setValue(contentText)
        setEditing(false)
        editableConfig?.onCancel?.()
    }, [contentText, editableConfig])
    const finishEditing = React.useCallback(() => {
        setEditing(false)
        editableConfig?.onEnd?.(value)
    }, [editableConfig, value])
    const handleCopy = React.useCallback(async () => {
        const text = copyConfig?.text ?? contentText
        await copyToClipboard(text)
        setCopied(true)
        window.setTimeout(() => setCopied(false), 1600)
        copyConfig?.onCopy?.(text)
    }, [contentText, copyConfig])
    const toggleExpanded = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
        setExpanded((current) => !current)
        ellipsisConfig?.onExpand?.(event)
    }, [ellipsisConfig])

    if (editing) {
        return (
            <span className={cn("inline-flex max-w-full items-center gap-1", className)}>
                <input
                    autoFocus
                    className="h-7 min-w-0 flex-1 rounded border border-input bg-background px-2 text-inherit outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
                    maxLength={editableConfig?.maxLength}
                    value={value}
                    onChange={(event) => {
                        setValue(event.target.value)
                        editableConfig?.onChange?.(event.target.value)
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            finishEditing()
                        }
                        if (event.key === "Escape") {
                            cancelEditing()
                        }
                    }}
                />
                <button type="button" className="typography-action" aria-label="确认编辑" onClick={finishEditing}>
                    <Check aria-hidden="true"/>
                </button>
                <button type="button" className="typography-action" aria-label="取消编辑" onClick={cancelEditing}>
                    <X aria-hidden="true"/>
                </button>
            </span>
        )
    }

    const rows = ellipsisConfig?.rows ?? defaultEllipsisRows
    const isClamped = Boolean(ellipsisConfig && !expanded)
    const copyTooltip = copied
        ? copyConfig?.tooltips && copyConfig.tooltips !== true
            ? copyConfig.tooltips[1]
            : "已复制"
        : copyConfig?.tooltips && copyConfig.tooltips !== true
            ? copyConfig.tooltips[0]
            : "复制"
    return (
        <>
            <Component
                {...componentProps}
                className={cn(
                    decorationClassName(decorationProps),
                    isClamped && "typography-ellipsis",
                    className
                )}
                style={isClamped ? {WebkitLineClamp: rows} : undefined}
            >
                {children}
            </Component>
            {editableConfig && (
                <button type="button" className="typography-action" aria-label="编辑" title="编辑"
                        onClick={startEditing}>
                    <Pencil aria-hidden="true"/>
                </button>
            )}
            {copyConfig && (
                <button
                    type="button"
                    className="typography-action"
                    aria-label={copied ? "已复制" : "复制"}
                    title={typeof copyTooltip === "string" ? copyTooltip : undefined}
                    onClick={handleCopy}
                >
                    {copied ? <Check aria-hidden="true"/> : <Clipboard aria-hidden="true"/>}
                </button>
            )}
            {ellipsisConfig?.expandable && (
                <button type="button" className="typography-expand" onClick={toggleExpanded}>
                    {expanded ? "收起" : ellipsisConfig.symbol ?? "展开"}
                </button>
            )}
        </>
    )
}
