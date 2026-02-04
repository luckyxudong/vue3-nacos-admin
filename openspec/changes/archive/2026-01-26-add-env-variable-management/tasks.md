## 1. 环境变量类型定义
- [x] 1.1 在 `env.d.ts` 中添加 `ImportMetaEnv` 接口定义
- [x] 1.2 添加 `ImportMeta` 接口扩展，包含 `env` 属性
- [x] 1.3 验证 TypeScript 类型提示正常工作

## 2. 环境变量工具类实现
- [x] 2.1 创建 `src/utils/env.ts` 文件
- [x] 2.2 实现 `Env.get()` 方法，支持获取字符串类型环境变量
- [x] 2.3 实现 `Env.getNumber()` 方法，支持获取数字类型环境变量
- [x] 2.4 实现 `Env.getBoolean()` 方法，支持获取布尔类型环境变量
- [x] 2.5 实现 `Env.env` 只读属性，返回当前环境（'dev' | 'uat' | 'prod'）
- [x] 2.6 实现 `Env.isDev`、`Env.isUat`、`Env.isProd` 只读属性，用于环境判断
- [x] 2.7 添加 JSDoc 注释，说明每个方法的用途和参数

## 3. 多环境模式支持
- [x] 3.1 在 `package.json` 中添加 `dev:dev` 脚本（`vite --mode dev`）
- [x] 3.2 在 `package.json` 中添加 `dev:uat` 脚本（`vite --mode uat`）
- [x] 3.3 在 `package.json` 中添加 `build:dev` 脚本（`run-p type-check "build-only {@} --mode dev" --`）
- [x] 3.4 在 `package.json` 中添加 `build:uat` 脚本（`run-p type-check "build-only {@} --mode uat" --`）
- [x] 3.5 在 `package.json` 中添加 `build:prod` 脚本（`run-p type-check "build-only {@} --mode prod" --`）

## 4. 环境变量文件配置
- [x] 4.1 创建 `.env` 文件示例（包含基础环境变量）
- [x] 4.2 创建 `.env.dev` 文件示例（开发环境配置）
- [x] 4.3 创建 `.env.uat` 文件示例（UAT 环境配置）
- [x] 4.4 创建 `.env.prod` 文件示例（生产环境配置）
- [x] 4.5 验证 `.env.local` 和 `.env.[mode].local` 文件优先级（确保已在 `.gitignore` 中忽略）

## 5. vite.config.ts 环境变量支持
- [x] 5.1 在 `vite.config.ts` 中导入 `loadEnv` 函数
- [x] 5.2 将 `defineConfig` 改为函数形式，接收 `{ mode }` 参数
- [x] 5.3 使用 `loadEnv(mode, process.cwd(), 'VITE_')` 加载环境变量
- [x] 5.4 验证在配置文件中可以访问环境变量

## 6. 功能验证
- [x] 6.1 测试 `Env.get()` 方法获取字符串类型环境变量
- [x] 6.2 测试 `Env.getNumber()` 方法获取数字类型环境变量
- [x] 6.3 测试 `Env.getBoolean()` 方法获取布尔类型环境变量
- [x] 6.4 测试 `Env.env` 属性返回正确的环境值
- [x] 6.5 测试 `Env.isDev`、`Env.isUat`、`Env.isProd` 属性正确判断环境
- [x] 6.6 测试不同模式下的环境变量加载（dev、uat、prod）
- [x] 6.7 测试环境变量文件优先级（`.env.[mode].local` > `.env.[mode]` > `.env.local` > `.env`）
- [x] 6.8 验证 TypeScript 类型提示和类型检查正常工作

## 7. 文档和示例
- [x] 7.1 在代码中添加注释，说明环境变量工具类的使用方法
- [x] 7.2 创建示例代码，演示环境变量的使用（可在现有页面中添加示例）
- [x] 7.3 更新项目文档，说明环境变量管理系统的使用方法
