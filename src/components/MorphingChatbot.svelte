<script>
  import { onMount, onDestroy, afterUpdate } from 'svelte'
  import { writable } from 'svelte/store'
  import * as THREE from 'three'
  import { portfolioData } from '../data/portfolioData.js'
  import { detectDevice, getDeviceCapabilities } from '../utils/deviceDetection.js'

  // Props
  export let showAfterEntry = false

  // State management
  export let isOpen = false
  const messages = writable([])
  const isTyping = writable(false)
  
  // Entry state - only show after portfolio entry
  let hasEnteredPortfolio = false
  let showChatbot = false
  
  // 3D scene variables
  let container
  let scene, camera, renderer, animationId
  let morphingBot, currentShape = null, holoInterface = null
  let mouse = new THREE.Vector2()
  let isHovered = false
  
  // Physics variables for real-world behavior
  let physics = {
    position: { x: 0, y: 0, z: 0 },
    velocity: { x: 0, y: 0, z: 0 },
    acceleration: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    angularVelocity: { x: 0, y: 0, z: 0 },
    mass: 1.0,
    damping: 0.95,
    springForce: 0.02,
    time: 0
  }
  
  // Device detection
  let isMobile = false
  
  // Chat input
  let inputMessage = ''
  let showQuickActions = true
  
  // 3D Interface state
  let interfaceScale = 0
  let targetScale = 0
  let particles = []
  let messageContainer
  
  // Quick action buttons - professional and minimal
  const quickActions = [
    {
      label: "Experience",
      message: "Tell me about Kedar's professional experience",
      icon: "💼"
    },
    {
      label: "Projects",
      message: "Show me Kedar's key projects",
      icon: "🚀"
    },
    {
      label: "Skills",
      message: "What are Kedar's technical skills?",
      icon: "⚡"
    },
    {
      label: "Contact",
      message: "How can I contact Kedar?",
      icon: "📧"
    }
  ]
  
  // Project mapping for morphing
  const projectShapes = {
    'health-climate': {
      color: '#00C853', // Material green
      geometry: 'box'
    },
    'sql-migration': {
      color: '#2962FF', // Material blue
      geometry: 'cylinder'
    },
    'marinebot': {
      color: '#FF6F00', // Material orange
      geometry: 'sphere'
    },
    'student-management': {
      color: '#AA00FF', // Material purple
      geometry: 'octahedron'
    },
    'default': {
      color: '#90A4AE', // Material blue grey
      geometry: 'dodecahedron'
    }
  }

  // Professional responses based on resume data
  const botResponses = {
    greeting: [
      "Hello! I'm Kedar's professional assistant. I can provide information about his experience, projects, and qualifications. How can I help you today?",
      "Hi! I'm here to help you learn about Kedar's professional background in data analytics and software development.",
      "Welcome! I can discuss Kedar's work experience, technical skills, and projects. What would you like to know?"
    ],
    projects: {
      general: "Kedar has worked on several key projects including climate data analytics, enterprise database migrations, AI-powered robotics, and web applications. Which area interests you?",
      'health-climate': "🌡️ Health in Changing Climate: A comprehensive data analytics platform using Apache Spark and Tableau to visualize climate trends and health impacts. Built with Python, SparkSQL, and Streamlit with regression modeling achieving 16.65% MSE.",
      'sql-migration': "🗄️ SQL Server to Snowflake Migration: Enterprise-scale data pipeline migration project using modern cloud technologies. Engineered scalable data pipelines for enterprise database migration.",
      'marinebot': "🤖 MarineBot Analyst: Real-time underwater robotics dashboard using Flask and AI-powered object detection for marine environment monitoring.",
      'student-management': "💻 Student Lifecycle Management: Hackathon-winning comprehensive platform built in 48 hours for managing student lifecycles with React, Node.js, and PostgreSQL."
    },
    skills: "Kedar's technical expertise includes: BI & Analysis (Tableau, Power BI, SQL - 90%), Programming (Python, SQL, JavaScript - 85%), Data Engineering (ETL, PySpark, Streamlit - 80%), and Tools/Platforms (SSMS, AWS, Git - 82%).",
    experience: "Current: Data Analyst at Great Lakes Greenhouse (Jan 2025-Apr 2025) optimizing BI and greenhouse analytics. Previous: DevOps Engineer at Trend Micro (Jun-Oct 2023), Freelance Data Analyst (2022-2025), and Cybersecurity Intern at Trend Micro (Jan-Jun 2023).",
    education: "Currently pursuing Master of Applied Computing at University of Windsor (Jan 2024-Apr 2025). Completed B.Tech in ICT at Ganpat University, Gujarat (2019-2023) with First Class honors.",
    contact: "📧 Email: pandya18@uwindsor.ca | 📞 Phone: +1 (226) 961-4110 | 🔗 LinkedIn: linkedin.com/in/kedarrpandya | 💻 GitHub: github.com/kedarrpandya | Location: Canada"
  }

  let fabCanvas;
  let fabRenderer, fabScene, fabCamera, fabCrystal, fabAnimationId;

  function initFabCrystal() {
    if (!fabCanvas) return;
    // Clean up previous renderer if any
    if (fabRenderer) {
      fabRenderer.dispose && fabRenderer.dispose();
      fabRenderer.forceContextLoss && fabRenderer.forceContextLoss();
      fabRenderer = null;
    }
    fabScene = new THREE.Scene();
    fabCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    fabCamera.position.z = 2.5;
    fabRenderer = new THREE.WebGLRenderer({ canvas: fabCanvas, alpha: true, antialias: true });
    fabRenderer.setSize(60, 60, false);
    fabRenderer.setClearColor(0x000000, 0);
    // Geometry and material (match main crystal)
    const geometry = new THREE.IcosahedronGeometry(1, 1);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xeaf0fa,
      metalness: 0.2,
      roughness: 0.25,
      transmission: 1.0,
      thickness: 1.2,
      ior: 1.45,
      reflectivity: 0.7,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.0,
      side: THREE.DoubleSide,
      opacity: 0.7,
      transparent: true
    });
    fabCrystal = new THREE.Mesh(geometry, material);
    fabScene.add(fabCrystal);
    // Lighting
    fabScene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dLight.position.set(2, 2, 3);
    fabScene.add(dLight);
    animateFabCrystal();
  }
  function animateFabCrystal() {
    fabAnimationId = requestAnimationFrame(animateFabCrystal);
    if (fabCrystal) {
      fabCrystal.rotation.y += 0.01;
      fabCrystal.rotation.x += 0.007;
    }
    fabRenderer && fabRenderer.render(fabScene, fabCamera);
  }
  function cleanupFabCrystal() {
    if (fabAnimationId) cancelAnimationFrame(fabAnimationId);
    if (fabRenderer) {
      fabRenderer.dispose && fabRenderer.dispose();
      fabRenderer.forceContextLoss && fabRenderer.forceContextLoss();
      fabRenderer = null;
    }
    fabScene = null;
    fabCamera = null;
    fabCrystal = null;
  }

  let causticBgCanvas;
  let causticRenderer, causticScene, causticCamera, causticMesh, causticAnimationId;
  let mouseX = 0, mouseY = 0;

  function initCausticBg() {
    if (!causticBgCanvas) return;
    if (causticRenderer) {
      causticRenderer.dispose && causticRenderer.dispose();
      causticRenderer.forceContextLoss && causticRenderer.forceContextLoss();
      causticRenderer = null;
    }
    causticScene = new THREE.Scene();
    causticCamera = new THREE.PerspectiveCamera(60, 0.5, 0.1, 100);
    causticCamera.position.z = 2.5;
    causticRenderer = new THREE.WebGLRenderer({ canvas: causticBgCanvas, alpha: true, antialias: true });
    causticRenderer.setSize(400, 800, false);
    causticRenderer.setClearColor(0x000000, 0);
    // Caustic/Crystal animated shader
    const geometry = new THREE.PlaneGeometry(3, 6, 128, 256);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor1: { value: new THREE.Color('#181a1f') },
        uColor2: { value: new THREE.Color('#44464d') }
      },
      vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying float vCaustic;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 pos = position;
          float t = uTime * 0.7;
          float caustic = sin(pos.x * 8.0 + t) * cos(pos.y * 12.0 + t * 1.2) * 0.08;
          caustic += sin(pos.x * 16.0 + t * 1.5) * 0.03;
          caustic += cos(pos.y * 20.0 + t * 1.7) * 0.02;
          // Parallax with mouse
          pos.x += uMouse.x * 0.12 * (1.0 - uv.y);
          pos.y += uMouse.y * 0.08 * (1.0 - uv.x);
          pos.z += caustic;
          vCaustic = caustic;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying float vCaustic;
        varying vec2 vUv;
        void main() {
          float caustic = 0.5 + 0.5 * sin(vCaustic * 12.0);
          vec3 color = mix(uColor1, uColor2, vUv.y);
          color += caustic * 0.18;
          float vignette = smoothstep(0.0, 0.7, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
          gl_FragColor = vec4(color, 0.55 * vignette);
        }
      `,
      transparent: true,
      depthWrite: false
    });
    causticMesh = new THREE.Mesh(geometry, material);
    causticScene.add(causticMesh);
    causticAnimationId = requestAnimationFrame(animateCausticBg);
  }
  function animateCausticBg() {
    causticAnimationId = requestAnimationFrame(animateCausticBg);
    if (causticMesh) {
      causticMesh.material.uniforms.uTime.value = performance.now() * 0.001;
      causticMesh.material.uniforms.uMouse.value.set(mouseX, mouseY);
    }
    causticRenderer && causticRenderer.render(causticScene, causticCamera);
  }
  function cleanupCausticBg() {
    if (causticAnimationId) cancelAnimationFrame(causticAnimationId);
    if (causticRenderer) {
      causticRenderer.dispose && causticRenderer.dispose();
      causticRenderer.forceContextLoss && causticRenderer.forceContextLoss();
      causticRenderer = null;
    }
    causticScene = null;
    causticCamera = null;
    causticMesh = null;
  }

  onMount(() => {
    // Only initialize if we should show after entry
    if (showAfterEntry) {
      // Listen for portfolio entry
      window.addEventListener('portfolioEntered', handlePortfolioEntry)
      
      // Check if already entered (in case component mounts after entry)
      if (window.portfolioHasEntered) {
        handlePortfolioEntry()
      }
    } else {
      // Show immediately if not restricted
      initializeChatbot()
    }
  })

  onDestroy(() => {
    cleanup()
    window.removeEventListener('portfolioEntered', handlePortfolioEntry)
  })

  function handlePortfolioEntry() {
    hasEnteredPortfolio = true
    // Delay showing chatbot for a smooth entry
    setTimeout(() => {
      showChatbot = true
      initializeChatbot()
    }, 2000) // Show 2 seconds after portfolio entry
  }

  function initializeChatbot() {
    isMobile = window.innerWidth <= 768
    initScene()
    animate()
    addMessage("Hello! I'm Kedar's professional assistant. I can provide information about his experience, projects, and qualifications. How can I help you today?", 'bot')
    window.addEventListener('resize', handleResize)
  }

  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
    if (renderer) {
      renderer.dispose()
    }
    window.removeEventListener('resize', handleResize)
  }

  function initScene() {
    if (!container) return
    
    // Scene setup
    scene = new THREE.Scene()
    
    // Camera - wider view for 3D interface
    const size = isMobile ? 200 : 300
    camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000)
    camera.position.set(0, 0, 5)
    
    // Renderer with enhanced settings for spectacular effects
    renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    })
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    
    container.appendChild(renderer.domElement)
    
    // Create spectacular crystal system
    createSpectacularCrystal()
    createHolographicInterface()
    createParticleSystem()
    morphToShape('default')
  }

  // Glass crystal shader - same style as main crystal
  const crystalVertexShader = `
    uniform float uTime;
    uniform vec2 uMouse;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying float vDistance;
    varying float vElevation;
    
    void main() {
      vec3 pos = position;
      
      // Gentle crystal deformation like main crystal
      float crystalNoise = sin(pos.x * 4.0 + uTime * 0.2) * 0.02;
      crystalNoise += cos(pos.y * 5.0 + uTime * 0.3) * 0.015;
      crystalNoise += sin(pos.z * 6.0 + uTime * 0.15) * 0.01;
      
      pos += normal * crystalNoise;
      
      // Continuous elegant rotation like main crystal
      float rotationSpeed = 0.8;
      float angle = uTime * rotationSpeed;
      mat3 rotY = mat3(
        cos(angle), 0.0, sin(angle),
        0.0, 1.0, 0.0,
        -sin(angle), 0.0, cos(angle)
      );
      pos = rotY * pos;
      
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
      vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
      vUv = uv;
      vDistance = length(position);
      vElevation = pos.y;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  const crystalFragmentShader = `
    uniform float uTime;
    uniform vec3 uCameraPosition;
    uniform vec2 uMouse;
    uniform vec3 uColor;
    
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec3 vWorldPosition;
    varying vec2 vUv;
    varying float vDistance;
    varying float vElevation;
    
    void main() {
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(uCameraPosition - vPosition);
      
      // Same color palette as main crystal
      vec3 crystalDeep = vec3(0.219, 0.243, 0.306);   // #383e4e
      vec3 crystalMid = vec3(0.45, 0.48, 0.52);       // Mid-tone
      vec3 crystalLight = vec3(0.714, 0.729, 0.773);  // #b6bac5
      
      // Internal crystal structure like main crystal
      float internalPattern1 = sin(vDistance * 8.0 + uTime * 0.8) * 0.5 + 0.5;
      float internalPattern2 = cos(vElevation * 10.0 + uTime * 0.5) * 0.5 + 0.5;
      float internalPattern3 = sin(vWorldPosition.x * 4.0 + vWorldPosition.z * 4.0 + uTime * 0.3) * 0.5 + 0.5;
      
      float internal = (internalPattern1 + internalPattern2 + internalPattern3) / 3.0;
      internal = pow(internal, 1.2);
      
      // Sophisticated fresnel for glass effect
      float fresnel1 = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
      float fresnel2 = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Crystal depth effects
      float depthIntensity = smoothstep(0.0, 1.0, length(vPosition) / 3.0);
      
      // Color mixing with project color influence
      vec3 baseColor = mix(crystalDeep, crystalMid, internal);
      baseColor = mix(baseColor, crystalLight, fresnel1 * 0.6);
      baseColor = mix(baseColor, uColor, 0.3);
      
      // Rim lighting for extra shine
      float rim = 1.0 - dot(normal, viewDir);
      rim = pow(rim, 2.0);
      baseColor += crystalLight * rim * 0.4;
      
      // Internal reflections
      float refraction = abs(sin(vDistance * 8.0 + uTime * 0.3)) * 0.15;
      baseColor += crystalMid * refraction * internal * 0.3;
      
      // Glass transparency
      float baseAlpha = 0.3 + fresnel1 * 0.4;
      baseAlpha *= (0.6 + depthIntensity * 0.3);
      baseAlpha *= (0.8 + internal * 0.2);
      
      float finalAlpha = clamp(baseAlpha, 0.2, 0.7);
      
      gl_FragColor = vec4(baseColor, finalAlpha);
    }
  `

  // Create complex crystal geometry like main crystal
  function createComplexCrystalGeometry() {
    const baseGeometry = new THREE.IcosahedronGeometry(0.6, 2)
    
    const positions = baseGeometry.attributes.position.array
    const normals = baseGeometry.attributes.normal.array
    
    // Create irregular crystal faces
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1] 
      const z = positions[i + 2]
      
      const distance = Math.sqrt(x * x + y * y + z * z)
      
      const noise1 = Math.sin(x * 4.0) * Math.cos(y * 3.0) * Math.sin(z * 5.0) * 0.1
      const noise2 = Math.sin(distance * 8.0) * 0.08
      const noise3 = (Math.random() - 0.5) * 0.05
      
      const totalNoise = noise1 + noise2 + noise3
      
      const nx = normals[i]
      const ny = normals[i + 1]
      const nz = normals[i + 2]
      
      positions[i] += nx * totalNoise
      positions[i + 1] += ny * totalNoise  
      positions[i + 2] += nz * totalNoise
    }
    
    baseGeometry.attributes.position.needsUpdate = true
    baseGeometry.computeVertexNormals()
    
    return baseGeometry
  }

  // Spectacular crystal system with real physics
  function createSpectacularCrystal() {
    const geometry = isOpen
      ? new THREE.IcosahedronGeometry(1, 0)
      : createComplexCrystalGeometry();
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCameraPosition: { value: new THREE.Vector3() },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColor: { value: new THREE.Vector3(0.714, 0.729, 0.773) },
        uInterfaceOpen: { value: 0.0 }
      },
      vertexShader: crystalVertexShader,
      fragmentShader: crystalFragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
      alphaTest: 0.001
    })
    
    morphingBot = new THREE.Mesh(geometry, material)
    morphingBot.scale.set(1.5, 1.5, 1.5) // Larger and more prominent
    morphingBot.castShadow = true
    morphingBot.receiveShadow = true
    scene.add(morphingBot)
    
    // Spectacular lighting system
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
    directionalLight.position.set(2, 3, 2)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    scene.add(directionalLight)
    
    // Multiple point lights for spectacle
    const pointLight1 = new THREE.PointLight(0x4CAF50, 0.8, 15)
    pointLight1.position.set(-2, 2, 2)
    scene.add(pointLight1)
    
    const pointLight2 = new THREE.PointLight(0x2196F3, 0.6, 10)
    pointLight2.position.set(2, -1, 1)
    scene.add(pointLight2)
    
    const pointLight3 = new THREE.PointLight(0xb6bac5, 0.4, 8)
    pointLight3.position.set(0, 3, -1)
    scene.add(pointLight3)
  }

  // Create holographic interface that emerges from crystal
  function createHolographicInterface() {
    // Holographic plane that appears above crystal
    const holoGeometry = new THREE.PlaneGeometry(3, 2, 32, 32)
    
    const holoMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: 0 },
        uOpacity: { value: 0 }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uScale;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vUv = uv;
          
          vec3 pos = position;
          
          // Holographic wave effect
          float wave1 = sin(pos.x * 4.0 + uTime * 2.0) * 0.1;
          float wave2 = cos(pos.y * 3.0 + uTime * 1.5) * 0.05;
          pos.z += (wave1 + wave2) * uScale;
          
          vWave = wave1 + wave2;
          
          // Scale effect
          pos *= uScale;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uOpacity;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          // Holographic grid pattern
          vec2 grid = fract(vUv * 20.0);
          float line = min(smoothstep(0.0, 0.02, grid.x), smoothstep(0.0, 0.02, grid.y));
          
          // Scanning lines
          float scan = sin(vUv.y * 50.0 + uTime * 10.0) * 0.5 + 0.5;
          
          // Holographic color
          vec3 color = vec3(0.2, 0.8, 1.0);
          color += vWave * 0.3;
          
          float alpha = (line * 0.8 + scan * 0.2) * uOpacity;
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    })
    
    holoInterface = new THREE.Mesh(holoGeometry, holoMaterial)
    holoInterface.position.set(0, 2, 0)
    holoInterface.rotation.x = -Math.PI * 0.2
    scene.add(holoInterface)
  }

  // Create particle system for spectacular effects
  function createParticleSystem() {
    const particleCount = isOpen ? 30 : 100
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)
    const scales = new Float32Array(particleCount)
    
    for (let i = 0; i < particleCount; i++) {
      // Emit particles from crystal
      positions[i * 3] = (Math.random() - 0.5) * 2
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2
      
      velocities[i * 3] = (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = Math.random() * 0.03
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02
      
      scales[i] = Math.random() * 0.5 + 0.2
    }
    
    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
    particleGeometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSize: { value: 20.0 },
        uInterfaceOpen: { value: 0.0 }
      },
      vertexShader: `
        attribute float aScale;
        attribute vec3 velocity;
        uniform float uTime;
        uniform float uSize;
        uniform float uInterfaceOpen;
        varying float vAlpha;
        
        void main() {
          vec3 pos = position;
          
          // Particle motion
          pos += velocity * uTime * 50.0;
          
          // Orbit around crystal when interface is open
          float angle = uTime + length(position) * 2.0;
          pos.x += sin(angle) * uInterfaceOpen * 0.5;
          pos.z += cos(angle) * uInterfaceOpen * 0.5;
          
          vAlpha = 1.0 - length(pos) / 5.0;
          vAlpha *= (0.3 + uInterfaceOpen * 0.7);
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uSize * aScale * (1.0 + uInterfaceOpen) * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        
        void main() {
          vec2 center = gl_PointCoord - 0.5;
          float dist = length(center);
          
          if (dist > 0.5) discard;
          
          float alpha = (1.0 - dist * 2.0) * vAlpha;
          vec3 color = vec3(0.7, 0.9, 1.0);
          
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: false
    })
    
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleSystem)
    
    particles.push({ 
      system: particleSystem, 
      geometry: particleGeometry,
      material: particleMaterial,
      positions,
      velocities 
    })
  }

  function morphToShape(projectKey) {
    if (!morphingBot) return
    
    const shapeConfig = projectShapes[projectKey] || projectShapes.default
    currentShape = projectKey
    
    // Update shader color
    if (morphingBot.material && morphingBot.material.uniforms) {
      const newColor = new THREE.Color(shapeConfig.color)
      morphingBot.material.uniforms.uColor.value.setX(newColor.r)
      morphingBot.material.uniforms.uColor.value.setY(newColor.g)
      morphingBot.material.uniforms.uColor.value.setZ(newColor.b)
    }
  }

  function animate() {
    if (!scene || !camera || !renderer) return
    
    animationId = requestAnimationFrame(animate)
    
    const time = performance.now() * 0.001
    physics.time = time
    
    // Real physics simulation
    updatePhysics()
    
    if (morphingBot && morphingBot.material) {
      // Update shader uniforms
      morphingBot.material.uniforms.uTime.value = time
      morphingBot.material.uniforms.uCameraPosition.value.copy(camera.position)
      morphingBot.material.uniforms.uInterfaceOpen.value = isOpen ? 1.0 : 0.0
      
      // Mouse responsiveness with smooth interpolation
      const targetX = mouse.x * 0.5
      const targetY = mouse.y * 0.5
      
      const smoothX = THREE.MathUtils.lerp(morphingBot.material.uniforms.uMouse.value.x, targetX, 0.08)
      const smoothY = THREE.MathUtils.lerp(morphingBot.material.uniforms.uMouse.value.y, targetY, 0.08)
      morphingBot.material.uniforms.uMouse.value.set(smoothX, smoothY)
      
      // Apply physics to crystal position
      morphingBot.position.set(
        physics.position.x, 
        physics.position.y, 
        physics.position.z
      )
      
      // Enhanced rotation with physics
      morphingBot.rotation.x = physics.rotation.x + Math.sin(time * 0.3) * 0.1
      morphingBot.rotation.y = physics.rotation.y + time * 0.5
      morphingBot.rotation.z = physics.rotation.z + Math.cos(time * 0.2) * 0.05
    }
    
    // Update holographic interface
    if (holoInterface) {
      targetScale = isOpen ? 1.0 : 0.0
      interfaceScale += (targetScale - interfaceScale) * 0.1
      
      holoInterface.material.uniforms.uTime.value = time
      holoInterface.material.uniforms.uScale.value = interfaceScale
      holoInterface.material.uniforms.uOpacity.value = interfaceScale * 0.8
      
      // Floating motion
      holoInterface.position.y = 2 + Math.sin(time * 1.5) * 0.2
      holoInterface.rotation.y = time * 0.3
    }
    
    // Update particle systems
    particles.forEach(particle => {
      particle.material.uniforms.uTime.value = time
      particle.material.uniforms.uInterfaceOpen.value = isOpen ? 1.0 : 0.0
      
      // Update particle positions with physics
      const positions = particle.positions
      const velocities = particle.velocities
      const positionAttribute = particle.geometry.attributes.position
      
      for (let i = 0; i < positions.length; i += 3) {
        // Apply velocity
        positions[i] += velocities[i]
        positions[i + 1] += velocities[i + 1]
        positions[i + 2] += velocities[i + 2]
        
        // Apply forces (gravity, magnetic field from crystal)
        const distance = Math.sqrt(positions[i]**2 + positions[i + 1]**2 + positions[i + 2]**2)
        if (distance > 3) {
          // Reset particle if too far
          positions[i] = (Math.random() - 0.5) * 0.5
          positions[i + 1] = (Math.random() - 0.5) * 0.5
          positions[i + 2] = (Math.random() - 0.5) * 0.5
        }
        
        // Magnetic attraction to crystal
        const force = 0.001 / (distance + 0.1)
        velocities[i] -= positions[i] * force
        velocities[i + 1] -= positions[i + 1] * force
        velocities[i + 2] -= positions[i + 2] * force
        
        // Damping
        velocities[i] *= 0.995
        velocities[i + 1] *= 0.995
        velocities[i + 2] *= 0.995
      }
      
      positionAttribute.needsUpdate = true
    })
    
    renderer.render(scene, camera)
  }

  // Real physics simulation
  function updatePhysics() {
    // Reset forces
    physics.acceleration.x = 0
    physics.acceleration.y = 0
    physics.acceleration.z = 0
    
    // Gravitational forces (slight upward float)
    physics.acceleration.y += 0.001
    
    // Mouse interaction forces
    if (isHovered) {
      const mouseForce = 0.002
      physics.acceleration.x += mouse.x * mouseForce
      physics.acceleration.y += mouse.y * mouseForce
    }
    
    // Spring force to center when interface is closed
    if (!isOpen) {
      physics.acceleration.x -= physics.position.x * physics.springForce
      physics.acceleration.y -= physics.position.y * physics.springForce
      physics.acceleration.z -= physics.position.z * physics.springForce
    } else {
      // Floating behavior when open
      physics.acceleration.y += Math.sin(physics.time * 2) * 0.0005
      physics.acceleration.x += Math.cos(physics.time * 1.3) * 0.0003
    }
    
    // Update velocity with acceleration
    physics.velocity.x += physics.acceleration.x
    physics.velocity.y += physics.acceleration.y
    physics.velocity.z += physics.acceleration.z
    
    // Apply damping
    physics.velocity.x *= physics.damping
    physics.velocity.y *= physics.damping
    physics.velocity.z *= physics.damping
    
    // Update position with velocity
    physics.position.x += physics.velocity.x
    physics.position.y += physics.velocity.y
    physics.position.z += physics.velocity.z
    
    // Angular physics
    physics.angularVelocity.x += (Math.random() - 0.5) * 0.001
    physics.angularVelocity.y += (Math.random() - 0.5) * 0.001
    physics.angularVelocity.z += (Math.random() - 0.5) * 0.001
    
    physics.angularVelocity.x *= 0.98
    physics.angularVelocity.y *= 0.98
    physics.angularVelocity.z *= 0.98
    
    physics.rotation.x += physics.angularVelocity.x
    physics.rotation.y += physics.angularVelocity.y
    physics.rotation.z += physics.angularVelocity.z
    
    // Limit position to prevent drifting too far
    const maxDistance = 0.5
    const distance = Math.sqrt(physics.position.x**2 + physics.position.y**2 + physics.position.z**2)
    if (distance > maxDistance) {
      physics.position.x *= maxDistance / distance
      physics.position.y *= maxDistance / distance
      physics.position.z *= maxDistance / distance
    }
  }

  function handleResize() {
    isMobile = window.innerWidth <= 768
    const size = isMobile ? 80 : 120
    
    if (camera && renderer) {
      camera.aspect = 1
      camera.updateProjectionMatrix()
      renderer.setSize(size, size)
    }
  }

  function handleMouseMove(event) {
    if (!container) return
    
    const rect = container.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
  }

  function toggleChat() {
    isOpen = !isOpen
  }

  function addMessage(text, sender) {
    const message = {
      id: Date.now() + Math.random(),
      text,
      sender,
      timestamp: Date.now()
    }
    messages.update(msgs => [...msgs, message])
    
    // Auto scroll to bottom
    setTimeout(() => {
      const chatMessages = document.querySelector('.chat-messages')
      if (chatMessages) {
        chatMessages.scrollTop = chatMessages.scrollHeight
      }
    }, 100)
  }

  async function sendMessage() {
    if (!inputMessage.trim() || chatLimitReached) return;
    addMessage(inputMessage, 'user');
    const userMsg = inputMessage.toLowerCase();
    inputMessage = '';
    showQuickActions = false;
    isTyping.set(true);
    chatCount += 1;
    if (chatCount >= chatLimit) {
      chatLimitReached = true;
    }
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
    const response = await processMessage(userMsg);
    isTyping.set(false);
    addMessage(response.text, 'bot');
  }

  async function handleQuickAction(action) {
    addMessage(action.message, 'user')
    showQuickActions = false
    isTyping.set(true)
    
    await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 800))
    
    const response = await processMessage(action.message.toLowerCase())
    
    isTyping.set(false)
    addMessage(response.text, 'bot')
  }

  async function processMessage(message) {
    // Injected portfolio data for Gemini context
    const portfolioData = `
