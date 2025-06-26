import * as THREE from 'three'

// Bloom effect shader
const bloomVertexShader = `
  varying vec2 vUv;
  
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const bloomFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float uBloomStrength;
  uniform float uBloomRadius;
  uniform float uBloomThreshold;
  
  varying vec2 vUv;
  
  void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    
    // Extract bright areas
    float brightness = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    
    if (brightness > uBloomThreshold) {
      color.rgb *= uBloomStrength;
    } else {
      color.rgb *= 0.1;
    }
    
    gl_FragColor = color;
  }
`

// Film grain effect
const filmGrainFragmentShader = `
  uniform sampler2D tDiffuse;
  uniform float uTime;
  uniform float uGrainAmount;
  
  varying vec2 vUv;
  
  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  void main() {
    vec4 color = texture2D(tDiffuse, vUv);
    
    // Add film grain
    float grain = noise(vUv + uTime) * uGrainAmount;
    color.rgb += grain;
    
    // Slight vignette
    float vignette = 1.0 - length(vUv - 0.5);
    vignette = smoothstep(0.3, 0.8, vignette);
    color.rgb *= vignette;
    
    gl_FragColor = color;
  }
`

export function createPostProcessing(renderer, scene, camera) {
  const renderTarget = new THREE.WebGLRenderTarget(
    window.innerWidth,
    window.innerHeight,
    {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType
    }
  )

  // Bloom pass
  const bloomMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      uBloomStrength: { value: 1.5 },
      uBloomRadius: { value: 0.4 },
      uBloomThreshold: { value: 0.85 }
    },
    vertexShader: bloomVertexShader,
    fragmentShader: bloomFragmentShader
  })

  // Film grain pass
  const filmGrainMaterial = new THREE.ShaderMaterial({
    uniforms: {
      tDiffuse: { value: null },
      uTime: { value: 0 },
      uGrainAmount: { value: 0.02 }
    },
    vertexShader: bloomVertexShader,
    fragmentShader: filmGrainFragmentShader
  })

  const quad = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2),
    bloomMaterial
  )

  const effectScene = new THREE.Scene()
  effectScene.add(quad)

  const effectCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

  return {
    render: (time) => {
      // Render main scene to render target
      renderer.setRenderTarget(renderTarget)
      renderer.render(scene, camera)

      // Apply bloom effect
      bloomMaterial.uniforms.tDiffuse.value = renderTarget.texture
      renderer.setRenderTarget(null)
      renderer.render(effectScene, effectCamera)

      // Update time for film grain
      filmGrainMaterial.uniforms.uTime.value = time * 0.001
    },
    
    resize: (width, height) => {
      renderTarget.setSize(width, height)
    },
    
    dispose: () => {
      renderTarget.dispose()
      bloomMaterial.dispose()
      filmGrainMaterial.dispose()
      quad.geometry.dispose()
    }
  }
} 