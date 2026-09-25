import { ref } from 'vue'
import { controllersApi, refreshKeys } from '../data/store.js'

// 全局轻提示队列：同一时间只展示一条，关闭后按入队顺序展示下一条。
const queue = ref([])
const current = ref(null)

let seq = 0

function showNext() {
  if (current.value || queue.value.length === 0) return
  current.value = queue.value.shift()
}

export function pushToast(toast) {
  const key = toast.key
  // 已在队列中或正在展示的提示不重复入队
  if (key && ((current.value && current.value.key === key) || queue.value.some((t) => t.key === key))) return
  queue.value.push({ ...toast, _id: ++seq })
  showNext()
}

export function dismissToast() {
  current.value = null
  // 等当前一条离场后再放下一条，避免同时出现两条
  setTimeout(showNext, 250)
}

export function clearToasts() {
  queue.value = []
  current.value = null
}

export function useToasts() {
  return { current, queue }
}

// 统一的成就检测入口：检测新解锁的徽章，按检测顺序逐个入队展示，
// 已拥有的徽章不会再返回，因此不漏发也不会重复刷。
export function checkAchievements() {
  const earned = controllersApi.achievement.updateAchievements()
  refreshKeys('achievements', 'points')
  for (const item of earned) {
    pushToast({
      key: `achievement-${item.id}`,
      type: 'achievement',
      icon: item.icon,
      title: '成就解锁',
      name: item.name,
      desc: item.desc
    })
  }
  return earned
}
