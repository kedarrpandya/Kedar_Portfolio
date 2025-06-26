import * as THREE from 'three'

const particleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  
  attribute float aScale;
  attribute float aSpeed;
  attribute vec3 aOffset;
  
  varying float vAlpha;
  varying float vDistance;
  varying float vEnergy;
  
  void main() {
    vec3 pos = position + aOffset;
    
    // Gentle particle movement
    float time = uTime * aSpeed;
    
    // Subtle orbital motion around crystal
    float orbitRadius = 2.5 + sin(time * 0.2) * 0.8;
    float orbitAngle = time * 0.05 + aOffset.x * 1.5;
    
    pos.x += sin(orbitAngle) * orbitRadius * 0.2;
    pos.z += cos(orbitAngle) * orbitRadius * 0.2;
    
    // Gentle vertical floating
    pos.y += sin(time * 0.5 + aOffset.y * 2.0) * 1.2;
    pos.y += cos(time * 0.3 + aOffset.z * 1.5) * 0.6;
    
    // Subtle mouse interaction - gentle attraction
    vec2 mouseInfluence = uMouse * 1.5;
    vec3 mouseDir = vec3(mouseInfluence.x, 0.0, mouseInfluence.y);
    float mouseDistance = length(uMouse);
    
    // Gentle energy particles flow towards mouse
    pos += mouseDir * mouseDistance * 0.3;
    
    // Subtle scaling based on distance and mouse
    float distanceFromCenter = length(pos);
    float scale = aScale * (1.0 + sin(time) * 0.15);
    scale *= (1.0 + mouseDistance * 0.2);
    
    vAlpha = 1.0 - smoothstep(3.0, 12.0, distanceFromCenter);
    vDistance = distanceFromCenter;
    vEnergy = mouseDistance;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * scale * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const particleFragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  
  varying float vAlpha;
  varying float vDistance;
  varying float vEnergy;
  
  void main() {
    // Create subtle particle shape
    vec2 coord = gl_PointCoord - vec2(0.5);
    float distance = length(coord);
    
    // Gentle energy rings - much more subtle
    float ring1 = 1.0 - smoothstep(0.0, 0.4, distance);
    float ring2 = 1.0 - smoothstep(0.2, 0.5, distance);
    
    // Gentle pulsing core - no harsh flashing
    float pulse = sin(uTime * 2.0 + vDistance * 1.5) * 0.3 + 0.7;
    float gentleCore = ring1 * pulse;
    
    // Subtle energy emanation
    float gentleRing = (ring2 - ring1) * (0.3 + vEnergy * 0.2);
    
    // EXACT terrain color palette - sophisticated!
    vec3 deepColor = vec3(0.219, 0.243, 0.306);    // #383e4e - deep
    vec3 midColor = vec3(0.45, 0.48, 0.52);        // Mid-tone
    vec3 lightColor = vec3(0.714, 0.729, 0.773);   // #b6bac5 - light
    
    // Sophisticated color mixing - no bright whites!
    vec3 finalColor = deepColor * gentleCore * 0.6;
    finalColor += midColor * gentleRing * 0.5;
    finalColor += lightColor * (gentleCore * 0.3 + gentleRing * 0.2);
    
    // Gentle intensity - no harsh brightness
    float intensity = gentleCore * 0.5 + gentleRing * 0.4;
    
    // Subtle mouse-reactive brightness
    intensity *= (0.4 + vEnergy * 0.2);
    
    float alpha = intensity * vAlpha * 0.4; // Much more subtle
    
    if (alpha < 0.01) discard;
    
    gl_FragColor = vec4(finalColor, alpha);
  }
`

export function createParticles() {
  const particleCount = 120 // Reduced for more sophistication
  
  // Geometry
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(particleCount * 3)
  const scales = new Float32Array(particleCount)
  const speeds = new Float32Array(particleCount)
  const offsets = new Float32Array(particleCount * 3)
  
  // Generate sophisticated particle distribution
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3
    
    // More elegant distribution around crystal
    const radius = 6 + Math.random() * 8
    const theta = Math.random() * Math.PI * 2
    const phi = Math.random() * Math.PI
    
    positions[i3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i3 + 1] = (Math.random() - 0.5) * 6 + 1.5
    positions[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta)
    
    // Subtle scales for sophistication
    scales[i] = 0.3 + Math.random() * 0.8
    
    // Gentle speeds for organic movement
    speeds[i] = 0.2 + Math.random() * 0.4
    
    // Random offsets for variation
    offsets[i3] = (Math.random() - 0.5) * 6
    offsets[i3 + 1] = (Math.random() - 0.5) * 6
    offsets[i3 + 2] = (Math.random() - 0.5) * 6
  }
  
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
  geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1))
  geometry.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 3))
  
  // Sophisticated shader material
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uSize: { value: 2.5 } // Smaller, more sophisticated
    },
    vertexShader: particleVertexShader,
    fragmentShader: particleFragmentShader,
    transparent: true,
    blending: THREE.NormalBlending, // Normal blending for sophistication
    depthTest: false,
    vertexColors: false
  })
  
  const particles = new THREE.Points(geometry, material)
  particles.name = 'sophisticatedParticles'
  
  return {
    mesh: particles,
    update: (time, mousePos = { x: 0, y: 0 }) => {
      material.uniforms.uTime.value = time
      material.uniforms.uMouse.value.set(mousePos.x, mousePos.y)
    }
  }
} 