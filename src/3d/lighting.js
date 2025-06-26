import * as THREE from 'three'

export function createLighting() {
  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6)
  ambientLight.name = 'ambientLight'
  
  // Main directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5)
  directionalLight.position.set(-2, 6, 4)
  directionalLight.castShadow = true
  directionalLight.name = 'directionalLight'
  
  // Shadow settings for performance and quality
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.left = -10
  directionalLight.shadow.camera.right = 10
  directionalLight.shadow.camera.top = 10
  directionalLight.shadow.camera.bottom = -10
  directionalLight.shadow.bias = -0.0001
  
  // Atmospheric point light for rim lighting
  const pointLight = new THREE.PointLight(0x8899ff, 0.4, 30)
  pointLight.position.set(-8, 4, -8)
  pointLight.name = 'pointLight'
  
  return {
    ambientLight,
    directionalLight,
    pointLight
  }
} 