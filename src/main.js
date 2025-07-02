import App from './App.svelte'
import './styles/global.css'

let app
let sceneInitialized = false

// Initialize app but keep loading screen
function initializeApp() {
  if (!app) {
    app = new App({
      target: document.getElementById('app')
    })
  }
}

// Handle click to enter
function handleClickToEnter() {
  const loadingScreen = document.getElementById('loadingScreen')
  if (!loadingScreen) return
  
  // Add fade out animation
  loadingScreen.classList.add('fade-out')
  
  // Initialize scene with zoom animation
  setTimeout(() => {
    loadingScreen.remove()
    
    // Trigger zoom animation
    triggerZoomAnimation()
    
    // Notify that portfolio has been entered
    window.portfolioHasEntered = true
    window.dispatchEvent(new CustomEvent('portfolioEntered'))
    
    console.log('Entered 3D experience with zoom animation')
  }, 500)
}

// Trigger zoom animation for the crystal scene
function triggerZoomAnimation() {
  // Dispatch custom event for scene to handle zoom
  window.dispatchEvent(new CustomEvent('startZoomAnimation'))
  
  // Also trigger scene initialization
  sceneInitialized = true
}

// Setup click to enter functionality
window.addEventListener('DOMContentLoaded', () => {
  // Initialize app immediately (but keep loading screen)
  initializeApp()
  
  // Setup click handler for loading screen
  const loadingScreen = document.getElementById('loadingScreen')
  if (loadingScreen) {
    // Handle click
    loadingScreen.addEventListener('click', handleClickToEnter)
    
    // Handle touch for mobile
    loadingScreen.addEventListener('touchstart', (e) => {
      e.preventDefault()
      handleClickToEnter()
    }, { passive: false })
    
    // Handle keyboard (Enter/Space)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleClickToEnter()
      }
    })
    
    console.log('Click to enter setup complete')
  }
})

export default app 