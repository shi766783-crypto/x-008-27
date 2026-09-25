import { reactive } from 'vue'

// 成就解锁提示队列：同一次操作解锁多个徽章时按入队顺序逐个展示
export const achievementToastQueue = reactive([])

export function enqueueAchievementToasts(achievements) {
  for (const item of achievements) {
    // 已在队列中的不重复入队，避免同一徽章重复弹出
    if (!achievementToastQueue.some((t) => t.id === item.id)) {
      achievementToastQueue.push(item)
    }
  }
}

export function dismissAchievementToast(id) {
  const index = achievementToastQueue.findIndex((t) => t.id === id)
  if (index !== -1) achievementToastQueue.splice(index, 1)
}