Professional Summary:
– Detail-oriented Data Scientist / Analyst with hands-on experience building ML pipelines, deploying predictive models, and translating data into business insights using Python, SQL, and modern BI tools.
– Data Scientist with experience designing and deploying predictive ML models, including churn and LTV forecasting, using Python (scikit-learn, XGBoost), SQL, and cloud data platforms like Snowflake and BigQuery.
– Proficient in A/B testing, dashboarding (Looker/Tableau), and lifecycle model development in Agile environments.
– Strong collaborator with a proven track record of translating stakeholder needs into data-driven insights and deployed models.

Experience:
Great Lakes Greenhouse – University of Windsor Jan 2025 – Apr 2025
Data Analyst (SQL & BI) Windsor, ON
– Wrote optimized SQL queries to clean, filter, and structure data for visualization and reporting.
– Built and deployed interactive Tableau dashboards to track greenhouse productivity and workforce KPIs.
– Reduced manual processing by 45% by integrating dashboards directly with SQL Server.
– Collaborated with cross-functional teams to define KPIs, validate outputs, and ensure data accuracy.
Freelance Apr 2022 – Mar 2025
Data Analyst
– Gathered requirements, designed ETL workflows in Python, and modeled data for performance dashboards.
– Built interactive Tableau and Power BI reports for travel and beverage industry clients, improving decision-making.
– Delivered accurate and insightful reporting solutions through multiple Agile development cycles.
– Documented business rules and reporting KPIs, aligned with executive goals.
Trend Micro Inc. Jun 2023 – Oct 2023
DevOps Platform Engineer India
– Collaborated within Agile teams using JIRA and Confluence to manage sprints, document tickets, and iterate based on stakeholder feedback.
– Created automation scripts in Python and Bash to streamline cloud testing and release processes.
– Managed and monitored SQL logs for anomaly detection and incident tracking across test environments.
– Reduced manual workload by 40% through automated reporting of system health KPIs.
Trend Micro Inc. Jan 2023 – Jun 2023
Cyber Security Intern India
– Supported endpoint security tool testing and monitored logs for breach patterns and vulnerabilities.
– Generated internal reports and dashboards tracking network defense KPIs and incidents.
– Assisted senior engineers with penetration testing procedures and patch rollout analysis.
– Documented system alerts and recommended optimizations in policy enforcement.

