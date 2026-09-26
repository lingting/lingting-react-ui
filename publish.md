## 发布文档

- npmjs 现在在推他们的 安全发布 .
- 但是, 你要先发布一次才能设置 安全发布. wtm

### 使用token发布

- 每次发布前临时生成一个token, npmjs 不让生成无限时长的token

```shell
# 设置token到环境变量 NODE_AUTH_TOKEN
env | grep '^NODE_AUTH_TOKEN=' | sed 's/=.*/=***已设置***/'
# 执行命令验证 token 是否有效
npm whoami --registry=https://registry.npmjs.org/
# 确认包名和版本
npm pkg get name version --registry=https://registry.npmjs.org/
# 构建
pnpm install && pnpm build
# 模拟发布, 确认发布的内容是否正确
npm pack --dry-run --registry=https://registry.npmjs.org/
# 发布
npm publish --registry=https://registry.npmjs.org/ --access public
# 验证
npm view lingting-react-ui version --registry=https://registry.npmjs.org/
```
