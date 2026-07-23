import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/shadcn/ui/button"
import type { TypographyActionConfig } from "./types"

interface TypographyActionProps {
  ariaLabel: string
  className?: string
  config?: TypographyActionConfig | null
  icon: React.ReactNode
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
  title?: string
}

export function TypographyAction({
  ariaLabel,
  className,
  config,
  icon,
  onClick,
  title,
}: TypographyActionProps) {
  const buttonProps = config?.buttonProps
  const actionClassName = cn(className, buttonProps?.className)
  const actionIcon = config?.icon ?? icon
  const actionTitle = buttonProps?.title ?? title
  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      buttonProps?.onClick?.(event)

      if (!event.defaultPrevented) {
        onClick(event)
      }
    },
    [buttonProps, onClick]
  )

  if (config?.render) {
    const resolvedButtonProps: React.ButtonHTMLAttributes<HTMLButtonElement> = {
      ...buttonProps,
      type: "button",
      "aria-label": buttonProps?.["aria-label"] ?? ariaLabel,
      className: actionClassName,
      title: actionTitle,
      onClick: handleClick,
    }

    return config.render({
      ariaLabel: buttonProps?.["aria-label"] ?? ariaLabel,
      buttonProps: resolvedButtonProps,
      className: actionClassName,
      icon: actionIcon,
      onClick: handleClick,
      title: actionTitle,
    })
  }

  return (
    <Button
      {...buttonProps}
      type="button"
      aria-label={buttonProps?.["aria-label"] ?? ariaLabel}
      className={actionClassName}
      title={actionTitle}
      onClick={handleClick}
    >
      {actionIcon}
    </Button>
  )
}
