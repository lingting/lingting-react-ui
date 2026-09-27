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

### 安全发布

1. 进入页面 https://www.npmjs.com/package/lingting-react-ui/access
2. 选择 settings -> github actions
3. 填写相关内容
4. 选择 allow npm punlish; 默认用 npm stage publish, 还需要人去后台审核, 输入2fa同意才发布
5. 保存
6. 选择: Require two-factor authentication or a granular access token with bypass 2fa enabled
7. 保存
8. package.json 中配置仓库信息, 确保和步骤3填写的一致

### npm 版本

1. 目前(2026-09-27)npmjs要求npm版本 >=11.5.1; 所以ci中安装了 npm@11.5
2. 当前也有可能是我 setup-node没有用最新版本, 最新版可能预制的就是高npm版本, 不过已经发布成功我就不改了
