import App from './App.svelte'
import './styles/global.css'

// Performance monitoring
const app = new App({
  target: document.getElementById('app')
})

// Remove loading screen once app is mounted
window.addEventListener('load', () => {
  setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen')
    if (loadingScreen) {
      loadingScreen.style.opacity = '0'
      loadingScreen.style.transition = 'opacity 0.5s ease'
      setTimeout(() => loadingScreen.remove(), 500)
    }
  }, 1000)
})

export default app 