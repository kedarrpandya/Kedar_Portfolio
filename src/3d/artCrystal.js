import * as THREE from 'three'

// Art crystal shader - complex, irregular, beautiful
const artCrystalVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vDistortion;
  varying float vDepth;
  varying float vElevation;
  varying float vDistance;
  varying vec3 vOriginalPosition;
  
  void main() {
    vec3 pos = position;
    vOriginalPosition = position;
    
    // Gentle crystal deformation - more subtle
    float mouseDistance = length(uMouse);
    vec2 mouseNorm = normalize(uMouse);
    
    // Subtle crystalline structure deformation
    float crystalNoise = sin(pos.x * 4.0 + uTime * 0.2) * 0.03;
    crystalNoise += cos(pos.y * 5.0 + uTime * 0.3) * 0.02;
    crystalNoise += sin(pos.z * 6.0 + uTime * 0.15) * 0.015;
    
    // Gentle mouse-based energy ripples
    float energyRipple = sin(mouseDistance * 8.0 - uTime * 1.5) * 0.04;
    energyRipple *= smoothstep(0.0, 1.0, mouseDistance);
    
    // Subtle directional crystal growth towards mouse
    vec3 mouseDir3D = vec3(mouseNorm.x, 0.0, mouseNorm.y);
    float crystalGrowth = dot(normalize(pos), mouseDir3D) * mouseDistance * 0.06;
    
    // Apply gentle deformations
    pos += normal * (crystalNoise + energyRipple + crystalGrowth);
    
    // Subtle crystal facet shifting
    float facetShift = sin(length(pos) * 6.0 + uTime * 0.4) * 0.02;
    pos += normal * facetShift;
    
    // Elegant rotation with gentle mouse influence
    float rotationSpeed = 0.06 + mouseDistance * 0.15;
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
    vDistortion = crystalNoise + energyRipple;
    vDepth = -vPosition.z;
    vElevation = pos.y;
    vDistance = length(position);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const artCrystalFragmentShader = `
  uniform float uTime;
  uniform vec3 uCameraPosition;
  uniform vec2 uMouse;
  
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec3 vWorldPosition;
  varying vec2 vUv;
  varying float vDistortion;
  varying float vDepth;
  varying float vElevation;
  varying float vDistance;
  varying vec3 vOriginalPosition;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(uCameraPosition - vPosition);
    
    // EXACT terrain color palette - no bright whites!
    vec3 crystalDeep = vec3(0.219, 0.243, 0.306);   // #383e4e - deep color
    vec3 crystalMid = vec3(0.45, 0.48, 0.52);       // Mid-tone
    vec3 crystalLight = vec3(0.714, 0.729, 0.773);  // #b6bac5 - light color
    
    // Mouse-based subtle effects
    float mouseDistance = length(uMouse);
    float mouseEnergy = mouseDistance * 0.4; // Much more subtle
    
    // Gentle internal crystal structure
    float internalPattern1 = sin(vDistance * 8.0 + uTime * 0.8) * 0.5 + 0.5;
    float internalPattern2 = cos(vElevation * 10.0 + uTime * 0.5) * 0.5 + 0.5;
    float internalPattern3 = sin(vWorldPosition.x * 4.0 + vWorldPosition.z * 4.0 + uTime * 0.3) * 0.5 + 0.5;
    
    float gentleInternal = (internalPattern1 + internalPattern2 + internalPattern3) / 3.0;
    gentleInternal = pow(gentleInternal, 1.2); // Subtle contrast
    
    // Sophisticated fresnel
    float fresnel1 = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.0);
    float fresnel2 = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    
    // Crystal depth effects
    float depthIntensity = smoothstep(0.0, 1.0, vDepth / 4.0);
    
    // Sophisticated color mixing with terrain palette
    vec3 baseColor = mix(crystalDeep, crystalMid, gentleInternal);
    baseColor = mix(baseColor, crystalLight, fresnel1 * 0.5);
    
    // Subtle energy emanation from mouse interaction
    float energyWave = sin(mouseDistance * 6.0 - uTime * 2.0) * 0.5 + 0.5;
    energyWave *= mouseEnergy * 0.3; // Very subtle
    baseColor = mix(baseColor, crystalLight, energyWave * 0.2);
    
    // Gentle rim lighting
    float rim1 = 1.0 - dot(normal, viewDir);
    float rim2 = pow(rim1, 2.0);
    
    baseColor += crystalLight * rim2 * 0.3; // Much more subtle
    
    // Subtle internal reflections
    float refraction = abs(sin(vDistance * 8.0 + uTime * 0.3)) * 0.1;
    baseColor += crystalMid * refraction * gentleInternal * 0.2;
    
    // Mouse-driven subtle energy flow
    vec2 mouseNorm = normalize(uMouse);
    vec3 mouseDir3D = vec3(mouseNorm.x, 0.0, mouseNorm.y);
    float energyFlow = max(0.0, dot(normalize(vWorldPosition), mouseDir3D));
    baseColor += crystalLight * energyFlow * mouseEnergy * 0.2; // Very subtle
    
    // Sophisticated transparency
    float baseAlpha = 0.25 + fresnel1 * 0.3;
    baseAlpha *= (0.5 + depthIntensity * 0.3);
    baseAlpha *= (0.7 + gentleInternal * 0.2);
    
    // Gentle energy-based alpha modulation
    float energyAlpha = 1.0 + energyWave * 0.3 + mouseEnergy * 0.2;
    
    float finalAlpha = baseAlpha * energyAlpha;
    finalAlpha = clamp(finalAlpha, 0.15, 0.65); // More subtle transparency
    
    gl_FragColor = vec4(baseColor, finalAlpha);
  }
`

// Create complex crystal geometry - WAY better than simple sphere!
function createComplexCrystalGeometry() {
  // Start with icosahedron for more complex base
  const baseGeometry = new THREE.IcosahedronGeometry(1.5, 3)
  
  // Get vertex positions
  const positions = baseGeometry.attributes.position.array
  const normals = baseGeometry.attributes.normal.array
  
  // Create irregular crystal faces by modifying vertices
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i]
    const y = positions[i + 1]
    const z = positions[i + 2]
    
    // Calculate distance from center
    const distance = Math.sqrt(x * x + y * y + z * z)
    
    // Create irregular crystal facets
    const noise1 = Math.sin(x * 4.0) * Math.cos(y * 3.0) * Math.sin(z * 5.0) * 0.15
    const noise2 = Math.sin(distance * 8.0) * 0.1
    const noise3 = (Math.random() - 0.5) * 0.08
    
    const totalNoise = noise1 + noise2 + noise3
    
    // Apply deformation along normal
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

export function createArtCrystal() {
  // Complex geometry that will blow minds!
  const geometry = createComplexCrystalGeometry()
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uCameraPosition: { value: new THREE.Vector3() },
      uMouse: { value: new THREE.Vector2(0, 0) }
    },
    vertexShader: artCrystalVertexShader,
    fragmentShader: artCrystalFragmentShader,
    transparent: true,
    blending: THREE.NormalBlending, // Normal blending for sophisticated look
    side: THREE.DoubleSide,
    depthWrite: false,
    alphaTest: 0.001
  })
  
  const crystal = new THREE.Mesh(geometry, material)
  crystal.position.set(0, 1.5, 0)
  crystal.name = 'artCrystal'
  
  return {
    mesh: crystal,
    update: (time, cameraPosition, mousePos = { x: 0, y: 0 }) => {
      material.uniforms.uTime.value = time
      material.uniforms.uCameraPosition.value.copy(cameraPosition)
      
      // Gentle mouse responsiveness
      const targetX = mousePos.x * 0.8
      const targetY = mousePos.y * 0.8
      
      const smoothX = THREE.MathUtils.lerp(material.uniforms.uMouse.value.x, targetX, 0.08)
      const smoothY = THREE.MathUtils.lerp(material.uniforms.uMouse.value.y, targetY, 0.08)
      material.uniforms.uMouse.value.set(smoothX, smoothY)
    }
  }
} 