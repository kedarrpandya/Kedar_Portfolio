import * as THREE from 'three'
import { MeshBVH, acceleratedRaycast, computeBoundsTree, disposeBoundsTree } from 'three-mesh-bvh'
import { gsap } from 'gsap'

// Enable three-mesh-bvh optimizations
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

// Photorealistic concrete/stone shader
const iglooVertexShader = `
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    vec3 pos = position;
    
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(pos, 1.0)).xyz;
    vUv = uv;
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const iglooFragmentShader = `
  uniform float uTime;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  
  void main() {
    // Color palette for igloo blocks
    vec3 darkColor = vec3(0.219, 0.243, 0.306);  // #383e4e
    vec3 lightColor = vec3(0.714, 0.729, 0.773); // #b6bac5
    
    // Create block pattern
    vec2 blockUv = vUv * 8.0;
    vec2 blockId = floor(blockUv);
    vec2 blockLocal = fract(blockUv);
    
    // Block mortar lines
    float mortar = 1.0;
    mortar *= smoothstep(0.0, 0.1, blockLocal.x);
    mortar *= smoothstep(0.0, 0.1, blockLocal.y);
    mortar *= smoothstep(0.9, 1.0, blockLocal.x);
    mortar *= smoothstep(0.9, 1.0, blockLocal.y);
    
    // Block color variation
    float blockVariation = sin(blockId.x * 12.34 + blockId.y * 56.78) * 0.1 + 0.9;
    
    // Mix base colors
    vec3 baseColor = mix(darkColor, lightColor, blockVariation);
    baseColor = mix(darkColor * 0.8, baseColor, mortar);
    
    // Simple lighting
    vec3 lightDir = normalize(vec3(1.0, 1.0, 0.5));
    float NdotL = max(dot(vNormal, lightDir), 0.0);
    
    vec3 finalColor = baseColor * (0.6 + NdotL * 0.4);
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`

export function createIgloo() {
  const iglooGroup = new THREE.Group()
  
  // Main dome
  const domeGeometry = new THREE.SphereGeometry(2.5, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6)
  const domeMaterial = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 }
    },
    vertexShader: iglooVertexShader,
    fragmentShader: iglooFragmentShader,
    side: THREE.DoubleSide
  })
  
  const dome = new THREE.Mesh(domeGeometry, domeMaterial)
  dome.position.y = 0
  iglooGroup.add(dome)
  
  // Entrance tunnel
  const tunnelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 8, 1, true, 0, Math.PI)
  const tunnel = new THREE.Mesh(tunnelGeometry, domeMaterial)
  tunnel.position.set(0, -0.2, 2.2)
  tunnel.rotation.z = Math.PI / 2
  iglooGroup.add(tunnel)
  
  // Entrance arch
  const archGeometry = new THREE.RingGeometry(0.6, 1.0, 8, 1, 0, Math.PI)
  const arch = new THREE.Mesh(archGeometry, domeMaterial)
  arch.position.set(0, 0.4, 3.0)
  iglooGroup.add(arch)
  
  iglooGroup.position.y = -0.5
  iglooGroup.name = 'igloo'
  
  // Add update function
  iglooGroup.update = (time) => {
    domeMaterial.uniforms.uTime.value = time
  }
  
  return iglooGroup
}

// Animation functions
export function animateIglooDisassembly(igloo, duration = 2) {
  const blocks = igloo.userData.blocks
  
  return new Promise((resolve) => {
    blocks.forEach((block, index) => {
      const delay = index * 0.05
      const targetPosition = block.position.clone()
      targetPosition.multiplyScalar(2.5)
      targetPosition.y += Math.random() * 2 + 1
      
      gsap.to(block.position, {
        duration: duration,
        delay: delay,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: "power2.out"
      })
      
      gsap.to(block.rotation, {
        duration: duration,
        delay: delay,
        x: block.rotation.x + (Math.random() - 0.5) * Math.PI,
        y: block.rotation.y + (Math.random() - 0.5) * Math.PI,
        z: block.rotation.z + (Math.random() - 0.5) * Math.PI,
        ease: "power2.out"
      })
    })
    
    setTimeout(resolve, duration * 1000 + blocks.length * 50)
  })
}

export function animateIglooReassembly(igloo, duration = 2) {
  const blocks = igloo.userData.blocks
  
  return new Promise((resolve) => {
    blocks.forEach((block, index) => {
      const delay = index * 0.03
      
      gsap.to(block.position, {
        duration: duration,
        delay: delay,
        x: block.userData.originalPosition.x,
        y: block.userData.originalPosition.y,
        z: block.userData.originalPosition.z,
        ease: "power2.inOut"
      })
      
      gsap.to(block.rotation, {
        duration: duration,
        delay: delay,
        x: block.userData.originalRotation.x,
        y: block.userData.originalRotation.y,
        z: block.userData.originalRotation.z,
        ease: "power2.inOut"
      })
    })
    
    setTimeout(resolve, duration * 1000 + blocks.length * 30)
  })
} 