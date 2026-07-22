import * as React from "react"
import {
  Check,
  ChevronDown,
  ChevronUp,
  Clipboard,
  Pencil,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { TypographyAction } from "./TypographyAction"
import { typographyDecorationClassName } from "./decorationClassName"
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
  return value && value !== true ? value : value ? ({} as T) : null
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
  const toggleExpanded = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setExpanded((current) => !current)
      ellipsisConfig?.onExpand?.(event)
    },
    [ellipsisConfig]
  )

  if (editing) {
    return (
      <span
        className={cn("inline-flex max-w-full items-center gap-1", className)}
      >
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
        <TypographyAction
          ariaLabel="确认编辑"
          className="typography-action"
          icon={<Check aria-hidden="true" />}
          onClick={finishEditing}
        />
        <TypographyAction
          ariaLabel="取消编辑"
          className="typography-action"
          icon={<X aria-hidden="true" />}
          onClick={cancelEditing}
        />
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
          typographyDecorationClassName(decorationProps),
          isClamped && "typography-ellipsis",
          className
        )}
        style={isClamped ? { WebkitLineClamp: rows } : undefined}
      >
        {children}
      </Component>
      {editableConfig && (
        <TypographyAction
          ariaLabel="编辑"
          className="typography-action"
          config={editableConfig}
          icon={<Pencil aria-hidden="true" />}
          title="编辑"
          onClick={startEditing}
        />
      )}
      {copyConfig && (
        <TypographyAction
          ariaLabel={copied ? "已复制" : "复制"}
          className="typography-action"
          config={copyConfig}
          icon={
            copied ? (
              <Check aria-hidden="true" />
            ) : (
              <Clipboard aria-hidden="true" />
            )
          }
          title={typeof copyTooltip === "string" ? copyTooltip : undefined}
          onClick={handleCopy}
        />
      )}
      {ellipsisConfig?.expandable && (
        <TypographyAction
          ariaLabel={expanded ? "收起" : "展开"}
          className="typography-expand"
          config={ellipsisConfig}
          icon={
            ellipsisConfig.symbol ??
            (expanded ? (
              <ChevronUp aria-hidden="true" />
            ) : (
              <ChevronDown aria-hidden="true" />
            ))
          }
          title={expanded ? "收起" : "展开"}
          onClick={toggleExpanded}
        />
      )}
    </>
  )
}
