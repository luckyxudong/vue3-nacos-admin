<template>
  <div class="layout-default">
    <!-- 左侧菜单 -->
    <Sidebar />

    <!-- 主内容区 -->
    <div class="main-content" :class="{ 'sidebar-collapsed': menuStore.isCollapsed }">
      <!-- 顶部工具栏 -->
      <Header />

      <!-- Tab栏 -->
      <Tabs />

      <!-- 页面内容 -->
      <main class="page-content custom-scrollbar">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :max="20">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
import Tabs from '@/components/layout/Tabs.vue'
import { useMenuStore } from '@/stores/modules/menu'

const menuStore = useMenuStore()
</script>

<style scoped lang="scss">
.layout-default {
  @apply min-h-screen flex;
  background-color: var(--wm-bg-color-page);
}

.main-content {
  @apply flex-1 flex flex-col;
  margin-left: 256px;
  transition: margin-left 0.3s ease-in-out;

  &.sidebar-collapsed {
    margin-left: 64px;
  }
}

.page-content {
  @apply flex-1 overflow-y-auto px-4 pb-4 pt-2;
  margin-top: 104px; // Header(64px) + Tabs(40px)

  /* 页面过渡动画 */
  .fade-transform-enter-active,
  .fade-transform-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
  }

  .fade-transform-enter-from {
    opacity: 0;
    transform: translateX(-10px);
  }

  .fade-transform-leave-to {
    opacity: 0;
    transform: translateX(10px);
  }
}

/* Custom Scrollbar for page content */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-muted-foreground/30 rounded-full;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}
</style>
