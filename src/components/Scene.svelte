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
      
      console.log('3D scene initialized successfully!')
      
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

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(-4, 3, 7)
    camera.lookAt(0, 0.5, 0)

    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace

    console.log('Scene setup complete')
  }

  async function initObjects() {
    // Create lighting
    const lighting = createLighting()
    scene.add(lighting.ambientLight)
    scene.add(lighting.directionalLight)
    scene.add(lighting.pointLight)

    // Create main art crystal (center piece)
    artCrystal = createArtCrystal()
    scene.add(artCrystal.mesh)

    // Create spectacular particles
    particles = createParticles()
    scene.add(particles.mesh)

    // Create the beautiful terrain you loved
    terrain = createTerrain()
    scene.add(terrain)

    // Create volumetric lighting for atmosphere
    volumetricLight = createVolumetricLighting()
    scene.add(volumetricLight.mesh)

    console.log('All objects created successfully')
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

  function handleResize() {
    if (camera && renderer) {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }

  function startRenderLoop() {
    function animate() {
      animationId = requestAnimationFrame(animate)
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

      // Cinematic camera orbit around the crystal
      const radius = 6
      camera.position.x = Math.sin(time * 0.05) * radius + mousePosition.x * 0.5
      camera.position.z = Math.cos(time * 0.05) * radius + mousePosition.y * 0.5
      camera.position.y = 2 + Math.sin(time * 0.03) * 0.5
      camera.lookAt(0, 0.5, 0) // Look at the crystal

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