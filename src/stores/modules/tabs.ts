import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMenuStore } from './menu'

/**
 * Tab项类型
 */
export interface TabItem {
  title: string
  path: string
  closable: boolean
}

/**
 * Tab管理Store
 * 管理打开的页面列表和激活状态
 */
export const useTabsStore = defineStore(
  'tabs',
  () => {
    const router = useRouter()
    const route = useRoute()
    const menuStore = useMenuStore()

    // Tab列表
    const tabs = ref<TabItem[]>([
      {
        title: 'menu.workbench',
        path: '/',
        closable: false,
      },
    ])

    // 当前激活的Tab路径
    const activeTab = ref<string>('/')

    /**
     * 根据path获取Tab标题
     */
    const getTabTitle = (path: string): string => {
      if (path === '/') {
        return 'menu.workbench'
      }
      // 从菜单配置中查找标题
      const menuItem = menuStore.findMenuItem(path)
      if (menuItem) {
        return menuItem.title
      }
      // 如果找不到，使用路由名称或路径
      return route.name?.toString() || path
    }

    /**
     * 添加Tab
     */
    const addTab = (path: string) => {
      // 排除登录页，登录页不应该出现在 tabs 中
      if (path === '/login') {
        return
      }

      // 检查Tab是否已存在
      const existingTab = tabs.value.find((tab) => tab.path === path)
      if (existingTab) {
        setActiveTab(path)
        return
      }

      // 创建新Tab
      const newTab: TabItem = {
        title: getTabTitle(path),
        path,
        closable: path !== '/',
      }

      tabs.value.push(newTab)
      setActiveTab(path)
    }

    /**
     * 移除Tab
     */
    const removeTab = (path: string) => {
      // 首页不能关闭
      if (path === '/') {
        return
      }

      const index = tabs.value.findIndex((tab) => tab.path === path)
      if (index === -1) {
        return
      }

      tabs.value.splice(index, 1)

      // 如果关闭的是当前激活的Tab，切换到相邻Tab
      if (activeTab.value === path) {
        const newIndex = index > 0 ? index - 1 : 0
        const newActivePath = tabs.value[newIndex]?.path || '/'
        setActiveTab(newActivePath)
        router.push(newActivePath)
      }
    }

    /**
     * 设置激活的Tab
     */
    const setActiveTab = (path: string) => {
      // 如果尝试激活登录页，改为激活首页
      if (path === '/login') {
        activeTab.value = '/'
        return
      }
      activeTab.value = path
    }

    /**
     * 清理不应该存在的Tab（如登录页）
     */
    const cleanupInvalidTabs = () => {
      const loginTabIndex = tabs.value.findIndex((tab) => tab.path === '/login')
      if (loginTabIndex !== -1) {
        tabs.value.splice(loginTabIndex, 1)
        // 如果当前激活的是登录页，切换到首页
        if (activeTab.value === '/login') {
          activeTab.value = '/'
        }
      }
    }

    // 初始化时清理无效的Tab（如从持久化存储恢复时可能包含登录页）
    cleanupInvalidTabs()

    /**
     * 监听路由变化，自动添加Tab
     */
    watch(
      () => route.path,
      (newPath) => {
        addTab(newPath)
        // 确保清理掉可能存在的登录页tab
        cleanupInvalidTabs()
      },
      { immediate: true },
    )

    /**
     * 重置Tab状态到初始值
     */
    const reset = () => {
      tabs.value = [
        {
          title: 'menu.workbench',
          path: '/',
          closable: false,
        },
      ]
      activeTab.value = '/'
    }

    return {
      tabs,
      activeTab,
      addTab,
      removeTab,
      setActiveTab,
      reset,
    }
  },
  {
    persist: {
      pick: ['tabs', 'activeTab'],
    },
  },
)
