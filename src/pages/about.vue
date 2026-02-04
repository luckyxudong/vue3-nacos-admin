<template>
  <div class="about-page">
    <!-- Background Decor -->
    <div class="decor-blob blob-1"></div>
    <div class="decor-blob blob-2"></div>

    <!-- Hero Section -->
    <div class="hero-section relative z-10 mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div class="flex flex-col items-center text-center space-y-6">
        <div class="logo-wrapper p-4 rounded-3xl bg-primary/10 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/20">
          <Icon icon="mdi:alpha-n-circle-outline" class="text-7xl text-primary animate-pulse-slow" />
        </div>
        <div class="space-y-2">
          <h1 class="text-5xl font-black tracking-tighter bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent italic">
            NOVA ADMIN
          </h1>
          <p class="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {{ t('workbench.about.description') }}
          </p>
        </div>
        <div class="flex gap-4">
          <Badge variant="outline" class="px-4 py-1 rounded-full border-primary/20 bg-primary/5 text-primary">v2.4.3-Alpha</Badge>
          <Badge variant="outline" class="px-4 py-1 rounded-full border-emerald-500/20 bg-emerald-500/5 text-emerald-500">Stable Build</Badge>
        </div>
      </div>
    </div>

    <!-- Grid Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

      <!-- Tech Stack -->
      <Card class="lg:col-span-8 glass-card animate-in fade-in slide-in-from-left-8 duration-1000">
        <CardHeader>
          <CardTitle class="text-[14px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <div class="w-1 h-4 bg-primary rounded-full"></div>
            {{ t('workbench.about.techStack') }}
          </CardTitle>
          <CardDescription>{{ t('workbench.about.techDescription') }}</CardDescription>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
            <div v-for="tech in techStack" :key="tech.name" class="tech-item group">
              <div class="tech-icon-box bg-background/40 border border-border/40 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all duration-300">
                <Icon :icon="tech.icon" class="text-3xl text-muted-foreground group-hover:text-primary group-hover:scale-125 transition-all duration-300" />
              </div>
              <span class="text-xs font-bold tracking-tight text-center">{{ tech.name }}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- System Info -->
      <Card class="lg:col-span-4 glass-card animate-in fade-in slide-in-from-right-8 duration-1000">
        <CardHeader>
          <CardTitle class="text-[14px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <div class="w-1 h-4 bg-amber-500 rounded-full"></div>
            {{ t('workbench.about.systemInfo') }}
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-6 pt-4">
          <div v-for="info in systemInfo" :key="info.label" class="info-row">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-bold text-muted-foreground/40 uppercase tracking-widest">{{ info.label }}</span>
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-primary/60"></div>
                <span class="text-sm font-mono tracking-tight">{{ info.value }}</span>
              </div>
            </div>
          </div>
          <div class="pt-4 border-t border-border/20">
            <p class="text-xs text-muted-foreground/60 italic">{{ t('workbench.about.builtWith') }}</p>
          </div>
        </CardContent>
      </Card>

      <!-- Features -->
      <Card class="lg:col-span-12 glass-card animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <CardHeader>
          <CardTitle class="text-[14px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 flex items-center gap-2">
            <div class="w-1 h-4 bg-emerald-500 rounded-full"></div>
            {{ t('workbench.about.features') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8 pt-4">
            <div v-for="feature in features" :key="feature.title" class="feature-item p-6 rounded-3xl bg-background/30 border border-border/20 hover:border-emerald-500/20 hover:bg-emerald-500/[0.02] transition-all duration-500">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4">
                <Icon :icon="feature.icon" class="text-3xl" />
              </div>
              <h4 class="text-sm font-black tracking-tight mb-2">{{ feature.title }}</h4>
              <p class="text-xs text-muted-foreground leading-relaxed">{{ feature.description }}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const techStack = [
  { name: 'Vue 3', icon: 'logos:vue' },
  { name: 'Vite', icon: 'logos:vitejs' },
  { name: 'TypeScript', icon: 'logos:typescript-icon' },
  { name: 'Tailwind CSS', icon: 'logos:tailwindcss-icon' },
  { name: 'Pinia', icon: 'logos:pinia' },
  { name: 'Shadcn UI', icon: 'simple-icons:shadcnui' },
  { name: 'Lucide Icons', icon: 'logos:lucide' },
  { name: 'Iconify', icon: 'simple-icons:iconify' }
]

const features = [
  {
    title: t('workbench.about.featureConfig'),
    description: t('workbench.about.featureConfigDesc'),
    icon: 'mdi:file-cog-outline'
  },
  {
    title: t('workbench.about.featureService'),
    description: t('workbench.about.featureServiceDesc'),
    icon: 'mdi:server-network-outline'
  },
  {
    title: t('workbench.about.featureCluster'),
    description: t('workbench.about.featureClusterDesc'),
    icon: 'mdi:hub-outline'
  },
  {
    title: t('workbench.about.featureUI'),
    description: t('workbench.about.featureUIdesc'),
    icon: 'mdi:drawing-box'
  }
]

const systemInfo = [
  { label: t('workbench.about.version'), value: 'v2.4.3-Alpha (Nova)' },
  { label: 'Environment', value: 'Production Ready' },
  { label: 'Framework', value: 'Vue v3.5.26' },
  { label: 'Engine', value: 'Vite v7.3.1' }
]
</script>

<style scoped lang="scss">
.about-page {
  @apply max-w-7xl mx-auto p-12 min-h-screen relative overflow-hidden;

  .decor-blob {
    @apply absolute blur-[150px] rounded-full opacity-20 pointer-events-none transition-opacity duration-1000;
    @apply dark:opacity-[0.1];
    &.blob-1 {
      @apply w-[500px] h-[500px] -top-40 -left-40 bg-primary/40;
    }
    &.blob-2 {
      @apply w-[400px] h-[400px] top-1/2 -right-40 bg-amber-500/30;
    }
  }
}

.glass-card {
  @apply border border-border/40 shadow-sm bg-background/40 backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2;
  @apply dark:bg-card/40 dark:border-white/5;
}

.tech-item {
  @apply flex flex-col gap-3 items-center;

  .tech-icon-box {
    @apply w-16 h-16 rounded-2xl flex items-center justify-center;
  }
}

@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.05); }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
