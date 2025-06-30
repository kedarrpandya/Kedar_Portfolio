<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'
  
  let overlaysVisible = false
  let mouseX = 0
  let mouseY = 0
  let container
  
  const skills = ['SQL', 'Python', 'Tableau', 'React', 'AWS', 'Power BI', 'JavaScript', 'R']
  const metrics = [
    { label: 'Query Performance', value: 95 },
    { label: 'Data Accuracy', value: 98 },
    { label: 'Dashboard Speed', value: 92 },
    { label: 'Model Precision', value: 89 },
    { label: 'ETL Efficiency', value: 94 }
  ]
  
  function handleMouseMove(event) {
    if (container) {
      const rect = container.getBoundingClientRect()
      mouseX = (event.clientX - rect.left) / rect.width
      mouseY = (event.clientY - rect.top) / rect.height
    }
  }
  
  onMount(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove)
      return () => window.removeEventListener('mousemove', handleMouseMove)
    }
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

<div class="technical-overlays" bind:this={container}>
  <!-- Background Matrix Effect -->
  <div class="matrix-background">
    {#each Array(30) as _, i}
      <div 
        class="matrix-line" 
        style="--index: {i}; --mouse-x: {mouseX}; --mouse-y: {mouseY}"
      ></div>
    {/each}
  </div>
  
  <!-- Interactive Data Nodes -->
  <div class="data-nodes">
    {#each Array(12) as _, i}
      <div 
        class="data-node" 
        style="
          --x: {15 + (i % 4) * 20}%; 
          --y: {20 + Math.floor(i / 4) * 25}%; 
          --delay: {i * 0.2}s;
          --mouse-influence: {Math.abs(mouseX - 0.5) + Math.abs(mouseY - 0.5)};
        "
      >
        <div class="node-pulse"></div>
        <div class="node-connections"></div>
      </div>
    {/each}
  </div>
  
  <!-- Floating Code Snippets -->
  <div class="code-snippets">
    <div class="code-snippet top-left">
      <div class="code-line">SELECT * FROM insights</div>
      <div class="code-line">WHERE value > 0.95</div>
    </div>
    
    <div class="code-snippet top-right">
      <div class="code-line">df.transform(analyze)</div>
      <div class="code-line">.visualize()</div>
    </div>
    
    <div class="code-snippet bottom-left">
      <div class="code-line">const data = fetch(api)</div>
      <div class="code-line">.then(render)</div>
    </div>
  </div>
  
  <!-- Skill Constellation -->
  <div class="skill-constellation">
    {#each skills as skill, i}
      <div 
        class="skill-star" 
        style="
          --angle: {(i / skills.length) * 360}deg;
          --delay: {i * 0.1}s;
          --mouse-x: {mouseX};
          --mouse-y: {mouseY};
        "
      >
        <span class="skill-label">{skill}</span>
        <div class="skill-glow"></div>
      </div>
    {/each}
  </div>
  
  <!-- Performance Radar -->
  <div class="performance-radar">
    <div class="radar-center"></div>
    {#each metrics as metric, i}
      <div 
        class="radar-point" 
        style="
          --angle: {(i / metrics.length) * 360}deg;
          --distance: {metric.value}%;
          --delay: {i * 0.15}s;
        "
      >
        <div class="point-indicator"></div>
        <div class="point-label">{metric.label}: {metric.value}%</div>
      </div>
    {/each}
    <svg class="radar-grid" viewBox="0 0 200 200">
      {#each [60, 80, 100] as radius}
        <circle cx="100" cy="100" r="{radius * 0.8}" fill="none" stroke="rgba(183, 186, 197, 0.1)" stroke-width="0.5"/>
      {/each}
      {#each metrics as _, i}
        <line 
          x1="100" y1="100" 
          x2="{100 + Math.cos((i / metrics.length) * 2 * Math.PI - Math.PI/2) * 80}" 
          y2="{100 + Math.sin((i / metrics.length) * 2 * Math.PI - Math.PI/2) * 80}" 
          stroke="rgba(183, 186, 197, 0.1)" 
          stroke-width="0.3"
        />
      {/each}
    </svg>
  </div>
</div>

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

  .technical-overlays {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 2;
    overflow: hidden;
  }
  
  /* Matrix Background Effect */
  .matrix-background {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.3;
  }
  
  .matrix-line {
    position: absolute;
    width: 1px;
    height: 100vh;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(183, 186, 197, calc(0.1 + var(--mouse-influence, 0) * 0.2)),
      transparent
    );
    left: calc(5% + var(--index) * 3%);
    animation: matrixFlow 6s infinite linear;
    animation-delay: calc(var(--index) * -0.2s);
    transform: translateX(calc(var(--mouse-x, 0.5) * 20px));
  }
  
  @keyframes matrixFlow {
    0% { transform: translateY(-100vh) translateX(calc(var(--mouse-x, 0.5) * 20px)); }
    100% { transform: translateY(100vh) translateX(calc(var(--mouse-x, 0.5) * 20px)); }
  }
  
  /* Interactive Data Nodes */
  .data-nodes {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .data-node {
    position: absolute;
    left: var(--x);
    top: var(--y);
    width: 8px;
    height: 8px;
    animation: nodeFloat 4s infinite ease-in-out;
    animation-delay: var(--delay);
    transform: scale(calc(1 + var(--mouse-influence, 0) * 0.5));
  }
  
  .node-pulse {
    width: 100%;
    height: 100%;
    background: rgba(183, 186, 197, 0.6);
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  .node-connections::before,
  .node-connections::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50px;
    height: 1px;
    background: linear-gradient(90deg, rgba(183, 186, 197, 0.3), transparent);
    transform-origin: left center;
    animation: connectionPulse 3s infinite;
  }
  
  .node-connections::after {
    transform: rotate(45deg);
    animation-delay: 0.5s;
  }
  
  @keyframes nodeFloat {
    0%, 100% { transform: translateY(0) scale(calc(1 + var(--mouse-influence, 0) * 0.5)); }
    50% { transform: translateY(-10px) scale(calc(1.2 + var(--mouse-influence, 0) * 0.5)); }
  }
  
  @keyframes connectionPulse {
    0%, 100% { opacity: 0.3; transform: scaleX(1); }
    50% { opacity: 0.8; transform: scaleX(1.5); }
  }
  
  /* Floating Code Snippets */
  .code-snippets {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  
  .code-snippet {
    position: absolute;
    font-family: 'Courier New', monospace;
    font-size: 11px;
    color: rgba(183, 186, 197, 0.7);
    background: rgba(56, 62, 78, 0.1);
    padding: 8px 12px;
    border-radius: 4px;
    border: 1px solid rgba(183, 186, 197, 0.1);
    animation: codeFloat 8s infinite ease-in-out;
  }
  
  .code-snippet.top-left {
    top: 25%;
    left: 15%;
    animation-delay: 0s;
  }
  
  .code-snippet.top-right {
    top: 30%;
    right: 15%;
    animation-delay: 2s;
  }
  
  .code-snippet.bottom-left {
    bottom: 35%;
    left: 20%;
    animation-delay: 4s;
  }
  
  .code-line {
    margin: 2px 0;
    opacity: 0;
    animation: typeLine 0.8s ease-out forwards;
  }
  
  .code-line:nth-child(2) {
    animation-delay: 0.4s;
  }
  
  @keyframes codeFloat {
    0%, 100% { transform: translateY(0) translateX(0); opacity: 0.7; }
    25% { transform: translateY(-15px) translateX(5px); opacity: 0.9; }
    50% { transform: translateY(-5px) translateX(-10px); opacity: 0.8; }
    75% { transform: translateY(-20px) translateX(8px); opacity: 0.9; }
  }
  
  @keyframes typeLine {
    from { opacity: 0; transform: translateX(-10px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  /* Skill Constellation */
  .skill-constellation {
    position: absolute;
    top: 50%;
    right: 10%;
    width: 200px;
    height: 200px;
    transform: translateY(-50%);
  }
  
  .skill-star {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 4px;
    height: 4px;
    transform: 
      translate(-50%, -50%) 
      rotate(var(--angle)) 
      translateY(-60px) 
      rotate(calc(-1 * var(--angle)))
      translateX(calc(var(--mouse-x, 0.5) * 10px))
      translateY(calc(var(--mouse-y, 0.5) * 10px));
    animation: starTwinkle 3s infinite ease-in-out;
    animation-delay: var(--delay);
  }
  
  .skill-label {
    position: absolute;
    top: -15px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    color: rgba(183, 186, 197, 0.8);
    white-space: nowrap;
    font-weight: 600;
  }
  
  .skill-glow {
    width: 100%;
    height: 100%;
    background: rgba(183, 186, 197, 0.8);
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(183, 186, 197, 0.5);
  }
  
  @keyframes starTwinkle {
    0%, 100% { opacity: 0.6; transform: 
      translate(-50%, -50%) 
      rotate(var(--angle)) 
      translateY(-60px) 
      rotate(calc(-1 * var(--angle)))
      translateX(calc(var(--mouse-x, 0.5) * 10px))
      translateY(calc(var(--mouse-y, 0.5) * 10px))
      scale(1); }
    50% { opacity: 1; transform: 
      translate(-50%, -50%) 
      rotate(var(--angle)) 
      translateY(-60px) 
      rotate(calc(-1 * var(--angle)))
      translateX(calc(var(--mouse-x, 0.5) * 10px))
      translateY(calc(var(--mouse-y, 0.5) * 10px))
      scale(1.3); }
  }
  
  /* Performance Radar */
  .performance-radar {
    position: absolute;
    bottom: 15%;
    left: 10%;
    width: 160px;
    height: 160px;
    opacity: 0.8;
  }
  
  .radar-grid {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  
  .radar-center {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 6px;
    background: rgba(183, 186, 197, 0.9);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    box-shadow: 0 0 15px rgba(183, 186, 197, 0.6);
    animation: pulse 2s infinite;
  }
  
  .radar-point {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: 
      translate(-50%, -50%) 
      rotate(var(--angle)) 
      translateY(calc(-1 * var(--distance) * 0.6px))
      rotate(calc(-1 * var(--angle)));
    animation: radarSweep 4s infinite linear;
    animation-delay: var(--delay);
  }
  
  .point-indicator {
    width: 4px;
    height: 4px;
    background: #4ade80;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(74, 222, 128, 0.7);
  }
  
  .point-label {
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 7px;
    color: rgba(183, 186, 197, 0.8);
    white-space: nowrap;
    opacity: 0;
    animation: labelAppear 0.5s ease-out forwards;
    animation-delay: calc(var(--delay) + 1s);
  }
  
  @keyframes radarSweep {
    0% { opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { opacity: 0; }
  }
  
  @keyframes labelAppear {
    from { opacity: 0; transform: translateX(-50%) translateY(5px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  
  /* Responsive Design */
  @media (max-width: 1200px) {
    .technical-overlays {
      display: none;
    }
  }
  
  @media (min-width: 1200px) and (max-width: 1600px) {
    .skill-constellation {
      width: 150px;
      height: 150px;
      right: 5%;
    }
    
    .performance-radar {
      width: 120px;
      height: 120px;
      left: 5%;
    }
    
    .code-snippet {
      font-size: 10px;
      padding: 6px 10px;
    }
  }
</style> 