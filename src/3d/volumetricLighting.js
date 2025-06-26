import * as THREE from 'three'

// Volumetric lighting shader
const volumetricVertexShader = `
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = normalize(normalMatrix * normal);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const volumetricFragmentShader = `
  uniform float uTime;
  uniform vec3 uLightPosition;
  uniform vec3 uCameraPosition;
  uniform float uDensity;
  uniform vec3 uLightColor;
  
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  
  // Noise function for atmospheric effects
  float noise3D(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453);
  }
  
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    
    for (int i = 0; i < 4; i++) {
      value += amplitude * noise3D(p * frequency);
      frequency *= 2.0;
      amplitude *= 0.5;
    }
    
    return value;
  }
  
  void main() {
    vec3 lightDir = normalize(uLightPosition - vWorldPosition);
    vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
    
    // Calculate distance to light
    float distToLight = length(uLightPosition - vWorldPosition);
    float attenuation = 1.0 / (1.0 + 0.1 * distToLight + 0.01 * distToLight * distToLight);
    
    // Create volumetric fog effect
    vec3 fogPosition = vWorldPosition + vec3(0.0, uTime * 0.1, 0.0);
    float fogNoise = fbm(fogPosition * 0.2);
    
    // Light scattering
    float scattering = pow(max(dot(lightDir, viewDir), 0.0), 2.0);
    
    // Combine effects
    float fogDensity = uDensity * (0.5 + 0.5 * fogNoise) * attenuation;
    vec3 fogColor = uLightColor * scattering * fogDensity;
    
    // Add atmospheric perspective
    float depth = length(vWorldPosition - uCameraPosition);
    float atmosphericFalloff = exp(-depth * 0.01);
    
    gl_FragColor = vec4(fogColor * atmosphericFalloff, fogDensity * 0.3);
  }
`

export function createVolumetricLighting() {
  const geometry = new THREE.SphereGeometry(25, 32, 32)
  
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uLightPosition: { value: new THREE.Vector3(-2, 6, 4) },
      uCameraPosition: { value: new THREE.Vector3() },
      uDensity: { value: 0.4 },
      uLightColor: { value: new THREE.Vector3(1.0, 0.9, 0.8) }
    },
    vertexShader: volumetricVertexShader,
    fragmentShader: volumetricFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  })
  
  const volumetricSphere = new THREE.Mesh(geometry, material)
  volumetricSphere.name = 'volumetricLighting'
  
  return {
    mesh: volumetricSphere,
    update: (time, cameraPosition) => {
      material.uniforms.uTime.value = time
      material.uniforms.uCameraPosition.value.copy(cameraPosition)
    }
  }
} 