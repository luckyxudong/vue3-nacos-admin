<template>
  <header class="header" :class="{ 'collapsed': menuStore.isCollapsed }">
    <div class="header-content">
      <!-- 面包屑导航 -->
      <nav class="breadcrumb">
        <RouterLink to="/" class="breadcrumb-item home-icon">
          <Icon type="uno" icon="i-mdi-home-outline" />
        </RouterLink>
        <template v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
          <Icon type="uno" icon="i-mdi-chevron-right" class="breadcrumb-separator" />
          <RouterLink :to="crumb.path" class="breadcrumb-item" :class="{ 'active': index === breadcrumbs.length - 1 }">
            <span>{{ $t(crumb.title) }}</span>
          </RouterLink>
        </template>
      </nav>

      <!-- 右侧功能区 -->
      <div class="header-actions">
        <!-- 主题切换 -->
        <Button variant="ghost" size="icon" @click="toggleDark()" class="action-btn" :title="$t('layout.toggleTheme')">
          <Icon type="uno" :icon="isDark ? 'i-mdi-weather-night' : 'i-mdi-weather-sunny'" class="text-lg" />
        </Button>

        <!-- 语言切换 -->
        <Button variant="ghost" size="sm" @click="toggleLanguage" class="action-btn language-btn" :title="$t('layout.toggleLanguage')">
          <Icon type="uno" icon="i-mdi-translate" class="text-lg mr-1" />
          <span class="language-text">{{ currentLanguageLabel }}</span>
        </Button>

        <!-- 用户头像 -->
        <div ref="userMenuRef" class="user-menu relative">
          <Button variant="ghost" class="user-avatar-btn flex items-center gap-2 pl-2 pr-1 rounded-full hover:bg-accent" @click="toggleUserMenu">
            <div class="avatar">
              {{ userInitial }}
            </div>
            <span class="username hidden sm:inline-block text-sm font-medium">{{ authStore.user?.username || 'User' }}</span>
            <Icon type="uno" icon="i-mdi-chevron-down" class="text-xs opacity-50" />
          </Button>

          <transition name="fade-scale">
            <div v-if="showUserMenu" class="user-dropdown">
              <div class="dropdown-header">
                <div class="user-name">{{ authStore.user?.username || 'User' }}</div>
                <div class="user-role text-xs text-muted-foreground">Administrator</div>
              </div>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item" @click="handleLogout">
                <Icon type="uno" icon="i-mdi-logout" class="dropdown-icon" />
                <span>{{ $t('layout.logout') }}</span>
              </button>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { loadLanguage } from '@/i18n'
import { useAuthStore } from '@/stores/modules/auth'
import { useMenuStore } from '@/stores/modules/menu'
import { onClickOutside } from '@vueuse/core'

const route = useRoute()
const { locale } = useI18n()
const authStore = useAuthStore()
const menuStore = useMenuStore()

// 主题切换
const isDark = useDark({
  selector: 'html',
  attribute: 'data-theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)

// 语言切换
const currentLanguageLabel = computed(() => {
  return locale.value === 'zh-CN' ? '中文' : 'EN'
})

import { loadRouteLocales } from '@/router'

const toggleLanguage = async () => {
  const newLang = locale.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  await loadLanguage(newLang)
  locale.value = newLang
  // 确保当前路由的模块语言包也被加载
  await loadRouteLocales(route)
}

// 用户菜单
const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement>()

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const closeUserMenu = () => {
  showUserMenu.value = false
}

const userInitial = computed(() => {
  const username = authStore.user?.username || 'U'
  return username.charAt(0).toUpperCase()
})

const handleLogout = () => {
  authStore.logout()
  closeUserMenu()
}

// 点击外部关闭用户菜单
onClickOutside(userMenuRef, closeUserMenu)

// 面包屑导航
const breadcrumbs = computed(() => {
  const crumbs: Array<{ title: string; path: string }> = []
  const pathSegments = route.path.split('/').filter(Boolean)

  let currentPath = ''
  for (const segment of pathSegments) {
    currentPath += `/${segment}`
    const menuItem = menuStore.findMenuItem(currentPath)
    if (menuItem) {
      crumbs.push({ title: menuItem.title, path: currentPath })
    } else {
      // 这里的处理可以优化，如果找不到菜单项，可以尝试格式化路径名
      crumbs.push({ title: segment.charAt(0).toUpperCase() + segment.slice(1), path: currentPath })
    }
  }

  return crumbs
})
</script>

<style scoped lang="scss">
.header {
  @apply bg-background/80 backdrop-blur-md border-b border-border h-16 fixed top-0 right-0 z-40 transition-all duration-300;
  left: 256px;

  &.collapsed {
    left: 64px;
  }

  .header-content {
    @apply flex items-center justify-between h-full px-6;
  }
}

.breadcrumb {
  @apply flex items-center gap-2;

  .breadcrumb-separator {
    @apply text-muted-foreground text-xs;
  }

  .breadcrumb-item {
    @apply text-sm text-muted-foreground hover:text-primary transition-colors flex items-center;

    &.active {
      @apply text-foreground font-medium pointer-events-none;
    }

    &.home-icon {
      @apply text-lg;
    }
  }
}

.header-actions {
  @apply flex items-center gap-3;

  .action-btn {
    @apply hover:bg-accent hover:text-accent-foreground rounded-full transition-colors;
  }

  .user-avatar-btn {
    .avatar {
      @apply w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20;
    }
  }

  .user-dropdown {
    @apply absolute right-0 top-full mt-2 w-56 bg-popover border border-border rounded-lg shadow-md p-1 z-50 transform origin-top-right;

    .dropdown-header {
      @apply px-3 py-2 bg-muted/30 rounded-t-md mb-1;

      .user-name {
        @apply text-sm font-semibold text-foreground;
      }
    }

    .dropdown-divider {
      @apply h-px bg-border my-1;
    }

    .dropdown-item {
      @apply w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-popover-foreground transition-colors hover:bg-accent hover:text-accent-foreground;
      border: none;
      background: none;
      cursor: pointer;

      .dropdown-icon {
        @apply text-base opacity-70;
      }
    }
  }
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
