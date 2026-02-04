## ADDED Requirements

### Requirement: UnoCSS 图标支持
系统 SHALL 支持通过 UnoCSS 类名使用 Iconify 图标库中的图标。

#### Scenario: 使用 UnoCSS 图标类名
- **WHEN** 开发者在模板中使用 `i-` 前缀的类名（如 `i-ph-anchor-simple-thin`）
- **THEN** 系统应渲染对应的 Iconify 图标
- **AND** 图标应具有 `inline-block` 和 `vertical-align: middle` 的默认样式

#### Scenario: 图标样式自定义
- **WHEN** 开发者为图标元素添加 UnoCSS 工具类（如 `text-orange-400`, `text-3xl`）
- **THEN** 图标应应用相应的样式
- **AND** 支持响应式样式（如 `dark:i-carbon-moon`）
- **AND** 支持交互样式（如 `hover:i-twemoji-face-with-tears-of-joy`）

### Requirement: 本地 SVG 图标支持
系统 SHALL 支持使用本地 SVG 图标文件，通过 SVG sprite 方式渲染。

#### Scenario: 使用本地 SVG 图标
- **WHEN** 开发者在 `src/assets/icons/` 目录下放置 SVG 文件（如 `demo.svg`）
- **THEN** 系统应自动注册该图标
- **AND** 开发者可以通过 `<use href="#icon-demo">` 方式使用该图标
- **AND** 图标 symbolId 格式应与配置的格式一致（默认：`icon-[dir]-[name]`）

#### Scenario: SVG 图标样式控制
- **WHEN** 开发者使用本地 SVG 图标
- **THEN** 可以通过 `fill` 属性控制图标颜色（默认使用 `currentColor`）
- **AND** 可以通过 CSS 类控制图标大小和样式

### Requirement: Icon 组件
系统 SHALL 提供一个统一的 Icon 组件，支持四种图标使用方式：UnoCSS 图标、Iconify 图标、本地 SVG 图标、Iconfont 图标。

#### Scenario: 使用 UnoCSS 类型图标
- **WHEN** 开发者使用 `<Icon type="uno" icon="i-mdi:user" />`
- **THEN** 组件应渲染对应的 UnoCSS 图标
- **AND** 图标类名应与 `icon` prop 的值一致

#### Scenario: 使用 Iconify 类型图标
- **WHEN** 开发者使用 `<Icon type="iconify" icon="mdi:user" />`
- **THEN** 组件应使用 `@iconify/vue` 组件渲染图标
- **AND** 图标应具有默认的样式类（`inline-block`, `align-mid`, `text-xl`）

#### Scenario: 使用本地 SVG 类型图标
- **WHEN** 开发者使用 `<Icon type="svg" icon="demo" />`
- **THEN** 组件应渲染本地 SVG 图标
- **AND** symbolId 应根据 `prefix` prop（默认：`icon`）和 `icon` prop 生成（格式：`#${prefix}-${icon}`）
- **AND** 图标应使用 `currentColor` 作为默认填充色

#### Scenario: 使用 Iconfont 类型图标
- **WHEN** 开发者使用 `<Icon type="iconfont" icon="mobile-alt" />`
- **THEN** 组件应渲染 Iconfont 图标
- **AND** 如果提供了 `fontUrl` prop，组件应在挂载前动态加载字体文件
- **AND** 图标类名应根据 `fontFamily`（默认：`iconfont`）和 `prefix`（默认：`icon`）生成（格式：`${fontFamily} ${prefix}-${icon}`）
- **AND** 如果字体文件已存在，不应重复加载

#### Scenario: Icon 组件默认值
- **WHEN** 开发者使用 `<Icon icon="mdi:user" />`（未指定 type）
- **THEN** 组件应默认使用 `iconify` 类型
- **AND** `prefix` 默认值应为 `icon`
- **AND** `fontFamily` 默认值应为 `iconfont`

#### Scenario: Icon 组件样式支持
- **WHEN** 开发者为 Icon 组件添加类名或样式属性
- **THEN** 组件应正确应用这些样式
- **AND** 支持 UnoCSS 工具类（如 `size-8`, `text-primary`）

### Requirement: 图标系统配置
系统 SHALL 提供配置选项以支持图标系统的自定义设置。

#### Scenario: UnoCSS 图标配置
- **WHEN** 开发者在 `uno.config.ts` 中配置 `presetIcons`
- **THEN** 系统应使用配置的前缀（默认：`i-`）
- **AND** 系统应应用配置的额外样式属性（`display: inline-block`, `vertical-align: middle`）

#### Scenario: SVG 图标配置
- **WHEN** 开发者在 `vite.config.ts` 中配置 `createSvgIconsPlugin`
- **THEN** 系统应使用配置的图标目录（默认：`src/assets/icons`）
- **AND** 系统应使用配置的 symbolId 格式（默认：`icon-[dir]-[name]`）
- **AND** 系统应在应用启动时自动注册所有 SVG 图标
