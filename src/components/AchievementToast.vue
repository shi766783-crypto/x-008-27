<template>
  <Teleport to="body">
    <div class="toast-wrap">
      <Transition name="achievement-toast" mode="out-in">
        <div v-if="current" :key="current.id" class="achievement-toast" role="status">
          <span class="toast-icon">{{ current.icon }}</span>
          <div class="toast-text">
            <span class="toast-title">🎉 解锁新成就</span>
            <b class="toast-name">{{ current.name }}</b>
            <span class="toast-desc">{{ current.desc }}</span>
          </div>
          <button class="icon-btn toast-close" aria-label="关闭" @click="dismiss">✕</button>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, watch, onBeforeUnmount } from 'vue'
import { achievementToastQueue, dismissAchievementToast } from '../data/achievementToasts.js'

const DISPLAY_MS = 3200

// 每次只展示队首一条，关闭或超时后自动切到下一条，保证逐个展示不漏
const current = computed(() => achievementToastQueue[0] || null)

let timer = null
const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const dismiss = () => {
  clearTimer()
  if (current.value) dismissAchievementToast(current.value.id)
}

watch(
  current,
  (val) => {
    clearTimer()
    if (val) timer = setTimeout(dismiss, DISPLAY_MS)
  },
  { immediate: true }
)

onBeforeUnmount(clearTimer)
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  top: 16px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  z-index: 200;
  pointer-events: none;
  padding: 0 16px;
}
.achievement-toast {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  padding: 12px 14px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.18);
  max-width: 360px;
  width: 100%;
}
.toast-icon {
  font-size: 28px;
  flex-shrink: 0;
}
.toast-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.toast-title {
  font-size: 11px;
  color: var(--text-secondary);
  font-weight: 600;
}
.toast-name {
  font-size: 14px;
  font-weight: 800;
}
.toast-desc {
  font-size: 12px;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.toast-close {
  flex-shrink: 0;
}
.achievement-toast-enter-active,
.achievement-toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.achievement-toast-enter-from,
.achievement-toast-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
</style>
