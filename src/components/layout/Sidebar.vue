<template>
  <aside :class="['sidebar', { collapsed: menuStore.isCollapsed }]">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon-wrapper">
          <Icon type="iconify" icon="mdi:view-dashboard" class="logo-icon" />
        </div>
        <span v-show="!menuStore.isCollapsed" class="logo-text transition-opacity duration-300">{{ $t('layout.appName') }}</span>
      </div>
    </div>



    <nav class="sidebar-nav custom-scrollbar">
      <ul class="menu-list">
        <MenuItem
          v-for="item in menuStore.menuItems"
          :key="item.path"
          :item="item"
          :level="0"
        />
      </ul>
    </nav>

    <div class="sidebar-footer">
      <Button
        variant="ghost"
        size="icon"
        class="collapse-btn w-full flex justify-center hover:bg-slate-100 dark:hover:bg-slate-800"
        @click="menuStore.toggleSidebar"
      >
        <Icon type="iconify" :icon="menuStore.isCollapsed ? 'mdi:chevron-right' : 'mdi:chevron-left'" />
      </Button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/modules/menu'
import MenuItem from './MenuItem.vue'

const menuStore = useMenuStore()
</script>

<style scoped lang="scss">
.sidebar {
  @apply w-64 bg-background border-r border-border transition-all duration-300 ease-in-out shadow-sm;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;

  &.collapsed {
    @apply w-16;

    .sidebar-header {
      @apply px-0 justify-center;
    }

    .logo {
      @apply gap-0 justify-center w-full;
    }
  }
}

.sidebar-header {
  @apply flex items-center h-16 px-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60;

  .logo {
    @apply flex items-center gap-3 overflow-hidden whitespace-nowrap;

    .logo-icon-wrapper {
      @apply flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary;
    }

    .logo-icon {
      @apply text-xl;
    }

    .logo-text {
      @apply text-lg font-bold text-foreground tracking-tight;
    }
  }
}

.sidebar-nav {
  @apply flex-1 py-4;
  overflow-y: auto;
  overflow-x: visible;

  .sidebar.collapsed & {
    overflow: visible;
  }
}

.sidebar-footer {
  @apply p-2 border-t border-border;
}

.menu-list {
  @apply list-none m-0 p-0;
}



/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-muted rounded-full;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  @apply bg-muted-foreground/50;
}
</style>
