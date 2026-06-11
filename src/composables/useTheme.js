import { ref, watch } from 'vue'

const STORAGE_KEY = 'weather_theme'

const theme = ref(localStorage.getItem(STORAGE_KEY) || 'dark')

const apply = (val) => {
  document.documentElement.setAttribute('data-theme', val)
}
apply(theme.value)

watch(theme, (val) => {
  localStorage.setItem(STORAGE_KEY, val)
  apply(val)
})

export const useTheme = () => {
  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  return { theme, toggleTheme }
}
