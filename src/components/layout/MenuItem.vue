<template>
  <li class="menu-item" :class="{ active: isActive, expanded: isExpanded }">
    <!-- Collapsed state with sub-menu: Show items in a DropdownMenu -->
    <DropdownMenu v-if="isCollapsed && level === 0" class="w-full">
      <template #default="{ isOpen, open, close }">
        <DropdownMenuTrigger as-child>
          <div
            class="menu-item-content group"
            :class="{ 'has-children': hasChildren, active: isActive, 'justify-center': isCollapsed }"
            @mouseenter="handleOpen(open)"
            @mouseleave="handleClose(close)"
            @click="handleClick"
          >
            <Icon v-if="iconifyIcon" type="iconify" :icon="iconifyIcon" class="menu-icon group-hover:scale-110 transition-transform duration-200" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          :is-open="isOpen"
          side="right"
          align="start"
          class="menu-popover z-[2000] shadow-xl border-primary/10"
          :class="hasChildren ? 'w-48' : 'w-auto max-w-[200px]'"
          @mouseenter="handleOpen(open)"
          @mouseleave="handleClose(close)"
        >
          <!-- Floating Header/Tooltip -->
          <div
            class="px-3 py-2 text-xs font-bold text-primary uppercase tracking-[0.2em] bg-primary/5 rounded-t-md"
            :class="{ 'mb-1': hasChildren, 'rounded-md': !hasChildren }"
          >
            {{ $t(item.title) }}
          </div>

          <!-- Sub-menu Items -->
          <div v-if="hasChildren" class="px-1 py-1">
            <DropdownMenuItem
              v-for="child in item.children"
              :key="child.path"
              class="flex items-center gap-3 cursor-pointer py-2 px-3 hover:bg-primary/10 rounded-md transition-colors"
              @click="() => { router.push(child.path); close(); }"
            >
              <Icon v-if="convertIconToIconify(child.icon)" type="iconify" :icon="convertIconToIconify(child.icon) || ''" class="text-lg opacity-70" />
              <span class="text-sm font-medium">{{ $t(child.title) }}</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </template>
    </DropdownMenu>

    <!-- Normal state (not collapsed) -->
    <template v-else>
      <div
        class="menu-item-content group"
        :class="{ 'has-children': hasChildren, active: isActive, 'justify-center': isCollapsed }"
        @click="handleClick"
      >
        <Icon v-if="iconifyIcon" type="iconify" :icon="iconifyIcon" class="menu-icon group-hover:scale-110 transition-transform duration-200" />
        <span v-if="!isCollapsed" class="menu-title text-sm transition-opacity duration-200">{{ $t(item.title) }}</span>
        <Icon
          v-if="hasChildren && !isCollapsed"
          type="iconify"
          icon="mdi:chevron-down"
          class="menu-arrow text-base"
          :class="{ 'menu-arrow-expanded': isExpanded }"
        />
      </div>

      <transition name="submenu">
        <div v-show="hasChildren && isExpanded && !isCollapsed" class="submenu-wrapper">
          <ul class="submenu">
            <MenuItem
              v-for="child in item.children"
              :key="child.path"
              :item="child"
              :level="(props.level ?? 0) + 1"
            />
          </ul>
        </div>
      </transition>
    </template>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMenuStore, type MenuItem } from '@/stores/modules/menu'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  item: MenuItem
  level?: number
}>()

const menuStore = useMenuStore()
const router = useRouter()

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

useI18n()

import { convertIconToIconify } from '@/utils/icon'

const iconifyIcon = computed(() => convertIconToIconify(props.item.icon))

let closeTimer: any = null

const handleOpen = (openFn: () => void) => {
  if (closeTimer) {
    clearTimeout(closeTimer)
    closeTimer = null
  }
  openFn()
}

const handleClose = (closeFn: () => void) => {
  closeTimer = setTimeout(() => {
    closeFn()
  }, 200)
}

const hasChildren = computed(() => props.item.children && props.item.children.length > 0)
const isExpanded = computed(() => menuStore.isMenuExpanded(props.item.path))
// 直接使用 menuStore.isMenuActive 判定，支持递归检查
const isActive = computed(() => menuStore.isMenuActive(props.item))
const isCollapsed = computed(() => menuStore.isCollapsed)

const handleClick = () => {
  if (hasChildren.value) {
    if (isCollapsed.value) return
    menuStore.toggleMenu(props.item.path)
  } else {
    router.push(props.item.path)
  }
}
</script>

<style scoped lang="scss">
.menu-item {
  @apply mb-1;
  position: relative;

  .menu-item-content {
    @apply flex items-center gap-3 px-3 py-2 mx-2 rounded-md cursor-pointer;
    color: var(--wm-color-text-regular);
    position: relative;
    // overflow: hidden; // 移除以免裁切子元素（虽然 DropdownMenu 不是子元素但为保险起见）
    background-color: transparent;
    transition: color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: color, background-color;

    &.justify-center {
      @apply px-0 mx-1;
      justify-content: center;
    }

    // 渐变背景层（使用伪元素实现渐变效果）
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        to right,
        var(--wm-color-primary-light-9),
        var(--wm-color-primary-light-8)
      );
      opacity: 0;
      transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      z-index: 0;
      border-radius: inherit;
      pointer-events: none;
      will-change: opacity;
    }

    // 内容层需要在上层
    > * {
      position: relative;
      z-index: 1;
    }

    &:hover:not(.active) {
      background-color: var(--wm-color-primary-light-9);
      color: var(--wm-color-primary);
    }

    &.active {
      color: var(--wm-color-primary);
      font-weight: 500;
      background-color: transparent; // 确保背景透明，让渐变显示

      &::after {
        opacity: 1;
      }

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 16px;
        width: 3px;
        background-color: var(--wm-color-primary);
        border-radius: 0 4px 4px 0;
        transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 2;
        pointer-events: none;
        will-change: opacity, transform;
      }

      &:hover {
        background-color: transparent; // hover 时也保持透明
        &::after {
          opacity: 1;
        }
      }
    }
  }

  // 箭头旋转动画已通过 class 控制，移除这里的样式

  .submenu-wrapper {
    @apply overflow-hidden;
  }

  .menu-arrow {
    will-change: transform;
    transform-origin: center;
    transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: rotate(0deg);

    &.menu-arrow-expanded {
      transform: rotate(180deg);
    }
  }



  .submenu {
    @apply list-none m-0 p-0 mt-1;

    // Indentation for submenu items
    .menu-item-content {
      padding-left: 2.5rem; // Adjust based on level if needed, simpler for now
    }
  }

  .menu-popover {
    position: absolute;
    left: 100%;
    top: 0;
    margin-left: 8px;

    // 鼠标移动“桥梁”：防止鼠标从图标移向弹出框时因为微小间隙导致菜单关闭
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: -12px;
      width: 12px;
      background: transparent;
      z-index: -1;
    }
  }
}

// 二级菜单展开/收起动画 - 优化性能
.submenu-enter-active {
  transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-leave-active {
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.submenu-enter-from {
  opacity: 0;
  transform: translateY(-8px);
}

.submenu-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.submenu-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.submenu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