Technical Skills:
BI & Analysis: Tableau, Power BI, Excel, KPI Design, Report Automation, Agile Methodology
Programming: SQL, Python, Bash, JavaScript, Java
Data Engineering: Data Modeling, ETL, Data Cleaning, PySpark, Streamlit
QA & Testing: Unit Testing, UAT, Debugging, User Story Validation
ML Libraries: scikit-learn, XGBoost, TensorFlow, YOLOv8, Regression Trees, A/B Testing
Cloud Platforms: Snowflake (hands-on), BigQuery (familiar), AWS (S3, Lambda), Streamlit
Containers/CI-CD: Git, Docker (beginner), JIRA, Confluence
Soft Skills: Communication, Requirement Gathering, Stakeholder Alignment, Documentation

Education:
University of Windsor Jan 2024 – Apr 2025
Master of Applied Computing Windsor, ON
Ganpat University Jun 2019 – Jun 2023
B.Tech in ICT (Information and Communication Technology) Gujarat, India

Projects:
Health in Changing Climate — Streamlit, SparkSQL, Tableau
– Created dashboards using Tableau and Streamlit to visualize pollution's effect on global temperature.
– Preprocessed millions of rows using Apache Spark for real-time analytics and reporting.
– Deployed regression tree models to simulate cohort-level LTV and churn predictions (MSE: 16.65%).
– Enabled decision support for climate interventions using hypothesis testing and scenario simulation.
SQL Server to Snowflake Migration — Kafka, AWS S3, Python
– Automated SQL-to-Snowflake pipeline using Apache Kafka stream producers and S3 data lakes.
– Migrated data from SQL Server to Snowflake to support downstream ML and analytics workflows.
– Maintained referential integrity using checkpoints, schema mapping, and robust offset tracking.
– Documented modular ETL scripts for handoff and reuse across Agile sprints using Confluence.
MarineBot Analyst — Flask, YOLOv8, MATLAB
– Built a Flask-based dashboard for real-time marine bot feeds and object detection using YOLOv8.
– Trained underwater classification models with 75%+ accuracy and packaged model outputs for UI integration.
– Implemented MATLAB-based navigation logic and fused IoT sensor data for feedback control.
– Enabled real-time evaluation and tuning using remote dashboard analytics and ML outputs.

