<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="toast"
        class="ach-toast"
        role="status"
        :aria-label="`成就解锁：${toast.name}`"
        @mouseenter="paused = true"
        @mouseleave="paused = false"
      >
        <div class="ach-icon">{{ toast.icon }}</div>
        <div class="ach-body">
          <div class="ach-title">{{ toast.title }}</div>
          <div class="ach-name">{{ toast.name }}</div>
          <div v-if="toast.desc" class="ach-desc">{{ toast.desc }}</div>
        </div>
        <button class="ach-close" @click="close" aria-label="关闭提示">✕</button>
        <span class="ach-timer" :class="{ paused }"></span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useToasts, dismissToast } from '../core/toast.js'

const AUTO_DISMISS = 4000

const { current } = useToasts()
const toast = computed(() => current.value)
const paused = ref(false)

let timer = null

const clear = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}
const close = () => {
  clear()
  dismissToast()
}
const restart = () => {
  clear()
  timer = setTimeout(close, AUTO_DISMISS)
}

// 展示新提示时重新计时；悬停暂停自动关闭，移开后恢复完整时长
watch(
  () => toast.value?._id,
  () => {
    paused.value = false
    if (toast.value) restart()
    else clear()
  },
  { immediate: true }
)
watch(paused, (value) => {
  if (!toast.value) return
  if (value) clear()
  else restart()
})
</script>

<style scoped>
.ach-toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 120;
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 260px;
  max-width: min(92vw, 380px);
  padding: 12px 14px 16px;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 14px;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.16);
  overflow: hidden;
}
.ach-icon {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, rgba(79, 141, 249, 0.16), rgba(147, 109, 240, 0.16));
}
.ach-body {
  flex: 1;
  min-width: 0;
}
.ach-title {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--accent);
}
.ach-name {
  font-size: 15px;
  font-weight: 800;
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ach-desc {
  font-size: 12px;
  color: var(--text-secondary);
  margin-top: 1px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.ach-close {
  align-self: flex-start;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  padding: 4px 6px;
  border-radius: 8px;
  line-height: 1;
}
.ach-close:hover {
  background: var(--bg-elevated);
  color: var(--text-primary);
}
.ach-timer {
  position: absolute;
  left: 0;
  bottom: 0;
  height: 3px;
  width: 100%;
  transform-origin: left center;
  background: linear-gradient(90deg, #4f8df9, #936df0);
  animation: ach-countdown 4s linear forwards;
}
.ach-timer.paused {
  animation-play-state: paused;
}
@keyframes ach-countdown {
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
}

.toast-enter-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.toast-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translate(-50%, -14px);
}
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -10px);
}
</style>
