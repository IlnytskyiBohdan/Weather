<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import Chart from 'chart.js/auto'
import { useLocale } from '../composables/useLocale'

const { locale } = useLocale()

const props = defineProps({
  forecast: Object,
  mode: {
    type: String,
    default: 'day'
  }
})

const canvas = ref(null)
let chart = null

const buildDayData = (forecast) => {
  const today = new Date().toDateString()
  const items = forecast.list.filter(i => new Date(i.dt * 1000).toDateString() === today)
  return {
    labels: items.map(i => {
      const d = new Date(i.dt * 1000)
      return d.getHours().toString().padStart(2, '0') + ':00'
    }),
    temps: items.map(i => Math.round(i.main.temp))
  }
}

const buildWeekData = (forecast) => {
  const days = {}
  forecast.list.forEach(i => {
    const date = new Date(i.dt * 1000)
    const key = date.toDateString()
    if (!days[key]) days[key] = []
    days[key].push(i.main.temp)
  })

  const labels = []
  const temps = []
  Object.entries(days).forEach(([key, temps_]) => {
    const d = new Date(key)
    labels.push(d.toLocaleDateString(locale.value, { weekday: 'short', month: 'short', day: 'numeric' }))
    temps.push(Math.round(temps_.reduce((a, b) => a + b, 0) / temps_.length))
  })

  return { labels, temps }
}

const getChartData = () => {
  if (!props.forecast) return null
  return props.mode === 'day' ? buildDayData(props.forecast) : buildWeekData(props.forecast)
}

const createChart = () => {
  if (!canvas.value) return
  const data = getChartData()
  if (!data) return

  chart = new Chart(canvas.value, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        data: data.temps,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        borderWidth: 2,
        pointBackgroundColor: '#38bdf8',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.parsed.y}°C`
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(51, 65, 85, 0.5)' },
          ticks: { color: '#94a3b8', font: { size: 12 } }
        },
        y: {
          grid: { color: 'rgba(51, 65, 85, 0.5)' },
          ticks: {
            color: '#94a3b8',
            font: { size: 12 },
            callback: v => v + '°'
          }
        }
      }
    }
  })
}

const updateChart = () => {
  if (!chart) return
  const data = getChartData()
  if (!data) return
  chart.data.labels = data.labels
  chart.data.datasets[0].data = data.temps
  chart.update()
}

onMounted(() => createChart())
onUnmounted(() => { if (chart) chart.destroy() })

watch(() => props.forecast, () => {
  if (chart) updateChart()
  else createChart()
})

watch(() => props.mode, () => updateChart())
watch(locale, () => updateChart())
</script>

<template>
  <div class="chart-wrap">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.chart-wrap {
  height: 160px;
  position: relative;
}
</style>