Certifications:
Apex One Certification – Level 3 (Trend Micro)
Exam Readiness - AWS Certified Machine Learning – Specialty (AWS)
AWS Certified Developing Machine Learning Applications (AWS)
AWS Certified Demystifying AI/ML/DL (AWS)
Windows Server 2022 Administration (Udemy)

Other Experience:
Best Buy Canada August 2024 – Present
Computer Solutions Advisor - Part time Windsor, ON
– Assisted 60+ customers weekly with troubleshooting, software installations, and PC hardware upgrades.
– Delivered tailored recommendations for personal and enterprise tech solutions using data-driven upselling.
– Managed system diagnostics and helped increase tech support satisfaction scores during the holiday season.
– Collaborated with the Geek Squad team to streamline tech intake and reduce service wait times.

Leadership & Activities:
• Hackathon Lead – Built a Student Lifecycle Management System in 48 hours during national hackathon.
• Placement Coordinator – Facilitated 70+ company drives, assisting 250+ students with placements.

Summary:
– Software Developer with Master's in Applied Computing and 3+ years of experience in full-stack engineering, front-end systems, and cloud-based AI product development.
– Proficient in Java, Kotlin, Python, SQL, JavaScript, with experience in React, Streamlit, and ML-integrated dashboards.
– Built scalable, accessible user-facing applications with strong focus on UX and AI-enhanced productivity tools.
– Led peer design/code reviews and technology stack decisions across freelance and client projects.
`;
    const systemPrompt = `You are Kedar's professional AI assistant for his portfolio website. Use the following information to answer questions about Kedar. Always answer in a polished, concise, and helpful manner.\n\n${portfolioData}`;
    const prompt = `${systemPrompt}\n\nUser: ${message}`;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      // Check for Gemini API error or quota exceeded
      if (data.error || !data.candidates?.[0]?.content?.parts?.[0]?.text) {
        // Fallback: short professional error message
        return {
          text: `I'm currently unable to access the AI service. Please try again later or check back soon.`,
          morphTo: 'default'
        };
      }
      return {
        text: data.candidates?.[0]?.content?.parts?.[0]?.text,
        morphTo: 'default'
      };
    } catch (err) {
      // Fallback: short professional error message
      return {
        text: `I'm currently unable to access the AI service. Please try again later or check back soon.`,
        morphTo: 'default'
      };
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
    // Ensure input works properly for all other keys including space
    event.stopPropagation()
  }

  function resetConversation() {
    messages.set([])
    showQuickActions = true
    addMessage("Hello! I'm Kedar's professional assistant. I can provide information about his experience, projects, and qualifications. How can I help you today?", 'bot')
    morphToShape('default')
  }

  $: if (!isOpen && showChatbot) {
    setTimeout(() => {
      cleanupFabCrystal();
      initFabCrystal();
    }, 0);
  } else {
    cleanupFabCrystal();
  }

  function handleSidebarMouseMove(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    mouseY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  }

  afterUpdate(() => {
    if (messageContainer) {
      messageContainer.scrollTop = messageContainer.scrollHeight;
    }
  });

  let chatCount = 0;
  let chatLimit = 5;
  let chatLimitReached = false;
