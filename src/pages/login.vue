<template>
  <div class="login-page">
    <!-- Premium background with mesh gradient and animated glows -->
    <div class="background-mesh">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="glow glow-3"></div>
      <div class="noise-overlay"></div>
    </div>

    <div class="login-wrapper">
      <div class="login-container">
        <!-- Logo & Header -->
        <header class="login-header animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div class="logo-box">
            <div class="logo-ripple"></div>
            <div class="i-ph-shield-check-fill logo-icon"></div>
          </div>
          <h1 class="login-title">{{ $t('login.title') }}</h1>
          <p class="login-subtitle">{{ $t('login.subtitle') }}</p>
        </header>

        <!-- Login Card -->
        <div class="glass-card animate-in fade-in zoom-in-95 duration-700 delay-300 fill-mode-both">
          <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-item">
              <div class="input-wrapper">
                <div class="input-icon i-ph-user-bold"></div>
                <input
                  id="username"
                  v-model="form.username"
                  type="text"
                  :placeholder="$t('login.username')"
                  :disabled="loading"
                  autocomplete="username"
                  class="glass-input"
                />
              </div>
              <Transition name="slide-up">
                <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
              </Transition>
            </div>

            <div class="form-item">
              <div class="input-wrapper">
                <div class="input-icon i-ph-lock-key-bold"></div>
                <input
                  id="password"
                  v-model="form.password"
                  type="password"
                  :placeholder="$t('login.password')"
                  :disabled="loading"
                  autocomplete="current-password"
                  class="glass-input"
                />
              </div>
              <Transition name="slide-up">
                <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
              </Transition>
            </div>

            <button
              type="submit"
              :disabled="loading"
              class="premium-button"
            >
              <span v-if="loading" class="i-ph-spinner-gap-bold animate-spin mr-2 text-xl"></span>
              <span class="button-text">{{ loading ? '登录中...' : $t('login.loginButton') }}</span>
              <div class="button-glow"></div>
            </button>
          </form>
        </div>

        <!-- Footer -->
        <footer class="login-footer animate-in fade-in duration-1000 delay-1000 fill-mode-both">
          <p>&copy; 2026 Nova Admin. All rights reserved.</p>
        </footer>
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
      if (msg && msg.includes('User') && msg.includes('not found')) {
        msg = '用户或密码错误'
      }
      toastError(msg)
    }
  } catch (error: any) {
    let msg = error.message || t('login.loginFailed')
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
  @apply min-h-screen w-full relative overflow-hidden flex items-center justify-center font-sans antialiased;
  background-color: #0c111d;
}

