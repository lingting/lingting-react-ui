import * as React from "react"
import {TypographyContent} from "./TypographyContent"
import type {TypographyDecorationProps} from "./types"

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement>, TypographyDecorationProps {
}

export function Paragraph({children, ...props}: ParagraphProps) {
    const {className, ...componentProps} = props

    return <TypographyContent component="p" componentProps={componentProps} className={className}
                              defaultEllipsisRows={3}>{children}</TypographyContent>
}
