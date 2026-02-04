<template>
  <div class="index-page">
    <!-- Background Decor -->
    <div class="decor-blob blob-1"></div>
    <div class="decor-blob blob-2"></div>

    <!-- Header Greeting -->
    <div class="relative mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <GoodMorningCard />
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 relative z-10">
      <StatCard
        v-for="(stat, index) in statItems"
        :key="stat.title"
        v-bind="stat"
        class="animate-in fade-in slide-in-from-bottom-6 duration-700"
        :style="{ animationDelay: `${index * 100}ms` }"
      />
    </div>

    <!-- Content Lower Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
      <!-- Quick Actions -->
      <div class="lg:col-span-8 animate-in fade-in slide-in-from-left-8 duration-1000">
        <QuickActions />
      </div>

      <!-- System Status -->
      <div class="lg:col-span-4 animate-in fade-in slide-in-from-right-8 duration-1000">
        <Card class="system-info-card group">
          <CardHeader class="pb-2">
            <CardTitle class="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
              <div class="w-1 h-4 bg-primary rounded-full"></div>
              {{ t('workbench.systemInfo.title') }}
            </CardTitle>
          </CardHeader>
          <CardContent class="pt-4 space-y-6">
            <div
              v-for="item in systemItems"
              :key="item.label"
              class="system-row transition-all duration-300 hover:translate-x-1"
            >
              <div class="flex flex-col gap-1">
                <span class="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">{{ item.label }}</span>
                <div class="flex items-center gap-2">
                  <Icon :icon="item.icon" class="text-primary text-lg" />
                  <component
                    :is="item.isBadge ? 'Badge' : 'span'"
                    v-bind="item.badgeProps"
                    :class="item.class"
                  >
                    {{ item.value }}
                  </component>
                </div>
              </div>
            </div>
          </CardContent>
          <!-- Decorative icon for system status -->
          <div class="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:opacity-20 transition-opacity duration-500">
            <Icon icon="mdi:server-security" class="text-8xl text-primary" />
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StatCard from '@/components/workbench/StatCard.vue'
import QuickActions from '@/components/workbench/QuickActions.vue'
import { namespaceService } from '@/services/namespace/namespace-service'
import { serviceService } from '@/services/service/service-service'
import { clusterService } from '@/services/cluster/cluster-service'
import { systemService } from '@/services/system/system-service'
import type { SystemState } from '@/services/system/system-service'

const { t } = useI18n()

const stats = ref({
  configCount: 0,
  namespaceCount: 0,
  serviceCount: 0,
  nodeCount: 0
})

const systemState = ref<SystemState>({})

const statItems = computed(() => [
  {
    title: t('workbench.stats.configCount'),
    value: stats.value.configCount,
    icon: 'mdi:file-cog-outline',
    variant: 'primary' as const
  },
  {
    title: t('workbench.stats.namespaceCount'),
    value: stats.value.namespaceCount,
    icon: 'mdi:domain',
    variant: 'info' as const
  },
  {
    title: t('workbench.stats.serviceCount'),
    value: stats.value.serviceCount,
    icon: 'mdi:server-network-outline',
    variant: 'success' as const
  },
  {
    title: t('workbench.stats.nodeCount'),
    value: stats.value.nodeCount,
    icon: 'mdi:hub-outline',
    variant: 'warning' as const
  }
])

const systemItems = computed(() => [
  {
    label: t('workbench.systemInfo.version'),
    value: systemState.value.version || '-',
    icon: 'mdi:tag-outline',
    isBadge: true,
    badgeProps: { variant: 'secondary' },
    class: 'font-mono text-xs'
  },
  {
    label: t('workbench.systemInfo.startupMode'),
    value: systemState.value.startup_mode || '-',
    icon: 'mdi:power-cycle',
    class: 'text-sm font-black tracking-tight'
  },
  {
    label: t('workbench.systemInfo.authEnabled'),
    value: systemState.value.auth_enabled === 'true' ? t('workbench.systemInfo.enabled') : t('workbench.systemInfo.disabled'),
    icon: 'mdi:shield-check-outline',
    isBadge: true,
    class: `px-3 py-1 rounded-full border-transparent font-bold text-xs shadow-sm ${
      systemState.value.auth_enabled === 'true' ? 'bg-primary text-primary-foreground' : 'bg-destructive text-destructive-foreground'
    }`
  },
  {
    label: t('workbench.systemInfo.functionMode'),
    value: systemState.value.function_mode || '-',
    icon: 'mdi:cog-box',
    class: 'text-sm font-medium opacity-80'
  }
])

const fetchStats = async () => {
  const results = await Promise.allSettled([
    namespaceService.getList(),
    serviceService.getList({ pageNo: 1, pageSize: 1 }),
    clusterService.getNodeList({}),
    systemService.getState()
  ])

  if (results[0].status === 'fulfilled') {
    const namespaces = (results[0].value as any) || []
    stats.value.namespaceCount = Array.isArray(namespaces) ? namespaces.length : 0
    stats.value.configCount = Array.isArray(namespaces)
      ? namespaces.reduce((sum: number, ns: any) => sum + (ns.configCount || 0), 0)
      : 0
  }

  if (results[1].status === 'fulfilled') {
    stats.value.serviceCount = (results[1].value as any)?.count || 0
  }

  if (results[2].status === 'fulfilled') {
    const nodes = results[2].value
    stats.value.nodeCount = Array.isArray(nodes) ? nodes.length : (nodes as any).count || 0
  }

  if (results[3].status === 'fulfilled') {
    systemState.value = results[3].value
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped lang="scss">
.index-page {
  @apply max-w-7xl mx-auto p-8 min-h-screen relative overflow-hidden;

  .decor-blob {
    @apply absolute blur-[120px] rounded-full opacity-20 pointer-events-none transition-opacity duration-1000;
    @apply dark:opacity-[0.1];

    &.blob-1 {
      @apply w-[400px] h-[400px] -top-20 -left-20 bg-primary/30;
    }
    &.blob-2 {
      @apply w-[300px] h-[300px] top-1/2 -right-20 bg-amber-500/20;
    }
  }
}

.system-info-card {
  @apply relative border border-border/40 shadow-sm bg-background/40 backdrop-blur-xl rounded-3xl overflow-hidden h-full transition-all duration-500 hover:shadow-2xl hover:-translate-y-2;
  @apply dark:bg-card/40 dark:border-white/5;

  .system-row {
    @apply relative border-l-2 border-transparent pl-4 hover:border-primary/40;
  }
}
</style>
