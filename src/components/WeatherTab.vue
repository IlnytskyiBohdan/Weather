<script setup>
import { ref, onMounted } from 'vue'
import WeatherBlock from './WeatherBlock.vue'
import ConfirmModal from './ConfirmModal.vue'
import { getCityByIp } from '../api/weather'
import { useLocale } from '../composables/useLocale'

const { t } = useLocale()

const MAX_BLOCKS = 5

const blocks = ref([{ id: Date.now() }])
const blockRefs = ref({})
const showFavLimit = ref(false)

onMounted(async () => {
  const city = await getCityByIp()
  if (city && blockRefs.value[blocks.value[0].id]) {
    blockRefs.value[blocks.value[0].id].setCity(city)
  }
})

const addBlock = () => {
  if (blocks.value.length >= MAX_BLOCKS) return
  blocks.value.push({ id: Date.now() })
}

const removeBlock = (id) => {
  blocks.value = blocks.value.filter(b => b.id !== id)
}
</script>

<template>
  <div class="weather-tab">
    <div class="blocks-grid">
      <WeatherBlock
        v-for="block in blocks"
        :key="block.id"
        :ref="el => { if (el) blockRefs[block.id] = el }"
        :removable="blocks.length > 1"
        @remove="removeBlock(block.id)"
        @fav-limit="showFavLimit = true"
      />
    </div>

    <button
      v-if="blocks.length < MAX_BLOCKS"
      class="add-btn"
      @click="addBlock"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      {{ t('addCity') }}
    </button>

    <ConfirmModal
      v-if="showFavLimit"
      :message="t('favLimit')"
      @confirm="showFavLimit = false"
      @cancel="showFavLimit = false"
    />
  </div>
</template>

<style scoped>
.weather-tab {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.blocks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 20px;
}

.add-btn {
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--accent);
  color: #0f172a;
  font-size: 14px;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 10px;
  transition: background 0.2s;
}

.add-btn:hover {
  background: var(--accent-hover);
}

@media (max-width: 600px) {
  .blocks-grid {
    grid-template-columns: 1fr;
  }
}
</style>
