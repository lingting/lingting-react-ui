import {Badge, Button, Card, CardContent, CardHeader, CardTitle} from "lingting-react-ui/shadcn"

export function ShadcnPage() {
    return (
        <Card className="max-w-md">
            <CardHeader>
                <CardTitle>shadcn 组件</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3">
                <Button>Button</Button>
                <Badge>Badge</Badge>
            </CardContent>
        </Card>
    )
}
