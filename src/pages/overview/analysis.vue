<template>
  <div class="page-container animate-in fade-in duration-500">
    <!-- 页面标题区域 -->
    <div class="page-title-section mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-xl bg-primary/10 text-primary">
          <Icon icon="mdi:chart-line" class="text-2xl" />
        </div>
        <h1 class="page-title text-2xl font-bold tracking-tight">{{ $t('menu.analysis') }}</h1>
      </div>
    </div>

    <Card class="border-none shadow-sm rounded-xl overflow-hidden">
      <CardHeader>
        <CardTitle>{{ $t('menu.analysis') }}</CardTitle>
        <CardDescription>This is the {{ $t('menu.analysis') }} page.</CardDescription>
      </CardHeader>
      <CardContent>
        <div class="empty-state">
          <Icon icon="i-mdi-chart-line" class="empty-icon" />
          <p>Analysis content goes here</p>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped lang="scss">
.page-container {
  @apply p-6;
}
.page-title {
  color: var(--wm-color-text-primary);
}
.empty-state {
  @apply flex flex-col items-center justify-center p-12 text-muted-foreground border-2 border-dashed rounded-xl;
  background-color: var(--wm-bg-color-base);
}
.empty-icon {
  @apply text-6xl mb-4 opacity-10 text-primary;
}
</style>
