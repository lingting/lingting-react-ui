import { useCallback, useState } from "react"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  Button,
  ButtonGroup,
  Calendar,
  Checkbox,
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  Label,
  NativeSelect,
  NativeSelectOption,
  RadioGroup,
  RadioGroupItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Slider,
  Switch,
  Textarea,
  Toggle,
  ToggleGroup,
  ToggleGroupItem,
} from "lingting-react-ui/shadcn"
import { FileTextIcon, SearchIcon, XIcon } from "lucide-react"
import { DemoSection } from "../components/DemoSection"

export function ShadcnFormPage() {
  const [checked, setChecked] = useState(true)
  const [enabled, setEnabled] = useState(true)
  const [otp, setOtp] = useState("")
  const handleCheckedChange = useCallback(
    (value: boolean) => setChecked(value),
    []
  )
  const handleEnabledChange = useCallback(
    (value: boolean) => setEnabled(value),
    []
  )
  const handleOtpChange = useCallback((value: string) => setOtp(value), [])

  return (
    <div className="components-page">
      <header className="components-page__header">
        <p className="components-page__eyebrow">shadcn / 表单与输入</p>
        <h1>输入控件</h1>
        <p>覆盖文本、选择、范围与文件附件等 18 个公开模块。</p>
      </header>
      <div className="components-demo-grid">
        <DemoSection title="Attachment">
          <Attachment>
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>组件说明.pdf</AttachmentTitle>
              <AttachmentDescription>1.4 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </DemoSection>
        <DemoSection title="Button / ButtonGroup">
          <ButtonGroup>
            <Button>保存</Button>
            <Button variant="outline">预览</Button>
          </ButtonGroup>
        </DemoSection>
        <DemoSection title="Calendar">
          <Calendar mode="single" />
        </DemoSection>
        <DemoSection title="Checkbox / Switch">
          <div className="components-demo-stack">
            <label className="components-control-label">
              <Checkbox
                checked={checked}
                onCheckedChange={handleCheckedChange}
              />{" "}
              接收更新
            </label>
            <label className="components-control-label">
              <Switch checked={enabled} onCheckedChange={handleEnabledChange} />{" "}
              启用通知
            </label>
          </div>
        </DemoSection>
        <DemoSection title="Combobox">
          <Combobox items={["React", "Vue", "Svelte"]}>
            <ComboboxInput placeholder="选择框架" />
            <ComboboxContent>
              <ComboboxList>
                <ComboboxItem value="React">React</ComboboxItem>
                <ComboboxItem value="Vue">Vue</ComboboxItem>
                <ComboboxItem value="Svelte">Svelte</ComboboxItem>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </DemoSection>
        <DemoSection title="Field / Label">
          <Field>
            <FieldLabel htmlFor="demo-name">名称</FieldLabel>
            <Input id="demo-name" placeholder="输入名称" />
            <FieldDescription>用于示例展示。</FieldDescription>
          </Field>
          <Label htmlFor="demo-note">备注</Label>
        </DemoSection>
        <DemoSection title="Input / InputGroup">
          <div className="components-demo-stack">
            <Input placeholder="普通输入框" />
            <InputGroup>
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput placeholder="搜索组件" />
            </InputGroup>
          </div>
        </DemoSection>
        <DemoSection title="InputOTP">
          <InputOTP maxLength={4} onChange={handleOtpChange} value={otp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </DemoSection>
        <DemoSection title="NativeSelect">
          <NativeSelect defaultValue="basic">
            <NativeSelectOption value="basic">基础排版</NativeSelectOption>
            <NativeSelectOption value="compact">紧凑排版</NativeSelectOption>
          </NativeSelect>
        </DemoSection>
        <DemoSection title="RadioGroup">
          <RadioGroup defaultValue="public">
            <label className="components-control-label">
              <RadioGroupItem value="public" /> 公开
            </label>
            <label className="components-control-label">
              <RadioGroupItem value="private" /> 私密
            </label>
          </RadioGroup>
        </DemoSection>
        <DemoSection title="Select">
          <Select defaultValue="light">
            <SelectTrigger>
              <SelectValue placeholder="选择主题" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">light</SelectItem>
              <SelectItem value="dark">dark</SelectItem>
            </SelectContent>
          </Select>
        </DemoSection>
        <DemoSection title="Slider">
          <Slider defaultValue={[45]} max={100} step={5} />
        </DemoSection>
        <DemoSection title="Textarea">
          <Textarea placeholder="输入多行内容" />
        </DemoSection>
        <DemoSection title="Toggle / ToggleGroup">
          <div className="components-demo-row">
            <Toggle defaultPressed>加粗</Toggle>
            <ToggleGroup defaultValue={["left"]} type="multiple">
              <ToggleGroupItem value="left">左</ToggleGroupItem>
              <ToggleGroupItem value="center">中</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </DemoSection>
      </div>
    </div>
  )
}
