import { writable, derived } from 'svelte/store'

// Core app state
export const isLoaded = writable(false)
export const currentSection = writable(0)
export const scrollProgress = writable(0)
export const isMenuOpen = writable(false)
export const selectedProject = writable(null)

// Performance state
export const fps = writable(120)
export const qualityLevel = writable(1) // 0.5 = low, 1 = high
export const renderQuality = writable(1)

// Camera state
export const cameraPosition = writable({ x: -3, y: 2.5, z: 6 })
export const cameraTarget = writable({ x: 0, y: 0, z: 0 })

// Scene state
export const iglooBlocks = writable([])
export const particleIntensity = writable(1)

// Derived states
export const shouldReduceQuality = derived(fps, ($fps) => $fps < 60)

// Actions
export const appState = {
  setLoaded: (loaded) => isLoaded.set(loaded),
  setCurrentSection: (section) => currentSection.set(section),
  setScrollProgress: (progress) => scrollProgress.set(progress),
  toggleMenu: () => isMenuOpen.update(open => !open),
  setSelectedProject: (project) => selectedProject.set(project),
  updateFPS: (newFps) => fps.set(newFps),
  adjustQuality: (level) => {
    qualityLevel.set(level)
    renderQuality.set(level)
  },
  updateCamera: (position, target) => {
    cameraPosition.set(position)
    if (target) cameraTarget.set(target)
  },
  renderQuality,
  cameraPosition
} 