<template>
  <Card class="stat-card group">
    <div class="absolute inset-0 bg-gradient-to-br transition-opacity duration-300 opacity-0 group-hover:opacity-[0.03]" :class="gradientClass"></div>
    <CardContent class="p-6 relative z-10">
      <div class="flex items-start justify-between">
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div
              class="w-1.5 h-1.5 rounded-full shadow-[0_0_8px] transition-all duration-300 group-hover:scale-150"
              :class="variantColorClass"
            ></div>
            <p class="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80 transition-colors group-hover:text-foreground">
              {{ title }}
            </p>
          </div>

          <div class="flex items-baseline gap-2">
            <h3 class="text-4xl font-black tracking-tighter transition-transform duration-500 group-hover:translate-x-1 origin-left">
              {{ value }}
            </h3>
            <span v-if="unit" class="text-xs font-bold text-muted-foreground/60">{{ unit }}</span>
          </div>
        </div>

        <div
          class="p-4 rounded-2xl transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 shadow-sm"
          :class="[iconBgClass, iconColorClass, iconShadowClass]"
        >
          <Icon :icon="icon" class="text-3xl" />
        </div>
      </div>

      <!-- Subtle Decorative Line -->
      <div class="mt-8 h-[2px] w-full bg-muted/20 rounded-full overflow-hidden">
        <div
          class="h-full transition-all duration-1000 ease-out"
          :class="variantBgClass"
          :style="{ width: '100%', transform: 'translateX(-100%)' }"
        ></div>
      </div>
    </CardContent>
    <!-- Hidden bar that animates on hover -->
    <div
      class="absolute bottom-0 left-0 h-1 transition-all duration-500 w-0 group-hover:w-full"
      :class="variantBgClass"
    ></div>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  unit?: string
  icon: string
  variant?: 'primary' | 'success' | 'warning' | 'info'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary'
})

const iconBgClass = computed(() => {
  const map = {
    primary: 'bg-primary/10',
    success: 'bg-emerald-500/10',
    warning: 'bg-amber-500/10',
    info: 'bg-sky-500/10'
  }
  return map[props.variant]
})

const iconColorClass = computed(() => {
  const map = {
    primary: 'text-primary',
    success: 'text-emerald-500',
    warning: 'text-amber-500',
    info: 'text-sky-500'
  }
  return map[props.variant]
})

const iconShadowClass = computed(() => {
  const map = {
    primary: 'group-hover:shadow-primary/20',
    success: 'group-hover:shadow-emerald-500/20',
    warning: 'group-hover:shadow-amber-500/20',
    info: 'group-hover:shadow-sky-500/20'
  }
  return map[props.variant]
})

const gradientClass = computed(() => {
  const map = {
    primary: 'from-primary to-transparent',
    success: 'from-emerald-500 to-transparent',
    warning: 'from-amber-500 to-transparent',
    info: 'from-sky-500 to-transparent'
  }
  return map[props.variant]
})

const variantColorClass = computed(() => {
  const map = {
    primary: 'bg-primary shadow-primary/50',
    success: 'bg-emerald-500 shadow-emerald-500/50',
    warning: 'bg-amber-500 shadow-amber-500/50',
    info: 'bg-sky-500 shadow-sky-500/50'
  }
  return map[props.variant]
})

const variantBgClass = computed(() => {
  const map = {
    primary: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    info: 'bg-sky-500'
  }
  return map[props.variant]
})
</script>

<style scoped lang="scss">
.stat-card {
  @apply border border-border/40 shadow-sm transition-all duration-500 rounded-3xl overflow-hidden bg-background/40 backdrop-blur-xl relative;

  // Dark mode specific adjustments for better contrast
  @apply dark:bg-card/60 dark:border-white/5;

  &:hover {
    @apply -translate-y-2 border-primary/20 shadow-2xl;
    @apply dark:border-primary/40 dark:shadow-primary/10;
    box-shadow: 0 20px 40px -20px rgba(0,0,0,0.1);

    .h-full {
      transform: translateX(0) !important;
    }
  }
}
</style>
