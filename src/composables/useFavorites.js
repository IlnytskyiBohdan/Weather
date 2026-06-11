import { ref } from 'vue'

const MAX = 5
const STORAGE_KEY = 'weather_favorites'

const favorites = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'))

const save = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
}

export const useFavorites = () => {
  const isFavorite = (name) => {
    return favorites.value.some(c => c.name === name)
  }

  const addFavorite = (city) => {
    if (favorites.value.length >= MAX) {
      return { error: true, limit: MAX }
    }
    if (!isFavorite(city.name)) {
      favorites.value.push(city)
      save()
    }
    return { error: false }
  }

  const removeFavorite = (name) => {
    favorites.value = favorites.value.filter(c => c.name !== name)
    save()
  }

  return { favorites, isFavorite, addFavorite, removeFavorite }
}
