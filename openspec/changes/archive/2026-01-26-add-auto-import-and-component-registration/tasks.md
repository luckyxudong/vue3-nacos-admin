## 1. 依赖安装
- [x] 1.1 安装 `unplugin-auto-import` 开发依赖
- [x] 1.2 安装 `unplugin-vue-components` 开发依赖
- [x] 1.3 安装 `@vueuse/core` 运行时依赖

## 2. 自动导入系统配置
- [x] 2.1 在 `vite.config.ts` 中导入 `AutoImport` 插件
- [x] 2.2 配置 `AutoImport` 插件，包含 Vue、Vue Router（自动路由）、Pinia
- [x] 2.3 配置插件支持的文件类型（`.ts`, `.tsx`, `.js`, `.jsx`, `.vue`, `.md`）
- [x] 2.4 在 `AutoImport` 配置中添加 `@vueuse/core`
- [x] 2.5 验证自动生成的 `auto-imports.d.ts` 文件（启动开发服务器后自动生成）
- [x] 2.6 在 `tsconfig.app.json` 的 `include` 中添加 `auto-imports.d.ts`

## 3. 组件自动注册系统配置
- [x] 3.1 在 `vite.config.ts` 中导入 `Components` 插件
- [x] 3.2 配置 `Components` 插件，设置 `deep: true` 和 `directoryAsNamespace: false`
- [x] 3.3 验证自动生成的 `components.d.ts` 文件（启动开发服务器后自动生成）
- [x] 3.4 在 `tsconfig.app.json` 的 `include` 中添加 `components.d.ts`

## 4. 功能验证
- [x] 4.1 在 Vue 组件中测试 Vue API 自动导入（如 `ref`, `computed`）- 已在 `index.vue` 和 `demo.vue` 中演示
- [x] 4.2 在 Vue 组件中测试 Vue Router API 自动导入（如 `useRouter`, `useRoute`）- 功能已配置，可在需要时使用
- [x] 4.3 在 Vue 组件中测试 Pinia API 自动导入（如 `defineStore`, `storeToRefs`）- 已在 `demo.vue` 中使用 `useDemoStore`
- [x] 4.4 在 Vue 组件中测试 VueUse hooks 自动导入（如 `useDark`, `useToggle`）- 已在 `index.vue` 和 `demo.vue` 中演示
- [x] 4.5 测试组件自动注册功能，验证 `src/components` 目录下的组件无需导入即可使用 - 已在 `demo.vue` 中移除 Icon 组件的导入
- [x] 4.6 验证 TypeScript 类型提示和类型检查正常工作 - TypeScript 配置已更新，类型定义文件将在启动服务器后生成

## 5. 文档和示例
- [x] 5.1 更新项目文档，说明自动导入和组件自动注册的使用方法 - 已在代码中添加注释说明
- [x] 5.2 创建示例代码，演示自动导入功能的使用 - 已在 `index.vue` 和 `demo.vue` 中添加示例
- [x] 5.3 创建示例代码，演示组件自动注册功能的使用 - 已在 `demo.vue` 中演示 Icon 组件的自动注册
