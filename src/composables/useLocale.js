import { ref, watch } from 'vue'
import { translations } from '../i18n/translations'

const STORAGE_KEY = 'weather_locale'

const locale = ref(localStorage.getItem(STORAGE_KEY) || 'en')

watch(locale, (val) => {
  localStorage.setItem(STORAGE_KEY, val)
})

export const useLocale = () => {
  const setLocale = (val) => {
    locale.value = val
  }

  const t = (key, params) => {
    let str = translations[locale.value][key] || key
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        str = str.replace(`{${k}}`, v)
      })
    }
    return str
  }

  return { locale, setLocale, t }
}
