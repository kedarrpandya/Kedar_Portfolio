<script>
  import { onMount, onDestroy } from 'svelte'
  import * as THREE from 'three'
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { appState } from '../store/appState.js'
  import { createTerrain } from '../3d/terrain.js'
  import { createLighting } from '../3d/lighting.js'
  import { createVolumetricLighting } from '../3d/volumetricLighting.js'
  import { createArtCrystal } from '../3d/artCrystal.js'
  import { createParticles } from '../3d/particles.js'

  gsap.registerPlugin(ScrollTrigger)

  let canvas
  let scene, camera, renderer
  let terrain, volumetricLight, artCrystal, particles
  let animationId
  let mousePosition = { x: 0, y: 0 }
  let isExperienceStarted = false
  let initialCameraDistance = 50 // Start far away for zoom effect

  onMount(async () => {
    try {
      console.log('Initializing 3D scene...')
      
      await initScene()
      await initObjects()
      setupScrollAnimations()
      startRenderLoop()
      
      // Mouse tracking
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('resize', handleResize)
      
      // Mobile touch support - ensure rendering works on mobile
      window.addEventListener('touchstart', handleTouchStart, { passive: true })
      window.addEventListener('touchmove', handleTouchMove, { passive: true })
      window.addEventListener('touchend', handleTouchEnd, { passive: true })
      
      // Listen for zoom animation trigger
      window.addEventListener('startZoomAnimation', handleZoomAnimation)
      
      // Don't start render loop yet - wait for user interaction
      console.log('3D scene initialized, waiting for click to enter...')
      
    } catch (error) {
      console.error('Failed to initialize scene:', error)
    }

    return cleanup
  })

  onDestroy(cleanup)

  async function initScene() {
    if (!canvas) {
      throw new Error('Canvas not found')
    }

    // Scene with proper color palette
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x383e4e) // Your dark color
    scene.fog = new THREE.Fog(0x383e4e, 10, 50)

    // Camera - start far away for zoom effect
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(-4 * initialCameraDistance/10, 3 * initialCameraDistance/10, 7 * initialCameraDistance/10)
    camera.lookAt(0, 0.5, 0)

    // Renderer with mobile-optimized settings
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: window.devicePixelRatio <= 1, // Disable antialias on high-DPI for performance
      alpha: true,
      powerPreference: "high-performance",
      preserveDrawingBuffer: false, // Better mobile performance
      failIfMajorPerformanceCaveat: false // Allow fallback on mobile
    })
    
    // Mobile-optimized settings
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const pixelRatio = isMobile ? Math.min(window.devicePixelRatio, 2) : Math.min(window.devicePixelRatio, 2)
    
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(pixelRatio)
    renderer.shadowMap.enabled = !isMobile // Disable shadows on mobile for performance
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    
    // Force WebGL context activation
    renderer.getContext().getExtension('WEBGL_lose_context')
    console.log('WebGL context created:', renderer.getContext())

    console.log('Scene setup complete')
  }

  async function initObjects() {
    // Create lighting
    const lighting = createLighting()
    scene.add(lighting.ambientLight)
    scene.add(lighting.directionalLight)
    scene.add(lighting.pointLight)
    console.log('Lighting added to scene')

    // Create main art crystal (center piece)
    artCrystal = createArtCrystal()
    scene.add(artCrystal.mesh)
    console.log('Art crystal created and added to scene:', artCrystal.mesh)
    console.log('Crystal position:', artCrystal.mesh.position)
    console.log('Crystal visible:', artCrystal.mesh.visible)
    console.log('Crystal material:', artCrystal.mesh.material)

    // Create spectacular particles
    particles = createParticles()
    scene.add(particles.mesh)
    console.log('Particles added to scene')

    // Create the beautiful terrain you loved
    terrain = createTerrain()
    scene.add(terrain)
    console.log('Terrain added to scene')

    // Create volumetric lighting for atmosphere
    volumetricLight = createVolumetricLighting()
    scene.add(volumetricLight.mesh)
    console.log('Volumetric lighting added to scene')

    console.log('All objects created successfully')
    console.log('Total scene children:', scene.children.length)
  }

  function setupScrollAnimations() {
    // Scroll-triggered camera animations
    gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          appState.setScrollProgress(self.progress)
        }
      }
    })
    .to(camera.position, {
      duration: 1,
      y: 4,
      z: 8,
      ease: "power2.out"
    })
    .to(camera.position, {
      duration: 1,
      x: -5,
      y: 3,
      z: 10,
      ease: "power2.inOut"
    }, "-=0.5")
  }

  function handleMouseMove(event) {
    // Normalize mouse coordinates to -1 to 1
    mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1
    mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  function handleTouchStart(event) {
    // Handle touch as mouse for mobile
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1
      mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1
    }
    
    // Force render on touch to ensure crystal appears
    if (renderer && scene && camera) {
      renderer.render(scene, camera)
    }
  }

  function handleTouchMove(event) {
    // Handle touch move as mouse move for mobile
    if (event.touches.length > 0) {
      const touch = event.touches[0]
      mousePosition.x = (touch.clientX / window.innerWidth) * 2 - 1
      mousePosition.y = -(touch.clientY / window.innerHeight) * 2 + 1
    }
  }

  function handleTouchEnd(event) {
    // Reset mouse position when touch ends
    mousePosition.x = 0
    mousePosition.y = 0
  }

  function handleZoomAnimation() {
    if (!isExperienceStarted) {
      isExperienceStarted = true
      
      // Start the render loop
      startRenderLoop()
      
      // Animate camera zoom in with GSAP
      gsap.to(camera.position, {
        duration: 2.5,
        x: -4,
        y: 3,
        z: 7,
        ease: "power2.out",
        onUpdate: () => {
          camera.lookAt(0, 0.5, 0)
        },
        onComplete: () => {
          console.log('Zoom animation complete - experience started!')
        }
      })
      
      console.log('Starting zoom animation...')
    }
  }

  function handleResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      
      // Only render if experience has started
      if (isExperienceStarted && renderer && scene && camera) {
        renderer.render(scene, camera)
      }
    }
  }

  function startRenderLoop() {
    function animate() {
      animationId = requestAnimationFrame(animate)
      
      // Only render if experience has started
      if (!isExperienceStarted) return
      
      const time = performance.now() * 0.001

      // Update terrain
      if (terrain && terrain.update) {
        terrain.update(time)
      }

      // Update spectacular particles
      if (particles && particles.update) {
        particles.update(time, mousePosition)
      }

      // Update volumetric lighting
      if (volumetricLight && volumetricLight.update) {
        volumetricLight.update(time, camera.position)
      }

      // Update art crystal with mouse interaction
      if (artCrystal && artCrystal.update) {
        artCrystal.update(time, camera.position, mousePosition)
      }

      // Only do cinematic orbit after zoom animation is complete
      if (gsap.isTweening(camera.position)) {
        // During zoom animation, just look at crystal
        camera.lookAt(0, 0.5, 0)
      } else {
        // Cinematic camera orbit around the crystal
        const radius = 6
        camera.position.x = Math.sin(time * 0.05) * radius + mousePosition.x * 0.5
        camera.position.z = Math.cos(time * 0.05) * radius + mousePosition.y * 0.5
        camera.position.y = 2 + Math.sin(time * 0.03) * 0.5
        camera.lookAt(0, 0.5, 0) // Look at the crystal
      }

      // Render
      if (renderer && scene && camera) {
        renderer.render(scene, camera)
      }
    }
    animate()
  }

  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('touchstart', handleTouchStart)
    window.removeEventListener('touchmove', handleTouchMove)
    window.removeEventListener('touchend', handleTouchEnd)
    window.removeEventListener('startZoomAnimation', handleZoomAnimation)
    
    if (renderer) {
      renderer.dispose()
    }
    
    if (scene) {
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
    }
  }
</script>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 1;
  }
</style> 