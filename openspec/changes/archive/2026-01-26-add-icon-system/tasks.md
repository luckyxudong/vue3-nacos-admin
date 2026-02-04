## 1. 安装依赖

- [x] 1.1 安装 `@iconify/json` 开发依赖
- [x] 1.2 安装 `vite-plugin-svg-icons` 开发依赖
- [x] 1.3 安装 `@iconify/vue` 运行时依赖（可选，用于 Iconify 图标类型）

## 2. UnoCSS 图标配置

- [x] 2.1 在 `uno.config.ts` 中导入 `presetIcons`
- [x] 2.2 配置 `presetIcons` 预设，设置前缀为 `i-`，添加额外样式属性
- [x] 2.3 验证配置是否正确

## 3. 本地 SVG 图标配置

- [x] 3.1 创建 `src/assets/icons/` 目录用于存放本地 SVG 图标
- [x] 3.2 在 `vite.config.ts` 中导入 `createSvgIconsPlugin`
- [x] 3.3 配置 SVG 图标插件，设置图标目录和 symbolId 格式
- [x] 3.4 在 `src/main.ts` 或 `src/plugins/assets.ts` 中导入 `virtual:svg-icons-register`

## 4. Icon 组件实现

- [x] 4.1 创建 `src/components/icon/` 目录
- [x] 4.2 创建 `icon.vue` 组件文件
- [x] 4.3 定义组件 props（type, icon, prefix, fontFamily, fontUrl）
- [x] 4.4 实现 UnoCSS 图标类型渲染逻辑
- [x] 4.5 实现 Iconify 图标类型渲染逻辑
- [x] 4.6 实现本地 SVG 图标类型渲染逻辑
- [x] 4.7 实现 Iconfont 图标类型渲染逻辑（包括动态加载字体文件）
- [x] 4.8 添加组件样式（使用 UnoCSS 工具类）

## 5. 测试验证

- [x] 5.1 在 `demo.vue` 中测试 UnoCSS 图标使用
- [x] 5.2 准备测试用的 SVG 图标文件（如 `demo.svg`）
- [x] 5.3 在 `demo.vue` 中测试本地 SVG 图标使用
- [x] 5.4 在 `demo.vue` 中测试 Icon 组件的四种使用方式
- [x] 5.5 验证图标在不同场景下的显示效果
- [x] 5.6 验证图标样式是否正确应用

## 6. 文档更新

- [x] 6.1 更新项目文档，说明图标系统的使用方法
- [x] 6.2 添加图标使用示例和最佳实践
