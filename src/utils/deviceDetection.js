export function detectDevice() {
  const width = window.innerWidth
  const userAgent = navigator.userAgent.toLowerCase()
  
  // Check for mobile devices
  const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
  
  // Check for touch capabilities
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  
  // Determine device type based on screen size and device capabilities
  if (width <= 575) {
    return 'mobile'
  } else if (width <= 768 && (isMobileDevice || isTouchDevice)) {
    return 'tablet'
  } else if (width <= 1024) {
    return 'tablet'
  } else {
    return 'desktop'
  }
}

export function getDeviceCapabilities(deviceType) {
  const capabilities = {
    mobile: {
      maxParticles: 50,
      modelComplexity: 'low',
      animationFPS: 30,
      effects: 'minimal',
      renderScale: 0.7,
      size: { width: 180, height: 180 }
    },
    tablet: {
      maxParticles: 100,
      modelComplexity: 'medium',
      animationFPS: 45,
      effects: 'medium',
      renderScale: 0.8,
      size: { width: 220, height: 220 }
    },
    desktop: {
      maxParticles: 200,
      modelComplexity: 'high',
      animationFPS: 60,
      effects: 'full',
      renderScale: 1.0,
      size: { width: 280, height: 280 }
    }
  }
  
  return capabilities[deviceType] || capabilities.desktop
}

export function isMobileViewport() {
  return window.innerWidth <= 768
}

export function isHighDensityDisplay() {
  return window.devicePixelRatio > 1.5
}

export function getPerformanceMode() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  // Check for low-power mode (battery API if available)
  const isLowPower = navigator.getBattery ? 
    navigator.getBattery().then(battery => battery.charging && battery.level < 0.2) : 
    false
  
  if (prefersReducedMotion || isLowPower) {
    return 'low'
  }
  
  const deviceType = detectDevice()
  return deviceType === 'mobile' ? 'medium' : 'high'
} 