/* Background Effects */
.background-mesh {
  @apply absolute inset-0 z-0;
  background: radial-gradient(circle at 10% 20%, rgba(28, 147, 153, 0.15) 0%, transparent 40%),
              radial-gradient(circle at 90% 80%, rgba(94, 124, 224, 0.1) 0%, transparent 40%),
              radial-gradient(circle at 50% 50%, rgba(12, 17, 29, 1) 0%, #020617 100%);

  .glow {
    @apply absolute rounded-full blur-[120px] opacity-40 mix-blend-screen;
    filter: blur(100px);
  }

  .glow-1 {
    width: 40vw;
    height: 40vw;
    top: -10vw;
    left: -10vw;
    background: radial-gradient(circle, var(--wm-color-primary) 0%, transparent 70%);
    animation: float 20s infinite alternate linear;
  }

  .glow-2 {
    width: 30vw;
    height: 30vw;
    bottom: -5vw;
    right: -5vw;
    background: radial-gradient(circle, var(--wm-color-info) 0%, transparent 70%);
    animation: float 15s infinite alternate-reverse linear;
  }

  .glow-3 {
    width: 25vw;
    height: 25vw;
    top: 20%;
    right: 15%;
    background: radial-gradient(circle, #3dbe7d 0%, transparent 70%);
    opacity: 0.1;
    animation: float 25s infinite alternate linear;
  }

  .noise-overlay {
    @apply absolute inset-0 pointer-events-none opacity-[0.03];
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  }
}

.login-wrapper {
  @apply relative z-10 w-full max-w-lg px-6;
}

/* Header Section */
.login-header {
  @apply text-center mb-12;

  .logo-box {
    @apply relative w-24 h-24 mx-auto mb-8 flex items-center justify-center;

    .logo-icon {
      @apply text-6xl text-primary z-10 filter drop-shadow-[0_0_15px_rgba(28,147,153,0.5)];
    }

    .logo-ripple {
      @apply absolute inset-0 rounded-3xl bg-primary/20 scale-100;
      animation: ripple 4s infinite ease-out;
    }
  }

  .login-title {
    @apply text-5xl font-extrabold tracking-tight text-white mb-3;
    background: linear-gradient(to bottom, #ffffff, #94a3b8);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .login-subtitle {
    @apply text-slate-400 font-medium tracking-widest text-base uppercase;
  }
}

/* Glass Card */
.glass-card {
  @apply p-12 rounded-[2.8rem] border border-white/10 transition-all duration-700;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  backdrop-filter: blur(24px) saturate(180%);
  box-shadow:
    0 40px 80px -20px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
    inset 0 -1px 0 0 rgba(255, 255, 255, 0.05);

  &:hover {
    @apply border-white/25;
    background: rgba(255, 255, 255, 0.07);
    transform: translateY(-6px) scale(1.01);
    box-shadow:
      0 50px 100px -25px rgba(0, 0, 0, 0.7),
      inset 0 1px 0 0 rgba(255, 255, 255, 0.2);
  }
}

/* Form Styles */
.login-form {
  @apply space-y-6;
}

.form-item {
  @apply space-y-2;
}

.input-wrapper {
  @apply relative transition-all duration-300;

  .input-icon {
    @apply absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-xl transition-all duration-300;
  }

  &:focus-within {
    .input-icon {
      @apply text-primary scale-110;
      filter: drop-shadow(0 0 5px rgba(28, 147, 153, 0.4));
    }
  }
}

.glass-input {
  @apply w-full h-16 bg-black/20 border border-white/5 rounded-2xl px-14 text-white text-lg placeholder:text-slate-600 outline-none transition-all duration-500;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);

  &:focus {
    @apply border-primary/40 bg-black/40;
    box-shadow:
      0 0 25px rgba(28, 147, 153, 0.2),
      inset 0 2px 4px rgba(0, 0, 0, 0.5);
  }

  &:disabled {
    @apply opacity-50 cursor-not-allowed;
  }
}

/* Premium Button (Stereo 3D Effect) */
.premium-button {
  @apply relative w-full h-16 mt-4 overflow-hidden rounded-2xl text-white font-bold text-xl transition-all duration-500 active:scale-[0.96] disabled:opacity-70;
  background: linear-gradient(135deg, var(--wm-color-primary) 0%, #157378 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 10px 20px -5px rgba(28, 147, 153, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(0, 0, 0, 0.2);

  .button-text {
    @apply relative z-10 flex items-center justify-center;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  .button-glow {
    @apply absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent;
    transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 15px 30px -5px rgba(28, 147, 153, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);

    .button-glow {
      transform: translateX(100%);
    }
  }
}

/* Feedback */
.field-error {
  @apply text-xs text-danger font-semibold mt-1.5 flex items-center ml-1;

  &::before {
    content: "";
    @apply i-ph-warning-circle-bold mr-1 text-sm;
  }
}

/* Footer */
.login-footer {
  @apply mt-12 text-center text-slate-500 text-sm;
}

/* Animations */
@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(50px, 50px) scale(1.1); }
  100% { transform: translate(-30px, 20px) scale(0.9); }
}

@keyframes ripple {
  0% { transform: scale(0.8); opacity: 0.5; }
  100% { transform: scale(1.8); opacity: 0; }
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.delay-300 { animation-delay: 300ms; }
.delay-1000 { animation-delay: 1000ms; }
.fill-mode-both { animation-fill-mode: both; }
</style>
