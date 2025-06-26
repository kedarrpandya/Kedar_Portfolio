import * as THREE from 'three'
import { portfolioData } from '../data/portfolioData.js'

// Crystal shader for project modules
const crystalVertexShader = `
  uniform float uTime;
  uniform float uHover;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vec3 pos = position;
    
    // Add slight floating animation
    pos.y += sin(uTime + position.x * 2.0) * 0.1;
    
    // Scale on hover
    pos *= (1.0 + uHover * 0.2);
    
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
    vUv = uv;
    vElevation = pos.y;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const crystalFragmentShader = `
  uniform float uTime;
  uniform float uHover;
  uniform vec3 uColor;
  uniform float uOpacity;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPosition - vPosition);
    
    // Base crystal color
    vec3 baseColor = uColor;
    
    // Fresnel effect for glass-like appearance
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    
    // Internal reflections
    float internal = sin(vElevation * 10.0 + uTime) * 0.1 + 0.9;
    
    // Combine effects
    vec3 finalColor = baseColor * internal;
    finalColor += vec3(fresnel * 0.3);
    
    // Add hover glow
    finalColor += uHover * vec3(0.3, 0.6, 1.0);
    
    float alpha = uOpacity * (0.6 + fresnel * 0.4);
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export function createProjectCrystals() {
  const crystals = []
  const group = new THREE.Group()
  group.name = 'projectCrystals'
  
  // Create crystal geometry (irregular octahedron)
  const createCrystalGeometry = () => {
    const geometry = new THREE.OctahedronGeometry(0.3, 2)
    
    // Make it more irregular and crystal-like
    const positions = geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
      const noise = (Math.random() - 0.5) * 0.1
      positions[i] += noise
      positions[i + 1] += noise
      positions[i + 2] += noise
    }
    
    geometry.attributes.position.needsUpdate = true
    geometry.computeVertexNormals()
    
    return geometry
  }
  
  // Minimal crystal colors - very subtle
  const projectColors = [
    new THREE.Vector3(0.9, 0.9, 0.95),   // Subtle blue-white
    new THREE.Vector3(0.95, 0.9, 0.95),  // Subtle purple-white  
    new THREE.Vector3(0.95, 0.93, 0.9),  // Subtle warm-white
    new THREE.Vector3(0.9, 0.95, 0.92)   // Subtle green-white
  ]
  
  // Create crystals for each project
  portfolioData.projects.forEach((project, index) => {
    const geometry = createCrystalGeometry()
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uHover: { value: 0 },
        uColor: { value: projectColors[index] },
        uOpacity: { value: 0.15 }
      },
      vertexShader: crystalVertexShader,
      fragmentShader: crystalFragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide
    })
    
    const crystal = new THREE.Mesh(geometry, material)
    
    // Position crystals around the igloo - much more minimal
    const angle = (index / portfolioData.projects.length) * Math.PI * 2
    const radius = 4.5 + Math.random() * 0.5
    const height = 1 + Math.random() * 1
    
    crystal.position.set(
      Math.cos(angle) * radius,
      height,
      Math.sin(angle) * radius
    )
    
    // Random rotation
    crystal.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
    )
    
    // Store project data
    crystal.userData = {
      project: project,
      originalPosition: crystal.position.clone(),
      hoverTarget: 0,
      baseColor: projectColors[index].clone()
    }
    
    crystals.push(crystal)
    group.add(crystal)
  })
  
  return {
    group,
    crystals,
    update: (time, camera) => {
      crystals.forEach((crystal, index) => {
        // Update uniforms
        crystal.material.uniforms.uTime.value = time
        
        // Smooth hover transition
        crystal.userData.hoverTarget = THREE.MathUtils.lerp(
          crystal.userData.hoverTarget,
          crystal.material.uniforms.uHover.value,
          0.1
        )
        
        // Floating animation with offset
        const offset = index * 2.5
        crystal.position.y = crystal.userData.originalPosition.y + 
          Math.sin(time * 0.5 + offset) * 0.3
        
        // Slow rotation
        crystal.rotation.y += 0.005
        crystal.rotation.x += 0.003
        
        // Look towards camera slightly
        const direction = new THREE.Vector3()
        direction.subVectors(camera.position, crystal.position).normalize()
        crystal.lookAt(
          crystal.position.x + direction.x * 0.1,
          crystal.position.y,
          crystal.position.z + direction.z * 0.1
        )
      })
    },
    
    onHover: (crystalIndex, isHovering) => {
      if (crystals[crystalIndex]) {
        crystals[crystalIndex].material.uniforms.uHover.value = isHovering ? 1.0 : 0.0
      }
    },
    
    onClick: (crystalIndex) => {
      if (crystals[crystalIndex]) {
        return crystals[crystalIndex].userData.project
      }
      return null
    }
  }
} 