</script>

<!-- Spectacular 3D Crystal Sidebar Interface -->
{#if showChatbot}
  <!-- Small floating crystal button (FAB) -->
  {#if !isOpen}
    <div class="crystal-fab" role="button" tabindex="0" aria-label="Open chat" on:click={toggleChat} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleChat()}>
      <span class="crystal-fab-pulse"></span>
      <span class="crystal-fab-revolve">
        <svg width="80" height="80" viewBox="0 0 80 80" class="crystal-fab-revolve-svg">
          <circle cx="40" cy="40" r="32" fill="none" stroke="#eaf0fa55" stroke-width="2.5" stroke-dasharray="8 8"/>
        </svg>
      </span>
      <canvas bind:this={fabCanvas} width="60" height="60" class="fab-crystal-canvas" style="display: {isOpen ? 'none' : 'block'}"></canvas>
      <div class="crystal-fab-glow"></div>
      <span class="crystal-fab-tooltip">Chat with Kedar</span>
    </div>
  {/if}
  
  <!-- Crystal sidebar chat, animated in/out -->
  {#if isOpen}
    <div class="crystal-sidebar-system sidebar-animate-in">
      <div class="crystal-sidebar-chat open blackglass-bg dribbble-inspired">
        <canvas class="crystal-mesh-bg dribbble-mesh" bind:this={causticBgCanvas} width="400" height="800" tabindex="-1" aria-hidden="true"></canvas>
        <div class="crystal-header dribbble-header">
          <div class="crystal-title dribbble-title">Ask me about Kedar</div>
          <button class="crystal-close dribbble-close" on:click={toggleChat}>×</button>
        </div>
        <div class="crystal-messages" bind:this={messageContainer}>
          {#each $messages as message (message.id)}
            <div class="crystal-message {message.sender === 'user' ? 'user' : 'bot'}">
              <div class="crystal-message-content">
                {message.text}
                <span class="crystal-message-time-inside {message.sender === 'user' ? 'user' : 'bot'}">{new Date(message.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          {/each}
          {#if $isTyping}
            <div class="crystal-message bot typing">
              <div class="crystal-message-content">
                <span class="crystal-typing-dot"></span><span class="crystal-typing-dot"></span><span class="crystal-typing-dot"></span>
              </div>
            </div>
          {/if}
        </div>
        <div class="crystal-input-section">
          <input type="text" bind:value={inputMessage} on:keydown={handleKeyPress} placeholder="Type your message..." class="crystal-input" autocomplete="off" disabled={chatLimitReached} />
          <button class="crystal-send" on:click={sendMessage} disabled={!inputMessage.trim() || chatLimitReached}>⟶</button>
        </div>
        {#if showQuickActions}
          <div class="crystal-quick-actions">
            {#each quickActions as action, index}
              <button class="crystal-action" on:click={() => handleQuickAction(action)}>{action.label}</button>
            {/each}
          </div>
        {/if}
        <button class="crystal-reset" on:click={resetConversation} title="Reset">↻</button>
      </div>
    </div>
  {/if}
{/if}
{#if chatLimitReached}
  <div class="chat-limit-message">You have reached the free tier limit of 5 chats. Please come back later!</div>
{/if}

<style>
.crystal-fab {
  position: fixed;
  bottom: 2.2rem;
  right: 2.2rem;
  width: 60px;
  height: 60px;
  background: none;
  border: none;
  border-radius: 50%;
  box-shadow: 0 4px 24px #383e4e44;
  z-index: 1100;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: box-shadow 0.2s, transform 0.3s;
  will-change: transform;
  pointer-events: all;
}
.crystal-fab-pulse {
  position: absolute;
  top: 50%; left: 50%;
  width: 80px; height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle, #b6bac5cc 0%, #eaf0fa00 80%);
  opacity: 0.18;
  transform: translate(-50%, -50%) scale(1);
  animation: fab-pulse 2.2s infinite cubic-bezier(.4,0,.2,1);
  pointer-events: none;
  z-index: 0;
}
@keyframes fab-pulse {
  0% { opacity: 0.18; transform: translate(-50%, -50%) scale(1); }
  70% { opacity: 0.10; transform: translate(-50%, -50%) scale(1.18); }
  100% { opacity: 0.0; transform: translate(-50%, -50%) scale(1.35); }
}
.crystal-fab-revolve {
  position: absolute;
  top: 50%; left: 50%;
  width: 80px; height: 80px;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}
.crystal-fab-revolve-svg {
  width: 80px; height: 80px;
  display: block;
  animation: fab-revolve 3.5s linear infinite;
}
@keyframes fab-revolve {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.crystal-fab-revolve-svg text {
  font-size: 0.92rem;
  font-family: 'Inter', Arial, sans-serif;
  letter-spacing: 0.02em;
  dominant-baseline: middle;
}
.crystal-fab-chaticon { display: none; }
.crystal-fab-tooltip {
  position: absolute;
  left: 50%;
  bottom: 70px;
  transform: translateX(-50%) scale(0.95);
  background: rgba(30,32,38,0.92);
  color: #fff;
  font-size: 0.98rem;
  padding: 0.45em 1.1em;
  border-radius: 1.2em;
  box-shadow: 0 2px 12px #0007;
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  transition: opacity 0.18s, transform 0.18s;
  z-index: 10;
}
.crystal-fab:hover .crystal-fab-tooltip,
.crystal-fab:focus .crystal-fab-tooltip {
  opacity: 1;
  transform: translateX(-50%) scale(1);
}
.crystal-fab-glow {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  border-radius: 50%;
  pointer-events: none;
  box-shadow: 0 0 32px 8px #eaf0fa33, 0 0 12px 2px #b6bac544;
  opacity: 0.7;
  z-index: 0;
  animation: fab-glow-pulse 2.5s ease-in-out infinite;
}
@keyframes fab-glow-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
.crystal-sidebar-system.sidebar-animate-in {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  top: unset;
  left: unset;
  transform: none;
  z-index: 1002;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-end;
  box-shadow: 0 4px 32px 8px #0007, 0 1px 8px 0 #2225;
  border-radius: 2.2rem;
  min-height: 540px;
  max-height: 90vh;
  min-width: 400px;
  max-width: 98vw;
  background: none;
  pointer-events: all;
}
@media (max-width: 600px) {
  .crystal-sidebar-system.sidebar-animate-in,
  .crystal-sidebar-chat.open.blackglass-bg.dribbble-inspired {
    right: 0 !important;
    left: 0 !important;
    bottom: 0 !important;
    top: 0 !important;
    width: 100vw !important;
    min-width: 100vw !important;
    max-width: 100vw !important;
    min-height: 100vh !important;
    max-height: 100vh !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
  }
  .crystal-header.dribbble-header {
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding-right: 2.5rem !important;
  }
  .crystal-close.dribbble-close {
    position: absolute !important;
    right: 1rem !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    font-size: 1.7rem !important;
    opacity: 0.7;
    z-index: 10;
    background: none;
    border: none;
    padding: 0 !important;
    margin: 0 !important;
  }
  .crystal-messages {
    max-height: 60vh !important;
    padding: 0 0.2rem !important;
    border-radius: 0.8rem !important;
  }
  .crystal-message-content {
    font-size: 0.98rem !important;
    padding: 1rem 1.1rem 1rem 1.1rem !important;
    max-width: 90vw !important;
    border-radius: 1.2rem !important;
  }
  .crystal-input-section {
    padding: 0.7rem 0.7rem !important;
  }
  .crystal-input {
    font-size: 16px !important; /* Prevent iOS zoom */
    padding: 0.7rem 1rem !important;
    border-radius: 0.9rem !important;
  }
  .crystal-quick-actions {
    gap: 0.3rem !important;
    padding: 0.5rem 0.7rem 0.5rem 0.7rem !important;
  }
  .crystal-action {
    font-size: 0.95rem !important;
    padding: 0.4rem 0.7rem !important;
    border-radius: 0.7rem !important;
  }
  .crystal-reset {
    right: 1.2rem !important;
    bottom: 1.2rem !important;
    font-size: 1.2rem !important;
  }
}
.crystal-sidebar-chat.open.blackglass-bg.dribbble-inspired {
  width: 400px;
  min-height: 540px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch;
  padding-top: 0;
  border-radius: 2.2rem;
  background: linear-gradient(120deg, rgba(18,20,24,0.96) 60%, rgba(30,32,38,0.88) 100%);
  box-shadow: 0 16px 64px 8px rgba(0,0,0,0.7);
  position: relative;
  overflow: hidden;
}
.crystal-mesh-bg.dribbble-mesh {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 0;
  pointer-events: none;
  filter: blur(12px) brightness(1.1) saturate(1.2);
  opacity: 0.7;
  transition: opacity 0.3s;
}
.crystal-header.dribbble-header {
  position: static;
  width: 100%;
  margin: 0;
  height: auto;
  min-height: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, rgba(18,20,24,0.98) 60%, rgba(30,32,38,0.92) 100%);
  box-shadow: 0 4px 32px #000b, 0 1.5px 0 #fff1 inset, 0 8px 24px #0006;
  border-radius: 2.2rem 2.2rem 0 0;
  z-index: 2;
  border: none;
  padding: 1.1rem 2.2rem 1.1rem 2.2rem;
  transition: box-shadow 0.3s, background 0.3s;
}
.crystal-title.dribbble-title {
  color: #fff;
  font-size: 1.45rem;
  font-weight: 800;
  letter-spacing: 0.01em;
  text-align: center;
  flex: 1;
  text-shadow: 0 2px 16px #fff2, 0 1px 4px #000a;
  font-family: 'Inter', 'Manrope', 'Montserrat', Arial, sans-serif;
}
.crystal-close.dribbble-close {
  position: absolute;
  right: 1.2rem;
  top: 0.5rem;
  background: none;
  border: none;
  color: #fff;
  font-size: 1.6rem;
  opacity: 0.7;
  cursor: pointer;
  z-index: 3;
  transition: opacity 0.2s;
}
.crystal-close.dribbble-close:hover {
  opacity: 1;
}
.crystal-messages {
  flex: 1 1 auto;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  width: 100%;
  padding: 0 0.5rem;
  overflow-y: auto;
  max-height: 52vh;
  scrollbar-width: thin;
  scrollbar-color: #444 #222;
  background: linear-gradient(120deg, rgba(24,26,32,0.68) 60%, rgba(30,32,38,0.48) 100%);
  box-shadow: 0 2px 24px #0006 inset, 0 1px 12px #fff1 inset;
  border-radius: 1.7rem;
}
.crystal-messages::-webkit-scrollbar {
  width: 8px;
  background: #222;
  border-radius: 8px;
}
.crystal-messages::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 8px;
}
.crystal-message {
  display: flex;
  width: 100%;
}
.crystal-message.user {
  justify-content: flex-end;
}
.crystal-message.bot {
  justify-content: flex-start;
}
.crystal-message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  background: linear-gradient(120deg, rgba(40,42,50,0.38) 60%, rgba(80,90,110,0.18) 100%);
  box-shadow: 0 4px 24px #0006, 0 1px 8px #fff2 inset;
  border: 1.5px solid rgba(255,255,255,0.08);
  color: #fff;
  text-shadow: 0 1px 8px #0006;
  backdrop-filter: blur(22px) saturate(1.18);
  border-radius: 2.2rem;
  font-size: 0.98rem;
  font-weight: 400;
  max-width: 75%;
  margin: 0.2rem 0;
  padding: 1.2rem 1.7rem 1.2rem 1.7rem;
  word-break: break-word;
  border: none;
  outline: none;
  transition: background 0.2s, border 0.2s, box-shadow 0.3s;
}
.crystal-message.user .crystal-message-content {
  background: linear-gradient(120deg, rgba(60,62,70,0.38) 60%, rgba(120,130,150,0.12) 100%);
  border: 1.5px solid rgba(255,255,255,0.10);
  box-shadow: 0 8px 32px #0004, 0 1px 12px #fff2 inset;
  font-weight: 400;
}
.crystal-message.bot .crystal-message-content {
  background: linear-gradient(120deg, rgba(40,42,50,0.38) 60%, rgba(80,90,110,0.18) 100%);
  border: 1.5px solid rgba(255,255,255,0.08);
  box-shadow: 0 8px 32px #0003, 0 1px 12px #fff1 inset;
  font-weight: 400;
}
.crystal-message-time-inside {
  align-self: flex-end;
  font-size: 0.72rem;
  color: #b6bac5cc;
  opacity: 0.7;
  margin-top: 0.5rem;
  margin-bottom: -0.2rem;
  letter-spacing: 0.01em;
  line-height: 1;
  min-height: 1.1em;
  width: 100%;
  text-align: right;
}
.crystal-message-time-inside.user,
.crystal-message-time-inside.bot {
  text-align: right;
  float: none;
}
.crystal-input-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  background: linear-gradient(120deg, rgba(18,20,24,0.92) 60%, rgba(30,32,38,0.82) 100%);
  backdrop-filter: blur(10px) saturate(1.1);
}
.crystal-input {
  flex: 1;
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  border: none;
  border: 1.5px solid #222b;
  background: rgba(24,26,32,0.85);
  color: #fff;
  font-size: 1rem;
  outline: none;
  margin-right: 0.7rem;
  text-shadow: 0 1px 4px #181e2a99;
  backdrop-filter: blur(6px) saturate(1.1);
}
.crystal-input:focus {
  border: none;
  box-shadow: 0 0 8px #fff2, 0 0 24px #fff1 inset;
  background: linear-gradient(120deg, rgba(60,60,70,0.68) 60%, rgba(100,100,110,0.38) 100%);
}
.crystal-send {
  background: linear-gradient(120deg, rgba(30,30,38,0.48) 60%, rgba(60,60,70,0.28) 100%);
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  font-size: 0.98rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s, box-shadow 0.2s, border 0.2s;
}
.crystal-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.crystal-quick-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.7rem 1.5rem 0.7rem 1.5rem;
}
.crystal-action {
  background: linear-gradient(120deg, rgba(30,30,38,0.48) 60%, rgba(60,60,70,0.28) 100%);
  border: none;
  color: #fff;
  border-radius: 10px;
  padding: 0.5rem 1.1rem;
  font-size: 0.98rem;
  cursor: pointer;
  box-shadow: 0 2px 8px #0002;
  transition: background 0.2s, box-shadow 0.2s, border 0.2s;
}
.crystal-action:hover {
  background: linear-gradient(120deg, rgba(60,60,70,0.68) 60%, rgba(100,100,110,0.38) 100%);
  box-shadow: 0 4px 16px #fff2;
}
.crystal-reset {
  bottom: 1.2rem;
  right: 2.2rem;
  z-index: 3;
  background: linear-gradient(120deg, rgba(30,30,38,0.48) 60%, rgba(60,60,70,0.28) 100%);
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.crystal-reset:hover { opacity: 1; }
@media (max-width: 600px) {
  .crystal-sidebar-system, .crystal-sidebar-chat {
    width: 100vw;
    min-width: 0;
    border-radius: 0;
  }
  .crystal-fab {
    bottom: 1.2rem;
    right: 1.2rem;
    width: 48px;
    height: 48px;
  }
}

/* --- Professional Glassmorphism & Artistic Styling --- */
:global(.crystal-sidebar) {
  background: rgba(30, 36, 50, 0.65);
  backdrop-filter: blur(32px) saturate(120%);
  border-radius: 2.5rem 0 0 2.5rem;
  box-shadow: 0 8px 32px 0 rgba(20, 24, 40, 0.28);
  border: 1.5px solid rgba(120,180,255,0.10);
  position: relative;
  overflow: hidden;
}
:global(.crystal-sidebar)::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('data:image/svg+xml;utf8,<svg width="400" height="800" xmlns="http://www.w3.org/2000/svg"><polygon points="200,20 380,120 320,380 80,380 20,120" fill="white" fill-opacity="0.04"/><polygon points="100,200 300,100 350,300 150,350" fill="white" fill-opacity="0.06"/></svg>') center/cover no-repeat;
  opacity: 0.10;
  pointer-events: none;
  z-index: 0;
}
:global(.crystal-header) {
  background: linear-gradient(120deg, rgba(60,80,120,0.85) 60%, rgba(120,180,255,0.18) 100%);
  border-bottom: 1.5px solid rgba(120,180,255,0.10);
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 2px 12px 0 rgba(31, 38, 135, 0.12);
  color: #fff;
  font-weight: 700;
  font-size: 1.25rem;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  letter-spacing: 0.02em;
  z-index: 1;
}
:global(.message .message-content) {
  background: rgba(40, 50, 70, 0.55);
  border-radius: 1.25rem;
  padding: 1rem 1.5rem;
  font-size: 1.08rem;
  color: #f6faff;
  text-shadow: 0 1px 4px rgba(0,0,0,0.22);
  box-shadow: 0 1px 6px 0 rgba(31, 38, 135, 0.10);
  border: 1px solid rgba(120,180,255,0.10);
  font-family: inherit;
  z-index: 1;
}
:global(.message.user .message-content) {
  background: rgba(80, 120, 180, 0.38);
  color: #fff;
}
:global(.message.bot .message-content) {
  background: rgba(60, 80, 120, 0.55);
  color: #eaf6ff;
}
:global(.input-container input) {
  background: rgba(30,36,50,0.85);
  border: 1.5px solid rgba(120,180,255,0.18);
  border-radius: 1.5rem;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  padding: 0.75rem 1.25rem;
  outline: none;
  box-shadow: 0 1px 4px 0 rgba(31, 38, 135, 0.10);
  transition: border 0.2s, box-shadow 0.2s;
}
:global(.input-container input:focus) {
  border: 1.5px solid #7faaff;
  box-shadow: 0 0 0 2px rgba(120,180,255,0.18);
}
:global(.input-container input::placeholder) {
  color: #b0c8ff;
  opacity: 1;
}
:global(.crystal-btn), :global(.quick-action-btn) {
  background: rgba(40, 50, 70, 0.65);
  border: 1.5px solid rgba(120,180,255,0.18);
  border-radius: 2rem;
  color: #eaf6ff;
  font-weight: 600;
  font-family: inherit;
  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.10);
  transition: background 0.2s, box-shadow 0.2s, border 0.2s;
  letter-spacing: 0.02em;
}
:global(.crystal-btn:hover), :global(.quick-action-btn:hover) {
  background: rgba(80, 120, 180, 0.38);
  border: 1.5px solid #7faaff;
  box-shadow: 0 4px 16px 0 rgba(120,180,255,0.18);
}
:global(.send-btn svg) {
  fill: #b0c8ff;
  transition: fill 0.2s;
}
:global(.send-btn:hover svg) {
  fill: #7faaff;
}
:global(.typing-indicator .dot) {
  background: linear-gradient(120deg, #7faaff 60%, #eaf0fa 100%);
}

/* --- End Professional Styling --- */

/* Mobile-specific styles */
@media (max-width: 600px) {
  .chatbot-panel {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: unset;
    max-width: 100vw;
    max-height: calc(100dvh - var(--header-height, 64px));
    margin: 0 auto;
    border-radius: 24px 24px 0 0;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    background: rgba(18, 22, 34, 0.85);
    backdrop-filter: blur(24px) saturate(180%);
    border: 1.5px solid rgba(255,255,255,0.12);
    z-index: 1002;
    display: flex;
    flex-direction: column;
    animation: popInMobile 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .chatbot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.25rem;
    min-height: var(--header-height, 64px);
    border-radius: 24px 24px 0 0;
    background: rgba(24, 28, 44, 0.92);
    box-shadow: 0 2px 12px 0 rgba(31, 38, 135, 0.13);
    position: relative;
  }
  .close-btn {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(255,255,255,0.08);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    outline: none;
    cursor: pointer;
    transition: background 0.18s;
  }
  .close-btn:active {
    background: rgba(255,255,255,0.18);
  }
  .chatbot-content {
    flex: 1 1 auto;
    overflow-y: auto;
    padding-bottom: 1.5rem;
    padding-top: 0.5rem;
  }
}
@keyframes popInMobile {
  0% {
    transform: translateY(100%) scale(0.98);
    opacity: 0.7;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
.fab-crystal-canvas { display: block; }
:global(.crystal-fab[aria-label="Open chat"][aria-expanded="true"]) .fab-crystal-canvas,
.fab-crystal-canvas[style*="display: none"] {
  display: none !important;
}
.chat-limit-message {
  color: #ff6f61;
  background: rgba(30,32,38,0.92);
  border-radius: 1.2em;
  padding: 0.7em 1.5em;
  margin: 1em auto 0 auto;
  text-align: center;
  font-size: 1.08rem;
  font-weight: 600;
  box-shadow: 0 2px 12px #0007;
  max-width: 90%;
}
</style> 