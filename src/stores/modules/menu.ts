import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * 菜单项类型
 */
export interface MenuItem {
  title: string
  icon?: string
  path: string
  children?: MenuItem[]
}

/**
 * 菜单配置Store
 * 管理菜单数据结构和展开/折叠状态
 */
export const useMenuStore = defineStore(
  'menu',
  () => {
    // Mock菜单数据
    const menuItems = ref<MenuItem[]>([
      {
        title: 'menu.overview',
        icon: 'i-mdi-view-dashboard',
        path: '/overview',
        children: [
          {
            title: 'menu.workbench',
            icon: 'i-mdi-briefcase',
            path: '/',
          },
          {
            title: 'menu.analysis',
            icon: 'i-mdi-chart-line',
            path: '/overview/analysis',
          },
        ],
      },
      {
        title: 'menu.configManagement',
        icon: 'i-mdi-cog-box',
        path: '/config',
        children: [
          {
            title: 'menu.configList',
            icon: 'i-mdi-format-list-bulleted',
            path: '/config/list',
          },
          {
            title: 'menu.configHistory',
            icon: 'i-mdi-history',
            path: '/config/history',
          },
          {
            title: 'menu.configListen',
            icon: 'i-mdi-ear-hearing',
            path: '/config/listen',
          },
        ],
      },
      {
        title: 'menu.serviceManagement',
        icon: 'i-mdi-server',
        path: '/service',
        children: [
          {
            title: 'menu.serviceList',
            icon: 'i-mdi-format-list-bulleted',
            path: '/service/list',
          },
          {
            title: 'menu.subscriberList',
            icon: 'i-mdi-account-group',
            path: '/service/subscribers',
          },
        ],
      },
      {
        title: 'menu.permissionControl',
        icon: 'i-mdi-shield-account',
        path: '/permission',
        children: [
          {
            title: 'menu.userList',
            icon: 'i-mdi-account',
            path: '/permission/users',
          },
          {
            title: 'menu.roleManagement',
            icon: 'i-mdi-account-key',
            path: '/permission/roles',
          },
          {
            title: 'menu.permissionManagement',
            icon: 'i-mdi-shield-check',
            path: '/permission/permissions',
          },
        ],
      },
      {
        title: 'menu.namespace',
        icon: 'i-mdi-folder-multiple',
        path: '/namespace',
      },
      {
        title: 'menu.clusterManagement',
        icon: 'i-mdi-server-network',
        path: '/cluster',
        children: [
          {
            title: 'menu.nodeList',
            icon: 'i-mdi-server',
            path: '/cluster/nodes',
          },
        ],
      },
      {
        title: 'menu.about',
        icon: 'i-mdi-information',
        path: '/about',
      },
    ])

    // 菜单展开状态（存储展开的菜单path）
    const expandedMenus = ref<string[]>(['/overview'])

    // 侧边栏折叠状态
    const isCollapsed = ref<boolean>(false)

    /**
     * 切换菜单展开/折叠状态
     */
    const toggleMenu = (path: string) => {
      if (!Array.isArray(expandedMenus.value)) {
        expandedMenus.value = ['/overview']
      }
      const index = expandedMenus.value.indexOf(path)
      if (index !== -1) {
        expandedMenus.value.splice(index, 1)
      } else {
        expandedMenus.value.push(path)
      }
    }

    /**
     * 切换侧边栏折叠状态
     */
    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value
    }

    /**
     * 检查菜单是否展开
     */
    const isMenuExpanded = (path: string) => {
      if (!Array.isArray(expandedMenus.value)) {
        expandedMenus.value = ['/overview']
        return false
      }
      return expandedMenus.value.includes(path)
    }

    /**
     * 根据path查找菜单项
     */
    const findMenuItem = (path: string, items: MenuItem[] = menuItems.value): MenuItem | null => {
      for (const item of items) {
        if (item.path === path) {
          return item
        }
        if (item.children) {
          const found = findMenuItem(path, item.children)
          if (found) {
            return found
          }
        }
      }
      return null
    }

    // 在 setup 函数顶层调用 useRoute，确保响应式正确
    const route = useRoute()

    /**
     * 获取当前激活的菜单路径（基于路由）
     */
    const activeMenuPath = computed(() => {
      return route.path
    })

    /**
     * 检查菜单项是否激活
     */
    const isMenuActive = (item: MenuItem): boolean => {
      const currentPath = activeMenuPath.value
      if (item.path === currentPath) {
        return true
      }
      // 检查子菜单
      if (item.children) {
        return item.children.some((child) => isMenuActive(child))
      }
      return false
    }

    /**
     * 重置菜单状态到初始值
     */
    const reset = () => {
      expandedMenus.value = ['/overview']
      isCollapsed.value = false
    }

    return {
      menuItems,
      expandedMenus,
      isCollapsed,
      toggleMenu,
      toggleSidebar,
      isMenuExpanded,
      findMenuItem,
      activeMenuPath,
      isMenuActive,
      reset,
    }
  },
  {
    persist: {
      paths: ['expandedMenus', 'isCollapsed'],
      afterRestore: (ctx) => {
        if (!Array.isArray(ctx.store.expandedMenus)) {
          ctx.store.expandedMenus = ['/overview']
        }
      },
    },
  },
)
