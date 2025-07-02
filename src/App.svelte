<script>
  import { onMount } from 'svelte'
  import Scene from './components/Scene.svelte'
  import ScrollingPortfolio from './components/ScrollingPortfolio.svelte'
  import UIOverlay from './components/UIOverlay.svelte'
  import MorphingChatbot from './components/MorphingChatbot.svelte'
  import { appState } from './store/appState.js'
  import { performanceMonitor } from './utils/performanceMonitor.js'

  let mounted = false
  let sceneContainer

  onMount(() => {
    // Initialize performance monitoring
    performanceMonitor.init()
    
    // Mark app as mounted
    mounted = true
    appState.setLoaded(true)
    
    return () => {
      performanceMonitor.destroy()
    }
  })

  // Smooth scroll behavior
  let scrollY = 0
  let innerHeight = 0

  $: parallaxOffset = scrollY * 0.3
</script>

<svelte:window bind:scrollY bind:innerHeight />

<main class="app">
  <!-- 3D Scene Background (Fixed) -->
  <div class="scene-container" bind:this={sceneContainer} style="transform: translateY({parallaxOffset}px)">
    <Scene />
  </div>

  <!-- UI Overlay (Fixed) -->
  <UIOverlay />

  <!-- Portfolio Content (Scrollable) -->
  <div class="portfolio-container">
    <ScrollingPortfolio />
  </div>

  <!-- Morphing Chatbot - Only show after entering portfolio -->
  <MorphingChatbot showAfterEntry={true} />
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #383e4e;
    color: #b6bac5;
    overflow-x: hidden;
    height: auto;
    min-height: 700vh;
  }

  :global(*) {
    box-sizing: border-box;
  }

  :global(html) {
    scroll-behavior: smooth;
    height: 100%;
  }

  .app {
    position: relative;
    min-height: 100vh;
  }



  /* 3D Scene - Fixed Background */
  .scene-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
    pointer-events: none;
  }

  /* Portfolio Content - Scrollable */
  .portfolio-container {
    position: relative;
    z-index: 10;
    background: transparent;
    margin-top: 0;
    min-height: 600vh;
    padding: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .portfolio-container {
      margin-top: 0;
    }
  }
</style> 