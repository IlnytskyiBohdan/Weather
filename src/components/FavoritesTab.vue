<script setup>
import { ref, watch } from 'vue'
import { useFavorites } from '../composables/useFavorites'
import WeatherCard from './WeatherCard.vue'
import TempChart from './TempChart.vue'
import ConfirmModal from './ConfirmModal.vue'
import { getCurrentWeather, getForecast } from '../api/weather'
import { useLocale } from '../composables/useLocale'

const { favorites, removeFavorite } = useFavorites()
const { locale, t } = useLocale()

const weatherMap = ref({})
const forecastMap = ref({})
const loadingMap = ref({})
const modeMap = ref({})
const confirmCity = ref(null)

const loadCity = async (city) => {
  loadingMap.value[city.name] = true
  if (!modeMap.value[city.name]) modeMap.value[city.name] = 'day'
  try {
    const [weather, forecast] = await Promise.all([
      getCurrentWeather(city.lat, city.lon, locale.value),
      getForecast(city.lat, city.lon, locale.value)
    ])
    weatherMap.value[city.name] = weather
    forecastMap.value[city.name] = forecast
  } finally {
    loadingMap.value[city.name] = false
  }
}

favorites.value.forEach(city => loadCity(city))

watch(locale, () => {
  favorites.value.forEach(city => loadCity(city))
})

const onRemove = (city) => {
  confirmCity.value = city
}

const confirmRemove = () => {
  if (!confirmCity.value) return
  removeFavorite(confirmCity.value.name)
  delete weatherMap.value[confirmCity.value.name]
  delete forecastMap.value[confirmCity.value.name]
  confirmCity.value = null
}
</script>

<template>
  <div class="favorites-tab">
    <p v-if="!favorites.length" class="empty">
      {{ t('noFavorites') }}
    </p>

    <div v-else class="fav-grid">
      <div v-for="city in favorites" :key="city.name" class="fav-block">
        <div class="fav-header">
          <div class="mode-toggle">
            <button :class="['toggle-btn', { active: modeMap[city.name] === 'day' }]" @click="modeMap[city.name] = 'day'">{{ t('day') }}</button>
            <button :class="['toggle-btn', { active: modeMap[city.name] === 'week' }]" @click="modeMap[city.name] = 'week'">{{ t('week') }}</button>
          </div>
          <button class="remove-fav" @click="onRemove(city)" :title="t('removeFromFavorites')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="loadingMap[city.name]" class="fav-loader">
          <span class="loader-spin"></span>
        </div>

        <template v-else-if="weatherMap[city.name]">
          <WeatherCard :data="weatherMap[city.name]" :forecast="forecastMap[city.name]" :city="city" :mode="modeMap[city.name]" />
          <TempChart v-if="forecastMap[city.name]" :forecast="forecastMap[city.name]" :mode="modeMap[city.name]" />
        </template>
      </div>
    </div>

    <ConfirmModal
      v-if="confirmCity"
      :message="t('removeFavConfirm', { name: confirmCity.name })"
      @confirm="confirmRemove"
      @cancel="confirmCity = null"
    />
  </div>
</template>

<style scoped>
.favorites-tab {
  min-height: 200px;
}

.empty {
  color: var(--text-muted);
  text-align: center;
  margin-top: 60px;
  font-size: 15px;
}

.fav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.fav-block {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.fav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.toggle-btn.active {
  background: var(--accent);
  color: #0f172a;
}

.remove-fav {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: var(--text-muted);
  transition: all 0.2s;
}

.remove-fav:hover {
  background: rgba(248, 113, 113, 0.1);
  color: var(--danger);
}

.fav-loader {
  display: flex;
  justify-content: center;
  padding: 40px 0;
}

.loader-spin {
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .fav-grid {
    grid-template-columns: 1fr;
  }
}
</style>
