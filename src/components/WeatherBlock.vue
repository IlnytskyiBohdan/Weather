<script setup>
import { ref, watch } from 'vue'
import CitySearch from './CitySearch.vue'
import WeatherCard from './WeatherCard.vue'
import TempChart from './TempChart.vue'
import ConfirmModal from './ConfirmModal.vue'
import { getCurrentWeather, getForecast } from '../api/weather'
import { useLocale } from '../composables/useLocale'

const props = defineProps({
  removable: Boolean
})

const emit = defineEmits(['remove', 'fav-limit'])

const { locale, t } = useLocale()

const city = ref(null)
const weatherData = ref(null)
const forecastData = ref(null)
const mode = ref('day')
const loading = ref(false)
const error = ref('')
const showConfirm = ref(false)

const loadWeather = async (val) => {
  if (!val) return
  error.value = ''
  loading.value = true
  try {
    const [weather, forecast] = await Promise.all([
      getCurrentWeather(val.lat, val.lon, locale.value),
      getForecast(val.lat, val.lon, locale.value)
    ])
    weatherData.value = weather
    forecastData.value = forecast
  } catch {
    error.value = t('failedToLoad')
  } finally {
    loading.value = false
  }
}

watch(city, (val) => loadWeather(val))
watch(locale, () => loadWeather(city.value))

const setCity = (val) => {
  city.value = val
}

defineExpose({ setCity })
</script>

<template>
  <div class="weather-block">
    <div class="block-header">
      <CitySearch v-model="city" />
      <div class="block-actions">
        <div class="mode-toggle">
          <button :class="['toggle-btn', { active: mode === 'day' }]" @click="mode = 'day'">{{ t('day') }}</button>
          <button :class="['toggle-btn', { active: mode === 'week' }]" @click="mode = 'week'">{{ t('week') }}</button>
        </div>
        <button v-if="removable" class="remove-btn" @click="showConfirm = true" :title="t('removeBlock')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <div v-if="loading" class="block-loader">
      <span class="loader-spin"></span>
    </div>

    <div v-else-if="error" class="block-error">{{ error }}</div>

    <div v-else-if="weatherData" class="block-content">
      <WeatherCard :data="weatherData" :forecast="forecastData" :city="city" :mode="mode" @fav-limit="emit('fav-limit')" />
      <TempChart v-if="forecastData" :forecast="forecastData" :mode="mode" />
    </div>

    <div v-else class="block-empty">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <p>{{ t('searchForCity') }}</p>
    </div>

    <ConfirmModal
      v-if="showConfirm"
      :message="t('removeBlockConfirm')"
      @confirm="emit('remove'); showConfirm = false"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<style scoped>
.weather-block {
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  min-height: 200px;
}

.block-header {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.block-header > :first-child {
  flex: 1;
  min-width: 160px;
}

.block-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
  margin-left: auto;
}

.mode-toggle {
  display: flex;
  background: var(--bg-input);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.toggle-btn {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all 0.2s;
  white-space: nowrap;
}

.toggle-btn.active {
  background: var(--accent);
  color: #0f172a;
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-muted);
  transition: all 0.2s;
}

.remove-btn:hover {
  background: rgba(248, 113, 113, 0.1);
  color: var(--danger);
}

.block-loader {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 160px;
}

.loader-spin {
  width: 28px;
  height: 28px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.block-error {
  color: var(--danger);
  font-size: 14px;
  text-align: center;
  padding: 20px;
}

.block-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.block-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--text-muted);
  min-height: 160px;
}

.block-empty p {
  font-size: 14px;
}
</style>
