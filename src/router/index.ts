import { createRouter, createWebHistory, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import type { App } from 'vue'
import { routes } from 'vue-router/auto-routes'
import { setupLayouts } from 'virtual:generated-layouts'
import i18n, { loadLanguage } from '@/i18n'
import { useAuthStore } from '@/stores'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes as RouteRecordRaw[]),
})

const moduleLoaders = import.meta.glob('../i18n/locales/modules/*/*.ts')
const loadedModuleLocales = new Map<string, Set<string>>()

export async function loadRouteLocales(to: RouteLocationNormalized) {
  const storedLocale = typeof localStorage === 'undefined'
    ? null
    : localStorage.getItem('locale')
  const currentLang = await loadLanguage(storedLocale || i18n.global.locale.value || 'zh-CN')

  const modules = to.meta?.locales
  if (!Array.isArray(modules) || modules.length === 0) {
    return
  }

  const loadedModules = loadedModuleLocales.get(currentLang) ?? new Set<string>()
  for (const moduleName of modules as string[]) {
    if (loadedModules.has(moduleName)) {
      continue
    }

    const loader = moduleLoaders[`../i18n/locales/modules/${currentLang}/${moduleName}.ts`]
    if (!loader) {
      console.warn(`Missing locale module: ${moduleName}`)
      continue
    }

    try {
      const messages = await loader()
      i18n.global.mergeLocaleMessage(currentLang, {
        [moduleName]: (messages as { default: unknown }).default,
      })
      loadedModules.add(moduleName)
    } catch (error) {
      console.warn(`Failed to load locale module: ${moduleName}`, error)
    }
  }

  loadedModuleLocales.set(currentLang, loadedModules)
}

// 路由白名单（不需要认证即可访问的页面）
const whiteList = ['/login']

router.beforeEach(async (to, _from, next) => {
  await loadRouteLocales(to)

  // 获取认证 Store
  const authStore = useAuthStore()

  // 检查是否在白名单中
  const isInWhiteList = whiteList.includes(to.path)

  // 如果已登录且访问登录页，重定向到首页
  if (authStore.isAuthenticated && to.path === '/login') {
    next('/')
    return
  }

  // 如果未登录且不在白名单中，重定向到登录页
  if (!authStore.isAuthenticated && !isInWhiteList) {
    next('/login')
    return
  }

  next()
})

export const installRouter = (app: App) => {
  app.use(router)
}

export default router
