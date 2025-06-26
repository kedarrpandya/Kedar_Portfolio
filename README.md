# Arctic Anomaly Portfolio

> **The Arctic Anomaly - Precision Clone Edition**  
> A high-performance 3D portfolio website inspired by igloo.inc, targeting 120 FPS consistently with liquid-smooth animations and pixel-perfect visual fidelity.

## 🎯 Project Goals

This project aims to be a **possible and real replica** of the igloo.inc experience, featuring:

- **120 FPS CONSISTENTLY** - The absolute non-negotiable benchmark
- **Unwavering Smoothness** - Every animation, scroll, and interaction must be perfectly fluid
- **Pixel-Perfect Visuals** - Exact replication of visual elements and aesthetic
- **Advanced 3D Graphics** - Custom shaders, optimized rendering, and performance-first approach

## 🚀 Features

### Core Visual Elements
- **Central Igloo Model** - 3D segmented blocks with glowing seams and ambient effects
- **Igloo Disassembly/Reassembly** - Scroll-driven animation with numbered block labels
- **Icy/Snowy Terrain** - Procedural undulating surface with realistic materials
- **Atmospheric Particles** - Performance-optimized particle system
- **Ice Shard Projects** - Interactive crystalline project modules with refraction effects

### Interactivity & Animations
- **Camera Work** - Cinematic camera movements synchronized with scroll
- **Project Details** - Click ice shards for full-screen project information
- **Contact Particles** - Particle-based morphing animations
- **Scroll Synchronization** - All animations perfectly tied to scroll input

### Performance Optimizations
- **Custom GLSL Shaders** - Hand-optimized for maximum performance
- **Aggressive Culling** - Frustum and occlusion culling
- **Level of Detail (LOD)** - Dynamic quality adjustment based on FPS
- **Efficient Asset Management** - Optimized 3D models and texture compression

## 🛠 Tech Stack

### Core Technologies
- **React 18** - Component architecture and state management
- **Three.js** - 3D graphics and WebGL rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and abstractions
- **Tailwind CSS** - Utility-first styling
- **GSAP** - High-performance animations
- **Zustand** - Lightweight state management

### Performance Tools
- **Vite** - Fast build tool with optimizations
- **Custom Shaders** - GLSL vertex and fragment shaders
- **Performance Monitoring** - Real-time FPS tracking and auto-adjustment
- **Asset Optimization** - Compressed textures and models

## 📁 Project Structure

```
src/
├── components/
│   ├── 3D/                 # Three.js components
│   │   ├── Igloo.jsx       # Central igloo with disassembly animation
│   │   ├── Terrain.jsx     # Procedural icy terrain
│   │   ├── Particles.jsx   # Atmospheric particle system
│   │   ├── IceShards.jsx   # Interactive project modules
│   │   └── CameraController.jsx # Scroll-driven camera movement
│   ├── UI/                 # HTML overlay components
│   │   ├── HeroSection.jsx
│   │   ├── IglooSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── ContactSection.jsx
│   │   ├── Navigation.jsx
│   │   └── ProjectModal.jsx
│   ├── Scene.jsx           # Main 3D scene orchestration
│   ├── UI.jsx              # HTML overlay manager
│   ├── PerformanceMonitor.jsx
│   └── LoadingScreen.jsx
├── store/
│   └── useStore.js         # Zustand state management
├── shaders/                # Custom GLSL shaders (embedded in components)
├── App.jsx                 # Main application component
├── main.jsx                # Application entry point
└── index.css               # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern browser with WebGL 2.0 support

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Performance Monitoring

The application includes real-time performance monitoring:
- **FPS Counter** - Displays current frame rate (top-right corner)
- **Auto Quality Adjustment** - Automatically reduces quality if FPS drops below thresholds
- **Performance Mode Indicator** - Shows current quality level (HIGH/MEDIUM/LOW)

## 🎨 Visual Design

### Color Palette
- **Arctic Blues**: `#06b6d4`, `#22d3ee`, `#67e8f9`
- **Ice Whites**: `#f8fafc`, `#f1f5f9`, `#e2e8f0`
- **Deep Grays**: `#0f172a`, `#1e293b`, `#334155`

### Typography
- **Primary**: Inter (clean, modern)
- **Monospace**: JetBrains Mono (technical elements)

### Animation Principles
- **Easing**: Custom cubic-bezier curves for organic movement
- **Timing**: 60ms for micro-interactions, 300ms for transitions, 600ms+ for major animations
- **Stagger**: 100-200ms delays for sequential element animations

## ⚡ Performance Targets

### Frame Rate Goals
- **Target**: 120 FPS consistently
- **Minimum**: 60 FPS on lower-end devices
- **Degradation**: Automatic quality reduction to maintain performance

### Optimization Strategies
1. **Shader Optimization** - Hand-tuned GLSL with minimal texture lookups
2. **Geometry Optimization** - Low-poly models with efficient UV mapping
3. **Render Pipeline** - Minimal draw calls and state changes
4. **Memory Management** - Efficient buffer usage and garbage collection avoidance

## 🧊 Shader Details

### Igloo Shader
- **Fresnel Effects** - Ice-like reflective properties
- **Animated Seams** - Glowing block borders with time-based animation
- **Material Simulation** - Realistic ice appearance with subsurface scattering

### Terrain Shader
- **Procedural Noise** - Multiple octaves for realistic terrain
- **Ice Texture** - Sparkle effects and surface patterns
- **Performance LOD** - Reduced detail based on performance mode

### Particle Shaders
- **Additive Blending** - Proper alpha compositing for atmospheric effects
- **Billboard Optimization** - Camera-facing sprites with minimal vertex processing

## 🎮 Interaction Guide

### Navigation
- **Scroll** - Progress through scenes and trigger animations
- **Click Ice Shards** - View detailed project information
- **Menu Button** - Access navigation overlay

### Sections
1. **Hero** (0-25%) - IGLOO branding and introduction
2. **Process** (25-50%) - Igloo disassembly demonstration
3. **Projects** (50-75%) - Interactive ice shard portfolio
4. **Contact** (75-100%) - Contact form with particle effects

## 🛡 Browser Support

### Minimum Requirements
- **Chrome 90+**
- **Firefox 88+**
- **Safari 14+**
- **Edge 90+**

### Required Features
- WebGL 2.0
- ES2020 support
- Hardware acceleration enabled

## 📊 Performance Monitoring

The application includes comprehensive performance tracking:

```javascript
// Access performance data
const { fps, performanceMode } = usePerformance()

// Monitor scroll performance
const scrollProgress = useScrollProgress()
```

### Performance Thresholds
- **FPS < 45**: Switch to LOW quality mode
- **FPS 45-75**: Switch to MEDIUM quality mode  
- **FPS > 90**: Switch to HIGH quality mode

## 🚧 Development Notes

### Custom Hooks
- `useScrollProgress()` - Real-time scroll position
- `useCurrentSection()` - Active section index
- `useIglooState()` - Igloo animation state
- `usePerformance()` - FPS and quality metrics

### State Management
All application state is managed through Zustand stores with performance-optimized selectors and minimal re-renders.

### Animation Orchestration
GSAP is used for all UI animations with React Three Fiber handling 3D scene animations for optimal performance separation.

## 🎯 Future Enhancements

- **VR Support** - WebXR integration for immersive experience
- **Advanced Physics** - Realistic ice shard interactions
- **Audio Integration** - Spatial audio for enhanced immersion
- **Progressive Loading** - Streaming asset delivery for faster initial load

## 📄 License

MIT License - Feel free to use this code for your own arctic expeditions!

---

**Built for extreme performance in extreme conditions** ❄️ 