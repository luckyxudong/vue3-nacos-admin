<template>
  <Card class="quick-actions-card">
    <CardHeader class="pb-2">
      <CardTitle class="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
        <div class="w-1 h-4 bg-amber-500 rounded-full"></div>
        {{ t('workbench.quickActions.title') }}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <button
          v-for="(action, index) in actions"
          :key="action.label"
          @click="action.handler"
          class="action-card group"
          :style="{ transitionDelay: `${index * 50}ms` }"
        >
          <div class="card-inner">
            <div class="icon-wrapper" :class="action.color">
              <Icon :icon="action.icon" class="text-2xl transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12" />
              <div class="icon-glow" :class="action.color.split(' ')[1]"></div>
            </div>
            <div class="text-center space-y-1">
              <span class="block text-sm font-bold tracking-tight text-foreground/80 group-hover:text-primary transition-colors">
                {{ action.label }}
              </span>
              <span class="block text-xs text-muted-foreground/50 font-medium group-hover:text-muted-foreground transition-colors uppercase tracking-widest">
                Go to page
              </span>
            </div>
          </div>
          <div class="card-glow" :class="action.color.split(' ')[1]"></div>
        </button>
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const { t } = useI18n()
const router = useRouter()

const actions = computed(() => [
  {
    label: t('workbench.quickActions.configList'),
    icon: 'mdi:format-list-bulleted-type',
    color: 'bg-blue-500/5 text-blue-500',
    handler: () => router.push('/config/list')
  },
  {
    label: t('workbench.quickActions.serviceList'),
    icon: 'mdi:server-network',
    color: 'bg-emerald-500/5 text-emerald-500',
    handler: () => router.push('/service/list')
  },
  {
    label: t('workbench.quickActions.addNamespace'),
    icon: 'mdi:domain',
    color: 'bg-purple-500/5 text-purple-500',
    handler: () => router.push('/namespace')
  },
  {
    label: t('workbench.quickActions.clusterNode'),
    icon: 'mdi:hub-outline',
    color: 'bg-amber-500/5 text-amber-500',
    handler: () => router.push('/cluster/nodes')
  }
])
</script>

<style scoped lang="scss">
.quick-actions-card {
  @apply border border-border/40 shadow-sm bg-background/20 backdrop-blur-xl rounded-3xl overflow-hidden;
  @apply dark:bg-card/40 dark:border-white/5;
}

.action-card {
  @apply relative p-[1px] rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2;

  .card-inner {
    @apply relative z-10 flex flex-col items-center gap-4 p-6 rounded-[15px] bg-background/40 backdrop-blur-md border border-border/20 transition-all duration-500 group-hover:bg-background/60 group-hover:border-primary/20;
    @apply dark:bg-slate-900/40 dark:group-hover:bg-slate-900/60 dark:border-white/5;
  }

  .icon-wrapper {
    @apply relative w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:shadow-lg;

    .icon-glow {
      @apply absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-40;
      background-color: currentColor;
    }
  }

  .card-glow {
    @apply absolute inset-0 opacity-0 blur-2xl transition-opacity duration-500 -z-0 pointer-events-none;
    background: radial-gradient(circle at center, currentColor 0%, transparent 70%);
    &.text-blue-500 { color: theme('colors.blue.400'); }
    &.text-emerald-500 { color: theme('colors.emerald.400'); }
    &.text-purple-500 { color: theme('colors.purple.400'); }
    &.text-amber-500 { color: theme('colors.amber.400'); }
  }

  &:hover .card-glow {
    @apply opacity-20;
  }
}
</style>
