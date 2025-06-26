<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'

  let overlaysVisible = false

  onMount(() => {
    // Delay showing overlays for artistic effect
    setTimeout(() => {
      overlaysVisible = true
      animateOverlays()
    }, 2000)
  })

  function animateOverlays() {
    gsap.timeline({ delay: 0.5 })
      .from('.tech-overlay', {
        opacity: 0,
        y: 20,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
      })
      .from('.wireframe-line', {
        strokeDashoffset: 100,
        duration: 2,
        stagger: 0.1,
        ease: "power2.out"
      }, "-=0.5")
  }
</script>

{#if overlaysVisible}
  <!-- Top Technical Info -->
  <div class="tech-overlay top-left">
    <div class="tech-label">PORTFOLIO_CO_01</div>
    <div class="tech-sublabel">CREATIVE DEVELOPER</div>
  </div>

  <!-- Bottom Info -->
  <div class="tech-overlay bottom-right">
    <div class="tech-date">D 01.02.2024</div>
    <div class="tech-action">CLICK TO EXPLORE</div>
  </div>

  <!-- Wireframe Lines -->
  <svg class="wireframe-overlay" viewBox="0 0 100 100" preserveAspectRatio="none">
    <!-- Top lines connecting to crystal -->
    <path 
      class="wireframe-line" 
      d="M 20 25 L 35 35 L 50 50" 
      stroke="#b6bac5" 
      stroke-width="0.1" 
      fill="none"
      stroke-dasharray="2 2"
      opacity="0.4"
    />
    
    <path 
      class="wireframe-line" 
      d="M 80 20 L 65 35 L 50 50" 
      stroke="#b6bac5" 
      stroke-width="0.1" 
      fill="none"
      stroke-dasharray="2 2"
      opacity="0.4"
    />
    
    <!-- Bottom lines -->
    <path 
      class="wireframe-line" 
      d="M 50 50 L 65 65 L 80 80" 
      stroke="#b6bac5" 
      stroke-width="0.1" 
      fill="none"
      stroke-dasharray="2 2"
      opacity="0.3"
    />
    
    <!-- Corner brackets -->
    <path 
      class="wireframe-line" 
      d="M 15 15 L 25 15 L 25 25" 
      stroke="#b6bac5" 
      stroke-width="0.15" 
      fill="none"
      opacity="0.6"
    />
    
    <path 
      class="wireframe-line" 
      d="M 85 15 L 75 15 L 75 25" 
      stroke="#b6bac5" 
      stroke-width="0.15" 
      fill="none"
      opacity="0.6"
    />
    
    <path 
      class="wireframe-line" 
      d="M 85 85 L 75 85 L 75 75" 
      stroke="#b6bac5" 
      stroke-width="0.15" 
      fill="none"
      opacity="0.6"
    />
  </svg>

  <!-- Scanning Effect -->
  <div class="scanning-line"></div>
{/if}

<style>
  .tech-overlay {
    position: fixed;
    font-family: 'Courier New', monospace;
    color: #b6bac5;
    font-size: 11px;
    letter-spacing: 1px;
    z-index: 200;
    pointer-events: none;
  }

  .top-left {
    top: 15%;
    left: 15%;
  }

  .bottom-right {
    bottom: 25%;
    right: 15%;
    text-align: right;
  }

  .tech-label {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 2px;
    color: #b6bac5;
  }

  .tech-sublabel {
    font-size: 9px;
    color: #383e4e;
    letter-spacing: 2px;
  }

  .tech-date {
    font-size: 10px;
    color: #383e4e;
    margin-bottom: 4px;
  }

  .tech-action {
    font-size: 9px;
    color: #383e4e;
    letter-spacing: 1px;
    border-bottom: 1px solid #383e4e;
    padding-bottom: 1px;
    display: inline-block;
  }

  .wireframe-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 150;
    pointer-events: none;
  }

  .wireframe-line {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
  }

  .scanning-line {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      #b6bac5 50%, 
      transparent 100%
    );
    animation: scan 8s linear infinite;
    z-index: 160;
    pointer-events: none;
    opacity: 0.6;
  }

  @keyframes scan {
    0% {
      top: 0%;
      opacity: 0;
    }
    10% {
      opacity: 0.6;
    }
    90% {
      opacity: 0.6;
    }
    100% {
      top: 100%;
      opacity: 0;
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    .tech-overlay {
      font-size: 9px;
    }
    
    .tech-label {
      font-size: 10px;
    }
  }
</style> 