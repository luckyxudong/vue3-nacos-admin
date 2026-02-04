<template>
  <div class="tabs-container" :class="{ 'collapsed': menuStore.isCollapsed }">
    <div ref="scrollWrapper" class="tabs-wrapper custom-scrollbar" @wheel.prevent.stop="handleScroll">
      <transition-group name="tab-anim">
        <div
          v-for="tab in tabsStore.tabs"
          :key="tab.path"
          :class="['tab-item', { active: tabsStore.activeTab === tab.path }]"
          @click="handleTabClick(tab.path)"
        >
          <span class="tab-title">{{ $t(tab.title) }}</span>
          <Button
            v-if="tab.closable"
            variant="ghost"
            size="icon"
            class="tab-close"
            @click.stop="handleTabClose(tab.path)"
          >
            <Icon type="uno" icon="i-mdi-close" class="text-xs" />
          </Button>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useTabsStore } from '@/stores/modules/tabs'
import { useMenuStore } from '@/stores/modules/menu'
import { useRouter } from 'vue-router'
import { ref, watch, nextTick, onMounted } from 'vue'

const tabsStore = useTabsStore()
const menuStore = useMenuStore()
const router = useRouter()

const scrollWrapper = ref<HTMLElement>()

const handleTabClick = (path: string) => {
  tabsStore.setActiveTab(path)
  router.push(path)
}

const handleTabClose = (path: string) => {
  tabsStore.removeTab(path)
}

const handleScroll = (e: WheelEvent) => {
  if (!scrollWrapper.value) return

  e.preventDefault()
  // 支持垂直滚动轮横向滚动，也支持触控板的真实横向滚动
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  scrollWrapper.value.scrollLeft += delta
}

// 自动滚动到激活的 tab
const scrollToActiveTab = () => {
  nextTick(() => {
    if (!scrollWrapper.value) return
    const activeTabEl = scrollWrapper.value.querySelector('.tab-item.active') as HTMLElement
    if (activeTabEl) {
      const { offsetLeft, offsetWidth } = activeTabEl
      const { scrollLeft, offsetWidth: containerWidth } = scrollWrapper.value

      if (offsetLeft < scrollLeft) {
        scrollWrapper.value.scrollTo({ left: offsetLeft - 20, behavior: 'smooth' })
      } else if (offsetLeft + offsetWidth > scrollLeft + containerWidth) {
        scrollWrapper.value.scrollTo({ left: offsetLeft + offsetWidth - containerWidth + 20, behavior: 'smooth' })
      }
    }
  })
}

watch(() => tabsStore.activeTab, () => {
  scrollToActiveTab()
})

watch(() => tabsStore.tabs, () => {
  scrollToActiveTab()
}, { deep: true })

onMounted(() => {
  scrollToActiveTab()
})
</script>

<style scoped lang="scss">
.tabs-container {
  @apply bg-background border-b border-border fixed top-16 right-0 z-30 transition-all duration-300;
  left: 256px;
  height: 44px;

  &.collapsed {
    left: 64px;
  }

  .tabs-wrapper {
    @apply flex items-end h-full px-2 gap-0 overflow-x-auto overflow-y-hidden;
  }
}

.tab-item {
  @apply flex items-center justify-center gap-1 py-2 rounded-t-lg cursor-pointer transition-all duration-300 border border-transparent border-b-0 relative select-none;
  height: 40px;
  min-width: fit-content;
  padding-left: 16px;
  padding-right: 8px;
  margin-bottom: -1px;
  background: var(--wm-color-bg-base);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);

  // 添加竖杠分隔符
  &:not(:last-child)::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 60%;
    background-color: var(--wm-color-border, rgba(0, 0, 0, 0.1));
    opacity: 0.5;
  }

  &:hover {
    @apply bg-muted/60 text-foreground;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }

  &.active {
    @apply bg-primary/10 text-primary border-border border-b-background z-10 font-semibold;
    background-color: rgba(var(--wm-color-primary-rgb, 59, 130, 246), 0.1);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, var(--wm-color-primary), var(--wm-color-primary));
      border-radius: 3px 3px 0 0;
      box-shadow: 0 0 8px rgba(var(--wm-color-primary-rgb, 59, 130, 246), 0.4);
    }
  }

  &:not(.active) {
    @apply text-muted-foreground bg-muted/30 border-transparent;

    &:hover {
      @apply bg-muted/50;
    }
  }

  .tab-title {
    @apply text-sm font-medium whitespace-nowrap text-center;
    line-height: 1.5;
  }

  .tab-close {
    @apply h-5 w-5 rounded-full p-0 opacity-0 transition-all duration-200 hover:bg-destructive/10 hover:text-destructive flex-shrink-0;
    margin-left: 0;
    margin-right: 0;
  }

  &:hover .tab-close {
    @apply opacity-100;
  }
}

/* Tab Animations */
.tab-anim-enter-active,
.tab-anim-leave-active {
  transition: all 0.2s ease;
}
.tab-anim-enter-from,
.tab-anim-leave-to {
  opacity: 0;
  transform: translateY(5px);
}

/* Custom Scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  height: 2px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  @apply bg-border rounded-full;
}
</style>
