<script setup>
import { useLocale } from '../composables/useLocale'

defineProps({
  message: String
})
const emit = defineEmits(['confirm', 'cancel'])
const { t } = useLocale()
</script>

<template>
  <div class="modal-overlay" @click.self="emit('cancel')">
    <div class="modal">
      <p class="modal-text">{{ message }}</p>
      <div class="modal-actions">
        <button class="btn-cancel" @click="emit('cancel')">{{ t('cancel') }}</button>
        <button class="btn-confirm" @click="emit('confirm')">{{ t('delete') }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px;
  max-width: 360px;
  width: 90%;
}

.modal-text {
  font-size: 15px;
  color: var(--text);
  margin-bottom: 24px;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-cancel {
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-muted);
  background: var(--bg-input);
  transition: color 0.2s;
}

.btn-cancel:hover {
  color: var(--text);
}

.btn-confirm {
  padding: 9px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: white;
  background: var(--danger);
  transition: opacity 0.2s;
}

.btn-confirm:hover {
  opacity: 0.85;
}
</style>
