import type {ComponentProps} from "react"
import {Button} from "@/components/shadcn/ui/button"

export type TestButtonProps = ComponentProps<typeof Button>

export function TestButton({children = "测试按钮", ...props}: TestButtonProps) {
    return <Button {...props}>{children}</Button>
}
