<template>
  <div class="login-page">
    <!-- 背景装饰元素 -->
    <div class="bg-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <div class="login-container">
      <Card class="login-card animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader class="space-y-2">
          <div class="flex-center mb-2">
            <div class="logo-wrapper animate-bounce-subtle">
              <div class="i-ph-shield-check-fill text-4xl text-primary"></div>
            </div>
          </div>
          <CardTitle class="login-title">{{ $t('login.title') }}</CardTitle>
          <CardDescription class="login-subtitle">
            {{ $t('login.subtitle') }}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group animate-in fade-in slide-in-from-left-4 duration-500 delay-200 fill-mode-both">
              <Label for="username" class="text-sm font-semibold uppercase tracking-wider ml-1">
                {{ $t('login.username') }}
              </Label>
              <div class="relative mt-1.5">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <div class="i-ph-user-bold"></div>
                </div>
                <Input
                  id="username"
                  v-model="form.username"
                  type="text"
                  :placeholder="$t('login.username')"
                  :disabled="loading"
                  class="pl-10 h-12 text-base bg-background/50 focus:bg-background focus:border-primary focus-visible:ring-primary transition-all duration-300"
                />
              </div>
              <Transition name="fade-slide">
                <p v-if="errors.username" class="error-message">{{ errors.username }}</p>
              </Transition>
            </div>

            <div class="form-group animate-in fade-in slide-in-from-left-4 duration-500 delay-300 fill-mode-both">
              <Label for="password" class="text-sm font-semibold uppercase tracking-wider ml-1">
                {{ $t('login.password') }}
              </Label>
              <div class="relative mt-1.5">
                <div class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <div class="i-ph-lock-key-bold"></div>
                </div>
                <Input
                  id="password"
                  v-model="form.password"
                  type="password"
                  :placeholder="$t('login.password')"
                  :disabled="loading"
                  class="pl-10 h-12 text-base bg-background/50 focus:bg-background focus:border-primary focus-visible:ring-primary transition-all duration-300"
                />
              </div>
              <Transition name="fade-slide">
                <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
              </Transition>
            </div>

            <!-- Error message removed, using toast instead -->

            <Button
              type="submit"
              :disabled="loading"
              class="login-button h-11 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 fill-mode-both"
            >
              <div v-if="loading" class="i-ph-spinner-gap-bold animate-spin mr-2"></div>
              {{ loading ? '登录中...' : $t('login.loginButton') }}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div class="footer-text animate-in fade-in duration-1000 delay-500 fill-mode-both">
        <p class="text-center text-sm text-muted-foreground mt-8">
          &copy; 2026 Nova Admin. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores'
import { toastError } from '@/utils/toast'
import router from '@/router'

definePage({
  meta: {
    layout: 'blank',
  },
})

const { t } = useI18n()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: '',
})

const errors = reactive({
  username: '',
  password: '',
})

const loading = ref(false)

const validateForm = () => {
  errors.username = ''
  errors.password = ''
  let isValid = true

  if (!form.username.trim()) {
    errors.username = t('login.usernameRequired')
    isValid = false
  }

  if (!form.password.trim()) {
    errors.password = t('login.passwordRequired')
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    const result = await authStore.login(form.username, form.password)
    if (result.success) {
      router.push('/')
    } else {
      let msg = result.message || t('login.loginError')
      // 用户不存在时 Nacos 返回 caused: User xxx not found;
      if (msg && msg.includes('User') && msg.includes('not found')) {
        msg = '用户或密码错误'
      }
      toastError(msg)
    }
  } catch (error: any) {
    let msg = error.message || t('login.loginFailed')
    // 用户不存在时 Nacos 返回 caused: User xxx not found;
    if (msg && msg.includes('User') && msg.includes('not found')) {
      msg = '用户或密码错误'
    }
    toastError(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.login-page {
  @apply min-h-screen flex-center relative overflow-hidden;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 50%, #eff6ff 100%);
}

.bg-decoration {
  @apply absolute inset-0 pointer-events-none;

  .circle {
    @apply absolute rounded-full opacity-30 blur-3xl;
    background: var(--wm-color-primary);
  }

  .circle-1 {
    width: 500px;
    height: 500px;
    top: -150px;
    left: -150px;
    animation: float 15s infinite alternate ease-in-out;
  }

  .circle-2 {
    width: 400px;
    height: 400px;
    bottom: -100px;
    right: -100px;
    background: var(--wm-color-info);
    animation: float 12s infinite alternate-reverse ease-in-out;
  }

  .circle-3 {
    width: 300px;
    height: 300px;
    top: 30%;
    right: 10%;
    background: var(--wm-color-success);
    animation: float 18s infinite alternate ease-in-out;
  }
}

@keyframes float {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(60px, 60px) rotate(15deg); }
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s infinite ease-in-out;
}

.login-container {
  @apply w-full max-w-lg px-lg relative z-10;
}

.login-card {
  @apply border-white/50 shadow-2xl p-4;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(16px);
  border-radius: calc(var(--wm-border-radius-lg) * 1.5);

  &:hover {
    @apply shadow-primary/20;
    transform: translateY(-4px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.logo-wrapper {
  @apply p-4 rounded-2xl bg-primary/15 shadow-inner;
}

.login-title {
  @apply text-4xl font-bold text-center tracking-tight;
  color: var(--wm-color-text-primary);
}

.login-subtitle {
  @apply text-base text-center font-medium;
  color: var(--wm-color-text-secondary);
}

.login-form {
  @apply space-y-8 mt-6;
}

.form-group {
  @apply space-y-2;
}

.error-message {
  @apply text-sm text-danger mt-2 font-medium flex items-center;

  &::before {
    content: "";
    @apply i-ph-warning-circle-bold mr-1.5 inline-block;
  }
}

.login-button {
  @apply w-full mt-4 h-12 text-lg bg-primary hover:bg-primary-dark-1 active:scale-[0.97];
}

/* Transitions */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }
.fill-mode-both { animation-fill-mode: both; }
</style>
