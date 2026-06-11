<script setup>
import { ref, watch } from 'vue'
import { searchCities } from '../api/weather'
import { useLocale } from '../composables/useLocale'

const props = defineProps({
  modelValue: Object
})
const emit = defineEmits(['update:modelValue'])
const { t } = useLocale()

const query = ref(props.modelValue?.name || '')
const results = ref([])
const loading = ref(false)
const showList = ref(false)

let timer = null

watch(query, (val) => {
  if (!val || val.length < 2) {
    results.value = []
    showList.value = false
    return
  }
  clearTimeout(timer)
  timer = setTimeout(() => fetchCities(val), 350)
})

const fetchCities = async (q) => {
  loading.value = true
  try {
    results.value = await searchCities(q)
    showList.value = results.value.length > 0
  } catch {
    results.value = []
  } finally {
    loading.value = false
  }
}

const select = (city) => {
  query.value = city.name + (city.country ? `, ${city.country}` : '')
  emit('update:modelValue', { name: city.name, lat: city.lat, lon: city.lon, country: city.country })
  showList.value = false
}

const onBlur = () => {
  setTimeout(() => { showList.value = false }, 150)
}
</script>

<template>
  <div class="city-search">
    <div class="input-wrap">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input
        v-model="query"
        type="text"
        :placeholder="t('searchPlaceholder')"
        class="city-input"
        @focus="showList = results.length > 0"
        @blur="onBlur"
      />
      <span v-if="loading" class="spin"></span>
    </div>

    <ul v-if="showList" class="suggestions">
      <li
        v-for="city in results"
        :key="`${city.lat}-${city.lon}`"
        @mousedown="select(city)"
        class="suggestion-item"
      >
        <span class="city-name">{{ city.name }}</span>
        <span class="city-country">{{ city.state ? city.state + ', ' : '' }}{{ city.country }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.city-search {
  position: relative;
}

.input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 0 14px;
  transition: border-color 0.2s;
}

.input-wrap:focus-within {
  border-color: var(--accent);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.city-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--text);
  font-size: 15px;
  padding: 12px 0;
}

.city-input::placeholder {
  color: var(--text-muted);
}

.spin {
  width: 14px;
  height: 14px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.suggestions {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  list-style: none;
  overflow: hidden;
  z-index: 50;
  box-shadow: var(--shadow);
}

.suggestion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  cursor: pointer;
  transition: background 0.15s;
  gap: 12px;
}

.suggestion-item:hover {
  background: var(--bg-input);
}

.city-name {
  font-size: 14px;
  color: var(--text);
}

.city-country {
  font-size: 12px;
  color: var(--text-muted);
}
</style>
