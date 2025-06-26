import { appState } from '../store/appState.js'

class PerformanceMonitor {
  constructor() {
    this.frameCount = 0
    this.lastTime = performance.now()
    this.fps = 120
    this.isRunning = false
    this.rafId = null
  }

  init() {
    this.isRunning = true
    this.tick()
  }

  tick = () => {
    if (!this.isRunning) return

    const now = performance.now()
    this.frameCount++

    // Calculate FPS every second
    if (now - this.lastTime >= 1000) {
      this.fps = this.frameCount
      this.frameCount = 0
      this.lastTime = now

      // Update store
      appState.updateFPS(this.fps)

      // Auto-adjust quality
      this.adjustQuality()
    }

    this.rafId = requestAnimationFrame(this.tick)
  }

  adjustQuality() {
    if (this.fps < 60) {
      appState.adjustQuality(0.5) // Reduce quality
    } else if (this.fps > 100) {
      appState.adjustQuality(1.0) // Full quality
    }
  }

  destroy() {
    this.isRunning = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  }
}

export const performanceMonitor = new PerformanceMonitor() 