<script>
  export let data;
  import { onMount } from 'svelte';
  
  let skillsRef;
  let visible = false;
  let skillProgress = {};
  let animatedValues = {};
  
  const skillCategories = [
    { name: 'Frontend', skills: ['React', 'Vue', 'Svelte', 'Angular'], color: '#64B5F6', level: 95 },
    { name: 'Backend', skills: ['Node.js', 'Python', 'Java', 'Go'], color: '#81C784', level: 88 },
    { name: 'Database', skills: ['MongoDB', 'PostgreSQL', 'Redis'], color: '#FFB74D', level: 82 },
    { name: 'DevOps', skills: ['Docker', 'AWS', 'CI/CD'], color: '#F06292', level: 75 },
    { name: 'Mobile', skills: ['React Native', 'Flutter'], color: '#BA68C8', level: 70 },
    { name: 'Tools', skills: ['Git', 'VS Code', 'Figma'], color: '#4DB6AC', level: 92 }
  ];

  // Radar chart calculations
  const centerX = 200;
  const centerY = 200;
  const maxRadius = 120;
  const numPoints = skillCategories.length;

  function getRadarPoint(index, value) {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const radius = (value / 100) * maxRadius;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  }

  function getGridPoint(index, level) {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const radius = (level / 100) * maxRadius;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  }

  function getLabelPoint(index) {
    const angle = (index * 2 * Math.PI) / numPoints - Math.PI / 2;
    const radius = maxRadius + 40;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius
    };
  }

  function generatePath(values) {
    return skillCategories.map((_, index) => {
      const point = getRadarPoint(index, values[index] || 0);
      return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
    }).join(' ') + ' Z';
  }

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          animateSkills();
        }
      },
      { threshold: 0.3 }
    );
    
    if (skillsRef) observer.observe(skillsRef);
    
    return () => observer.disconnect();
  });
  
  function animateSkills() {
    const duration = 2000;
    const startTime = Date.now();
    
    function animate() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = easeOutCubic(progress);
      
      // Animate radar chart
      animatedValues = skillCategories.map(category => category.level * easeProgress);
      
      // Animate progress bars
      skillCategories.forEach((category, index) => {
        setTimeout(() => {
          skillProgress[category.name] = category.level;
        }, index * 150);
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }
    
    animate();
  }
  
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }
</script>

