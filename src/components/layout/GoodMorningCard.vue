<template>
  <Card class="good-morning-card">
    <CardContent class="card-content">
      <div class="card-left">
        <div class="avatar-wrapper">
          <div class="avatar-bg">
            <Icon type="uno" icon="i-mdi-account" class="avatar-icon" />
          </div>
        </div>
        <div class="greeting-content">
          <h2 class="greeting-title">{{ greetingText }}</h2>
          <p class="weather-info flex items-center gap-2">
            <Icon type="uno" icon="i-mdi-weather-partly-cloudy" class="weather-icon" />
            {{ weatherText }}
          </p>
        </div>
      </div>
      <div class="card-right hidden md:flex">
        <!-- Decorative background elements could go here -->
        <Icon type="uno" icon="i-mdi-coffee-outline" class="coffee-icon" />
      </div>
    </CardContent>
  </Card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/modules/auth'

const { t } = useI18n()
const authStore = useAuthStore()

const greetingText = computed(() => {
  const username = authStore.user?.username || 'User'
  return t('layout.goodMorning', { name: username })
})

const weatherText = computed(() => {
  return t('layout.weather')
})
</script>

<style scoped lang="scss">
.good-morning-card {
  @apply mb-6 overflow-hidden border-none shadow-sm relative;
  background: linear-gradient(135deg, var(--wm-bg-color-base) 0%, var(--wm-color-primary-light-9) 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: var(--wm-color-primary);
  }

  .card-content {
    @apply p-6 flex justify-between items-center;
  }

  .card-left {
    @apply flex items-center gap-6;

    .avatar-wrapper {
      @apply flex-shrink-0;

      .avatar-bg {
        @apply w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary;
      }

      .avatar-icon {
        @apply text-3xl;
      }
    }

    .greeting-content {
      @apply flex-1;

      .greeting-title {
        @apply text-xl font-semibold mb-1 text-foreground;
      }

      .weather-info {
        @apply text-sm text-muted-foreground;
        
        .weather-icon {
          @apply text-lg text-yellow-500;
        }
      }
    }
  }
  
  .card-right {
    .coffee-icon {
      @apply text-8xl text-primary/10 rotate-12 transform translate-x-4 translate-y-4;
    }
  }
}
</style>
