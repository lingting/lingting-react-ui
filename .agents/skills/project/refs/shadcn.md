# shadcn/ui 约束

## 原始组件保护

`src/components/shadcn/ui/` 中的 shadcn 生成组件属于原始组件。默认不得直接修改、删除、改名或移动其文件、React 组件名称、export
名称和既有导入约定。

需要修改原始组件时，先说明并获得用户明确授权：

```text
需要修改 shadcn 组件：

文件：
src/components/shadcn/ui/<component>.tsx

原因：
<当前能力为何无法满足需求>

改动概要：
1. <改动一>
2. <改动二>
3. 保持原有 API 兼容。

影响：
<受影响的现有组件或使用方>

是否授权修改？
```

修改全局样式而影响组件行为、修改 Tailwind 配置、升级 shadcn 相关依赖，也必须先获得确认：

```text
检测到该操作可能影响已有组件。

操作：
<操作内容>

风险：
<影响说明>

预计改动：
<改动范围>

是否继续？
```

## 扩展顺序

在修改 shadcn 原始组件前，依次优先：在 `src/components/` 创建语义明确的组件封装；使用原组件已有 props、variant
或组合能力；为独立能力新增组件。业务能力按 `refs/component-design.md` 放入 `src/pro/`，不得污染 shadcn 原始组件目录。

业务化命名必须存在于新组件中，不得将 `button.tsx` 改为 `app-button.tsx`，也不得将 `Button` 改为业务名称。名称冲突处理规则见
`refs/naming.md`。

## 当前路径兼容性

源码中的 shadcn 原始组件位于 `src/components/shadcn/ui/`，聚合子入口为 `lingting-react-ui/shadcn`
。保留现有路径与入口兼容性；新增业务组件不得进入该子入口。
