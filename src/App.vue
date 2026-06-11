<script setup>
import { ref } from 'vue'
import WeatherTab from './components/WeatherTab.vue'
import FavoritesTab from './components/FavoritesTab.vue'
import { useTheme } from './composables/useTheme'
import { useLocale } from './composables/useLocale'

const activeTab = ref('weather')
const { theme, toggleTheme } = useTheme()
const { locale, setLocale, t } = useLocale()
</script>

<template>
  <div class="app-wrap">
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="22" cy="10" r="4" fill="#FFD700"/>
            <path d="M10 24a5.5 5.5 0 0 1-1-10.9A7 7 0 0 1 22.4 11a5 5 0 0 1-1.4 9.9V21H10z" fill="#38bdf8"/>
          </svg>
          <h1>Weather</h1>
        </div>

        <div class="header-actions">
          <nav class="tabs">
            <button
              :class="['tab-btn', { active: activeTab === 'weather' }]"
              @click="activeTab = 'weather'"
            >
              {{ t('tabWeather') }}
            </button>
            <button
              :class="['tab-btn', { active: activeTab === 'favorites' }]"
              @click="activeTab = 'favorites'"
            >
              {{ t('tabFavorites') }}
            </button>
          </nav>

          <div class="lang-switch">
            <button
              :class="['lang-btn', { active: locale === 'en' }]"
              @click="setLocale('en')"
            >
              EN
            </button>
            <button
              :class="['lang-btn', { active: locale === 'uk' }]"
              @click="setLocale('uk')"
            >
              UK
            </button>
          </div>

          <button
            class="theme-switch"
            :class="{ active: theme === 'light' }"
            @click="toggleTheme"
            :title="theme === 'dark' ? t('switchToLight') : t('switchToDark')"
          >
            <span class="switch-track">
              <svg class="track-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <svg class="track-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </span>
            <span class="switch-thumb"></span>
          </button>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <WeatherTab v-if="activeTab === 'weather'" />
        <FavoritesTab v-else />
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-wrap {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--header-bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: background 0.2s, border-color 0.2s;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  color: var(--text);
}

.logo h1 {
  font: inherit;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tabs {
  display: flex;
  gap: 4px;
  background: var(--bg-input);
  padding: 4px;
  border-radius: 10px;
}

.tab-btn {
  padding: 7px 20px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-muted);
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--accent);
  color: #0f172a;
}

.tab-btn:not(.active):hover {
  color: var(--text);
}

.lang-switch {
  display: flex;
  background: var(--bg-input);
  border-radius: 8px;
  padding: 3px;
  gap: 2px;
}

.lang-btn {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  transition: all 0.2s;
}

.lang-btn.active {
  background: var(--accent);
  color: #0f172a;
}

.theme-switch {
  position: relative;
  width: 52px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 999px;
  background: var(--bg-input);
  border: 1px solid var(--border);
  transition: background 0.2s, border-color 0.2s;
}

.switch-track {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 6px;
  color: var(--text-muted);
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
  transition: transform 0.2s;
}

.theme-switch.active .switch-thumb {
  transform: translateX(24px);
}

.main {
  flex: 1;
  padding: 32px 0 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  min-width: 360px;
}

@media (max-width: 600px) {
  .header-inner {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 16px;
    gap: 10px;
  }

  .header-actions {
    width: 100%;
    justify-content: space-between;
    gap: 8px;
  }

  .tabs {
    flex: 1;
  }

  .tab-btn {
    flex: 1;
    padding: 7px 10px;
    font-size: 13px;
  }

  .lang-btn {
    padding: 5px 8px;
  }

  .container {
    min-width: 0;
  }
}
</style>
