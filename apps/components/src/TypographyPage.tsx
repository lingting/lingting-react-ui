import {useCallback, useState} from "react"
import {Link, Paragraph, Text, Title, Typography} from "lingting-react-ui"

const longText = "排版组件支持通过省略配置控制长文本展示，在需要时允许用户展开完整内容，并在不同排版方案中保持一致的层级和节奏。"

export function TypographyPage() {
    const [editableText, setEditableText] = useState("点击编辑图标修改这段文本")
    const handleEdit = useCallback((value: string) => setEditableText(value), [])

    return (
        <section className="typography-content space-y-8">
            <div>
                <Title level={1}>排版组件</Title>
                <Paragraph type="secondary">
                    基于内容层级的基础排版，支持网页、紧凑和宽松三种阅读节奏。
                </Paragraph>
            </div>

            <div className="space-y-3">
                <Title level={2}>标题与文本</Title>
                <Title level={3}>三级标题</Title>
                <Paragraph>
                    <Text strong>强调文本</Text>、<Text italic>斜体文本</Text>、<Text underline>下划线</Text>、
                    <Text delete>删除线</Text>、<Text mark>标记文本</Text>、<Text code>const name = "Lingting"</Text>、
                    <Text keyboard>Ctrl K</Text>。
                </Paragraph>
                <Paragraph>
                    <Text type="secondary">次级</Text>、<Text type="success">成功</Text>、
                    <Text type="warning">警告</Text>、<Text type="danger">危险</Text>，以及
                    <Link href="https://ui.shadcn.com/docs/typeset" target="_blank" rel="noreferrer">参考链接</Link>。
                </Paragraph>
            </div>

            <div className="space-y-3">
                <Title level={2}>交互文本</Title>
                <Paragraph copyable={{text: "已复制的排版内容"}}>
                    悬停右侧复制图标可复制指定内容。
                </Paragraph>
                <Paragraph editable={{onEnd: handleEdit, maxLength: 40}}>
                    {editableText}
                </Paragraph>
                <Paragraph ellipsis={{rows: 2, expandable: "collapsible"}}>
                    {longText} {longText}
                </Paragraph>
            </div>

            <div className="space-y-3">
                <Title level={2}>内容排版</Title>
                <blockquote>好的排版让信息层级清晰，并让阅读保持自然节奏。</blockquote>
                <ul>
                    <li>标题用于表达内容层级。</li>
                    <li>段落用于组织连续文本。</li>
                    <li>语义标记用于强调关键信息。</li>
                </ul>
                <pre><code>{`function greet(name: string) {\n  return \`Hello, \${name}\`\n}`}</code></pre>
                <table>
                    <thead>
                    <tr>
                        <th>方案</th>
                        <th>适用场景</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>basic</td>
                        <td>常规网页内容</td>
                    </tr>
                    <tr>
                        <td>compact</td>
                        <td>信息密度较高的界面</td>
                    </tr>
                    <tr>
                        <td>spacious</td>
                        <td>需要舒适阅读的内容</td>
                    </tr>
                    </tbody>
                </table>
            </div>

            <Typography.Paragraph type="secondary">
                同时支持具名组件和 <Typography.Text code>Typography.Title</Typography.Text> 等复合组件 API。
            </Typography.Paragraph>
        </section>
    )
}
