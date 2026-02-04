import type { App } from 'vue'
import { createI18n } from 'vue-i18n'

const SUPPORTED_LOCALES = ['zh-CN', 'en-US'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

const DEFAULT_LOCALE: SupportedLocale = 'zh-CN'
const LOCALE_STORAGE_KEY = 'locale'

const getBrowserLanguage = (): SupportedLocale => {
  const browserLang = navigator.language || (navigator as any).userLanguage
  return SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)
    ? (browserLang as SupportedLocale)
    : DEFAULT_LOCALE
}

const resolveLocale = (value?: string | null): SupportedLocale => {
  if (value && SUPPORTED_LOCALES.includes(value as SupportedLocale)) {
    return value as SupportedLocale
  }

  return DEFAULT_LOCALE
}

const storedLocale = typeof localStorage === 'undefined'
  ? null
  : localStorage.getItem(LOCALE_STORAGE_KEY)
const currentLocale = storedLocale ? resolveLocale(storedLocale) : getBrowserLanguage()

const i18n = createI18n({
  legacy: false,
  locale: currentLocale,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {},
})

const localeLoaders = import.meta.glob('./locales/*.ts')
const loadedBaseLocales = new Set<string>()

export async function loadLanguage(lang: string) {
  const targetLocale = resolveLocale(lang)

  if (!loadedBaseLocales.has(targetLocale)) {
    const loader = localeLoaders[`./locales/${targetLocale}.ts`]
    if (loader) {
      const messages = await loader()
      const messageData = (messages as { default: Record<string, any> }).default
      i18n.global.setLocaleMessage(targetLocale, messageData as any)
      loadedBaseLocales.add(targetLocale)
    } else {
      console.warn(`Missing locale messages for ${targetLocale}`)
    }
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, targetLocale)
  }

  return targetLocale
}

void loadLanguage(currentLocale)

export const installI18n = (app: App) => {
  app.use(i18n)
}

export default i18n
