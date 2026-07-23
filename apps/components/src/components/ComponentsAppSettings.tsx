import {
  type Theme,
  type TypographyVariant,
  useTheme,
  useTypography,
} from "lingting-react-ui"
import {
  Button,
  Label,
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "lingting-react-ui/shadcn"
import { PaletteIcon, TypeIcon } from "lucide-react"

const themes: readonly Theme[] = [
  "light",
  "dark",
  "desktop-light",
  "desktop-dark",
]
const typographies: readonly TypographyVariant[] = [
  "basic",
  "compact",
  "spacious",
]

export function ComponentsAppSettings() {
  const { persist, setPersist, setTheme, theme } = useTheme()
  const {
    persist: typographyPersist,
    setPersist: setTypographyPersist,
    setTypography,
    typography,
  } = useTypography()
  const handleThemePersistChange = (checked: boolean) => setPersist(checked)
  const handleTypographyPersistChange = (checked: boolean) =>
    setTypographyPersist(checked)

  return (
    <div className="components-settings">
      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button aria-label="主题设置" size="icon-sm" variant="ghost">
                <PaletteIcon aria-hidden="true" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>主题设置</TooltipContent>
        </Tooltip>
        <PopoverContent align="end" className="components-settings__panel">
          <PopoverHeader>
            <PopoverTitle>主题</PopoverTitle>
          </PopoverHeader>
          <div className="components-settings__options">
            {themes.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={theme === item ? "secondary" : "outline"}
                onClick={() => setTheme(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <Label className="components-settings__persist">
            <span>记住主题选择</span>
            <Switch
              checked={persist}
              onCheckedChange={handleThemePersistChange}
            />
          </Label>
        </PopoverContent>
      </Popover>

      <Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button aria-label="排版设置" size="icon-sm" variant="ghost">
                <TypeIcon aria-hidden="true" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>排版设置</TooltipContent>
        </Tooltip>
        <PopoverContent align="end" className="components-settings__panel">
          <PopoverHeader>
            <PopoverTitle>排版</PopoverTitle>
          </PopoverHeader>
          <div className="components-settings__options">
            {typographies.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={typography === item ? "secondary" : "outline"}
                onClick={() => setTypography(item)}
              >
                {item}
              </Button>
            ))}
          </div>
          <Label className="components-settings__persist">
            <span>记住排版选择</span>
            <Switch
              checked={typographyPersist}
              onCheckedChange={handleTypographyPersistChange}
            />
          </Label>
        </PopoverContent>
      </Popover>
    </div>
  )
}