<div class="skills-section" bind:this={skillsRef}>
  <div class="section-content">
    <h2 class="section-title">Technical Expertise</h2>
    
    <div class="skills-layout">
      <!-- Central Radar Chart -->
      <div class="chart-center-container">
        <div class="radar-container">
          <svg class="radar-chart" viewBox="0 0 400 400">
            <!-- Grid lines -->
            <g class="grid-lines">
              {#each [20, 40, 60, 80, 100] as level}
                <polygon
                  points={skillCategories.map((_, index) => {
                    const point = getGridPoint(index, level);
                    return `${point.x},${point.y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="rgba(183, 186, 197, 0.1)"
                  stroke-width="1"
                />
              {/each}
            </g>
            
            <!-- Axis lines -->
            <g class="axis-lines">
              {#each skillCategories as _, index}
                {@const point = getGridPoint(index, 100)}
                <line
                  x1={centerX}
                  y1={centerY}
                  x2={point.x}
                  y2={point.y}
                  stroke="rgba(183, 186, 197, 0.2)"
                  stroke-width="1"
                />
              {/each}
            </g>
            
            <!-- Skill area -->
            <g class="skill-area">
              <path
                d={generatePath(animatedValues)}
                fill="url(#skillGradient)"
                stroke="#b6bac5"
                stroke-width="2"
                opacity="0.7"
                class:visible
              />
            </g>
            
            <!-- Skill points -->
            <g class="skill-points">
              {#each skillCategories as category, index}
                {@const point = getRadarPoint(index, animatedValues[index] || 0)}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill={category.color}
                  stroke="#fff"
                  stroke-width="2"
                  class="skill-point"
                  class:visible
                  style="--delay: {index * 0.2}s"
                />
                
                <!-- Labels -->
                {@const labelPoint = getLabelPoint(index)}
                <text
                  x={labelPoint.x}
                  y={labelPoint.y}
                  text-anchor="middle"
                  dominant-baseline="central"
                  class="skill-label"
                  class:visible
                  style="--delay: {index * 0.1}s"
                >
                  {category.name}
                </text>
              {/each}
            </g>
            
            <!-- Gradients -->
            <defs>
              <radialGradient id="skillGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color: rgba(183, 186, 197, 0.4); stop-opacity: 1" />
                <stop offset="100%" style="stop-color: rgba(183, 186, 197, 0.1); stop-opacity: 0.5" />
              </radialGradient>
            </defs>
          </svg>
          
          <!-- Center info -->
          <div class="chart-center">
            <div class="center-icon">⚡</div>
            <div class="center-text">Skills</div>
          </div>
        </div>
      </div>
      
      <!-- Surrounding Skill Cards -->
      <div class="skills-grid">
        {#each skillCategories as category, index}
          <div 
            class="skill-card" 
            class:skill-card-mobile-hidden={index >= 4}
            class:visible
            style="--delay: {index * 0.15}s; --color: {category.color}; --position: {index};"
          >
            <div class="skill-header">
              <div class="skill-icon" style="background: {category.color}">
                {category.name[0]}
              </div>
              <div class="skill-info">
                <h4 class="skill-name">{category.name}</h4>
                <span class="skill-percentage">{skillProgress[category.name] || 0}%</span>
              </div>
            </div>
            
            <div class="skill-progress">
              <div class="progress-track">
                <div 
                  class="progress-fill"
                  style="
                    width: {skillProgress[category.name] || 0}%;
                    background: {category.color};
                  "
                ></div>
              </div>
            </div>
            
            <div class="skill-technologies">
              {#each category.skills as skill}
                <span class="tech-tag" style="border-color: {category.color}40; color: {category.color}">
                  {skill}
                </span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Stats Grid -->
    <div class="stats-grid" class:visible>
      <div class="stat-card">
        <div class="stat-number">3+</div>
        <div class="stat-label">Years Experience</div>
      </div>
      <div class="stat-card">
        <div class="stat-number">50+</div>
        <div class="stat-label">Projects Completed</div>
      </div>
      <div class="stat-card stat-card-mobile-hidden">
        <div class="stat-number">15+</div>
        <div class="stat-label">Technologies</div>
      </div>
      <div class="stat-card stat-card-mobile-hidden">
        <div class="stat-number">95%</div>
        <div class="stat-label">Client Satisfaction</div>
      </div>
    </div>
  </div>
</div>

<style>
  .skills-section {
    min-height: 100vh;
    padding: 4rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    margin: 2rem;
    border: 1px solid rgba(183, 186, 197, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .section-content {
    max-width: 1400px;
    width: 100%;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 200;
    color: #b6bac5;
    text-align: center;
    margin-bottom: 4rem;
    letter-spacing: 2px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  .skills-layout {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 600px;
    margin-bottom: 4rem;
  }

  /* Central Chart Container */
  .chart-center-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10;
  }

  .radar-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .radar-chart {
    width: 400px;
    height: 400px;
    filter: drop-shadow(0 8px 32px rgba(0, 0, 0, 0.3));
  }

  .skill-area path {
    opacity: 0;
    transform: scale(0);
    transform-origin: center;
    transition: all 1.5s ease;
  }

  .skill-area path.visible {
    opacity: 0.7;
    transform: scale(1);
  }

  .skill-point {
    opacity: 0;
    transform: scale(0);
    transition: all 0.8s ease;
    cursor: pointer;
  }

  .skill-point.visible {
    opacity: 1;
    transform: scale(1);
    animation-delay: var(--delay);
  }

  .skill-point:hover {
    r: 8;
    filter: drop-shadow(0 0 8px currentColor);
  }

  .skill-label {
    fill: #b6bac5;
    font-size: 14px;
    font-weight: 500;
    opacity: 0;
    transition: all 0.8s ease;
  }

  .skill-label.visible {
    opacity: 1;
    animation-delay: var(--delay);
  }

  .chart-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    color: #b6bac5;
    pointer-events: none;
  }

  .center-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    animation: pulse 2s ease-in-out infinite;
  }

  .center-text {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* Skills Grid - Surrounding the chart */
  .skills-grid {
    position: relative;
    width: 100%;
    height: 600px;
  }

  .skill-card {
    position: absolute;
    width: 280px;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(15px);
    border-radius: 20px;
    padding: 1.5rem;
    border: 1px solid rgba(183, 186, 197, 0.1);
    opacity: 0;
    transform: scale(0.8);
    transition: all 0.8s ease;
    transition-delay: var(--delay);
  }

  .skill-card.visible {
    opacity: 1;
    transform: scale(1);
  }

  .skill-card:hover {
    border-color: var(--color);
    transform: scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
    z-index: 5;
  }

  /* Position cards around the center */
  .skill-card:nth-child(1) { /* Frontend - Top */
    top: 0;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
  }

  .skill-card:nth-child(1).visible {
    transform: translateX(-50%) scale(1);
  }

  .skill-card:nth-child(2) { /* Backend - Top Right */
    top: 15%;
    right: 0;
    transform: scale(0.8);
  }

  .skill-card:nth-child(2).visible {
    transform: scale(1);
  }

  .skill-card:nth-child(3) { /* Database - Bottom Right */
    bottom: 15%;
    right: 0;
    transform: scale(0.8);
  }

  .skill-card:nth-child(3).visible {
    transform: scale(1);
  }

  .skill-card:nth-child(4) { /* DevOps - Bottom */
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scale(0.8);
  }

  .skill-card:nth-child(4).visible {
    transform: translateX(-50%) scale(1);
  }

  .skill-card:nth-child(5) { /* Mobile - Bottom Left */
    bottom: 15%;
    left: 0;
    transform: scale(0.8);
  }

  .skill-card:nth-child(5).visible {
    transform: scale(1);
  }

  .skill-card:nth-child(6) { /* Tools - Top Left */
    top: 15%;
    left: 0;
    transform: scale(0.8);
  }

  .skill-card:nth-child(6).visible {
    transform: scale(1);
  }

  .skill-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }

  .skill-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 600;
    font-size: 1.1rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  .skill-info {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .skill-name {
    color: #b6bac5;
    font-weight: 400;
    font-size: 1rem;
    margin: 0;
  }

  .skill-percentage {
    color: var(--color);
    font-weight: 600;
    font-size: 1rem;
  }

  .skill-progress {
    margin-bottom: 1rem;
  }

  .progress-track {
    width: 100%;
    height: 6px;
    background: rgba(183, 186, 197, 0.2);
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 1.5s ease;
    position: relative;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 20px;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
    animation: shimmer 2s ease-in-out infinite;
  }

  .skill-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tech-tag {
    padding: 0.2rem 0.6rem;
    border: 1px solid;
    border-radius: 10px;
    font-size: 0.7rem;
    background: rgba(0, 0, 0, 0.4);
    transition: all 0.3s ease;
  }

  .tech-tag:hover {
    background: rgba(183, 186, 197, 0.1);
    transform: translateY(-2px);
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 1s ease 0.5s;
  }

  .stats-grid.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .stat-card {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(183, 186, 197, 0.1);
    border-radius: 20px;
    padding: 2rem;
    text-align: center;
    backdrop-filter: blur(15px);
    transition: all 0.3s ease;
  }

  .stat-card:hover {
    transform: translateY(-5px);
    border-color: rgba(183, 186, 197, 0.3);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }

  .stat-number {
    font-size: 3rem;
    font-weight: 200;
    color: #b6bac5;
    margin-bottom: 0.5rem;
    line-height: 1;
  }

  .stat-label {
    color: rgba(183, 186, 197, 0.7);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 1; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-20px); }
    100% { transform: translateX(20px); }
  }

  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .skills-section {
      padding: 2rem 1rem;
      margin: 1rem;
      border-radius: 15px;
    }
    
    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }
    
    .skills-layout {
      min-height: auto;
      flex-direction: column;
      gap: 2rem;
    }
    
    .chart-center-container {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      margin-bottom: 0;
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .radar-chart {
      width: 280px;
      height: 280px;
    }
    
    .skills-grid {
      display: none;
    }
    
    .skill-card {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      width: 100%;
      transform: none !important;
      padding: 1rem;
    }
    
    /* Hide extra skill cards on mobile - show only first 4 */
    .skill-card-mobile-hidden {
      display: none;
    }
    
    .skill-card.visible {
      transform: none !important;
    }
    
    .skill-name {
      font-size: 0.9rem;
    }
    
    .skill-percentage {
      font-size: 0.9rem;
    }
    
    .tech-tag {
      padding: 0.15rem 0.5rem;
      font-size: 0.65rem;
    }
    
    .stats-grid {
      display: none;
    }
    
    .stat-card {
      padding: 1.2rem;
    }
    
    .stat-number {
      font-size: 1.8rem;
    }
    
    .stat-label {
      font-size: 0.8rem;
    }
    
    /* Hide extra stat cards on mobile - show only first 2 */
    .stat-card-mobile-hidden {
      display: none;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .skills-section {
      padding: 3rem 1.5rem;
      margin: 1.5rem;
    }
    
    .section-title {
      font-size: 2.2rem;
      margin-bottom: 3rem;
    }
    
    .skills-layout {
      min-height: auto;
      flex-direction: column;
      gap: 2rem;
    }
    
    .chart-center-container {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      margin-bottom: 2rem;
    }
    
    .radar-chart {
      width: 280px;
      height: 280px;
    }
    
    .skills-grid {
      height: auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      position: relative;
    }
    
    .skill-card {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      width: 100%;
      transform: none !important;
      padding: 1.2rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .stat-card {
      padding: 1.5rem;
    }
    
    .stat-number {
      font-size: 2.2rem;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .section-title {
      font-size: 2.8rem;
    }
    
    .skills-layout {
      min-height: auto;
      flex-direction: column;
      gap: 3rem;
    }
    
    .chart-center-container {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      margin-bottom: 2rem;
    }
    
    .radar-chart {
      width: 320px;
      height: 320px;
    }
    
    .skills-grid {
      height: auto;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      position: relative;
    }
    
    .skill-card {
      position: relative !important;
      top: auto !important;
      left: auto !important;
      right: auto !important;
      bottom: auto !important;
      width: 100%;
      transform: none !important;
      padding: 1.5rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
  }
  
  /* Large Devices (desktops, 992px - 1199px) */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .skills-layout {
      min-height: 600px;
    }
    
    .radar-chart {
      width: 380px;
      height: 380px;
    }
    
    .skill-card {
      width: 260px;
      padding: 1.5rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  /* Desktop (1200px and up) */
  @media (min-width: 1200px) {
    .skills-layout {
      min-height: 700px;
    }
    
    .radar-chart {
      width: 400px;
      height: 400px;
    }
    
    .skill-card {
      width: 280px;
      padding: 1.8rem;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .skill-card,
    .stat-card {
      min-height: 44px;
    }
    
    .tech-tag {
      min-height: 32px;
      min-width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .tech-tag:hover,
    .stat-card:hover {
      transform: none;
      background: rgba(183, 186, 197, 0.1);
    }
  }
  
  /* Landscape orientation for small screens */
  @media (orientation: landscape) and (max-height: 500px) {
    .skills-section {
      padding: 1.5rem 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .skills-layout {
      min-height: auto;
      flex-direction: row;
      gap: 2rem;
    }
    
    .chart-center-container {
      position: relative;
      top: auto;
      left: auto;
      transform: none;
      margin-bottom: 0;
      margin-right: 2rem;
    }
    
    .radar-chart {
      width: 200px;
      height: 200px;
    }
    
    .skills-grid {
      height: 300px;
      overflow-y: auto;
      flex: 1;
    }
    
    .skill-card {
      padding: 0.8rem;
    }
    
    .stats-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }
    
    .stat-card {
      padding: 1rem;
    }
    
    .stat-number {
      font-size: 1.5rem;
    }
  }
</style> 