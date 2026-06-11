<script setup>
import { computed } from 'vue'
import { useFavorites } from '../composables/useFavorites'
import { useLocale } from '../composables/useLocale'

const props = defineProps({
  data: Object,
  forecast: Object,
  city: Object,
  mode: {
    type: String,
    default: 'day'
  }
})

const { isFavorite, addFavorite, removeFavorite } = useFavorites()
const { t } = useLocale()

const emit = defineEmits(['fav-limit'])

const isFav = computed(() => props.city && isFavorite(props.city.name))

const toggleFav = () => {
  if (!props.city) return
  if (isFav.value) {
    removeFavorite(props.city.name)
  } else {
    const result = addFavorite(props.city)
    if (result.error) {
      emit('fav-limit')
    }
  }
}

const iconUrl = computed(() => {
  if (!props.data?.weather?.[0]?.icon) return ''
  return `/weather-icons/${props.data.weather[0].icon}.png`
})

const temp = computed(() => props.data ? Math.round(props.data.main.temp) : null)

const todayTemps = computed(() => {
  if (!props.forecast?.list) return null
  const today = new Date().toDateString()
  const temps = props.forecast.list
    .filter(i => new Date(i.dt * 1000).toDateString() === today)
    .map(i => i.main.temp)
  return temps.length ? temps : null
})

const tempMax = computed(() => {
  if (todayTemps.value) return Math.round(Math.max(...todayTemps.value))
  return props.data ? Math.round(props.data.main.temp_max) : null
})

const tempMin = computed(() => {
  if (todayTemps.value) return Math.round(Math.min(...todayTemps.value))
  return props.data ? Math.round(props.data.main.temp_min) : null
})
const feelsLike = computed(() => props.data ? Math.round(props.data.main.feels_like) : null)
const description = computed(() => props.data?.weather?.[0]?.description || '')
const humidity = computed(() => props.data?.main?.humidity)
const wind = computed(() => props.data?.wind?.speed ? Math.round(props.data.wind.speed) : null)
const visibility = computed(() => props.data?.visibility ? Math.round(props.data.visibility / 1000) : null)
</script>

<template>
  <div class="weather-card" v-if="data">
    <div class="card-top">
      <div class="card-location">
        <h2 class="city-title">{{ data.name }}<span v-if="data.sys?.country">, {{ data.sys.country }}</span></h2>
        <p class="description">{{ description }}</p>
      </div>
      <button class="fav-btn" :class="{ active: isFav }" @click="toggleFav" :title="isFav ? t('removeFromFavorites') : t('addToFavorites')">
        <svg width="20" height="20" viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>

    <div class="card-main">
      <img v-if="iconUrl" :src="iconUrl" :alt="description" class="weather-icon" width="80" height="80" />
      <div class="temp-block">
        <span class="temp">{{ temp }}°</span>
        <span class="feels-like">{{ t('feelsLike') }} {{ feelsLike }}°</span>
        <span class="temp-minmax">{{ t('max') }} {{ tempMax }}° / {{ t('min') }} {{ tempMin }}°</span>
      </div>
    </div>

    <div class="card-stats">
      <div class="stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7z"/>
        </svg>
        <span>{{ humidity }}%</span>
        <small>{{ t('humidity') }}</small>
      </div>
      <div class="stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>
        </svg>
        <span>{{ wind }} m/s</span>
        <small>{{ t('wind') }}</small>
      </div>
      <div class="stat">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
        </svg>
        <span>{{ visibility }} km</span>
        <small>{{ t('visibility') }}</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-card {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.city-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 4px;
}

.description {
  font-size: 13px;
  color: var(--text-muted);
  text-transform: capitalize;
}

.fav-btn {
  color: var(--text-muted);
  padding: 4px;
  border-radius: 6px;
  transition: color 0.2s;
  flex-shrink: 0;
}

.fav-btn:hover {
  color: #f87171;
}

.fav-btn.active {
  color: #f87171;
}

.card-main {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-icon {
  filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.3));
}

.temp-block {
  display: flex;
  flex-direction: column;
}

.temp {
  font-size: 56px;
  font-weight: 700;
  line-height: 1;
  color: var(--text);
}

.feels-like {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.temp-minmax {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 2px;
}

.card-stats {
  display: flex;
  gap: 8px;
}

.stat {
  flex: 1;
  background: var(--bg-input);
  border-radius: 10px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: var(--text-muted);
}

.stat svg {
  color: var(--accent);
}

.stat span {
  font-size: 13px;
  font-weight: 600;
  color: var(--text);
}

.stat small {
  font-size: 11px;
  color: var(--text-muted);
}
</style>
