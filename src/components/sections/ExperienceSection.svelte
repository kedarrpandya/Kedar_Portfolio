<script>
  import { onMount } from 'svelte';
  
  export let data;
  
  let experienceContainer;
  let selectedExperience = 0;
  let isVisible = false;
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
        }
      });
    });
    
    if (experienceContainer) {
      observer.observe(experienceContainer);
    }
    
    return () => observer.disconnect();
  });
  
  function selectExperience(index) {
    selectedExperience = index;
  }
</script>

<div class="experience-section" bind:this={experienceContainer}>
  <div class="section-content">
    <h2 class="section-title">Professional Journey</h2>
    
    <!-- Interactive Timeline -->
    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      {#each data.experience as exp, index}
        <div 
          class="timeline-node" 
          class:active={selectedExperience === index}
          class:visible={isVisible}
          style="--delay: {index * 0.2}s; --color: {exp.color}"
          on:click={() => selectExperience(index)}
          on:keydown={(e) => e.key === 'Enter' && selectExperience(index)}
          role="button"
          tabindex="0"
        >
          <div class="node-marker">
            <div class="node-pulse"></div>
            <div class="node-year">{exp.startDate.split(' ')[1] || exp.startDate}</div>
          </div>
          <div class="node-content">
            <h3 class="node-role">{exp.role}</h3>
            <p class="node-company">{exp.company}</p>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Mobile Experience Cards -->
    <div class="mobile-experience-grid">
      {#each data.experience as exp, index}
        <div class="mobile-exp-card" style="--color: {exp.color}">
          <div class="mobile-card-header">
            <div class="mobile-company-badge" style="background: {exp.color}">
              {exp.company.split(' ')[0][0]}{exp.company.split(' ')[1] ? exp.company.split(' ')[1][0] : ''}
            </div>
            <div class="mobile-exp-info">
              <h3 class="mobile-role">{exp.role}</h3>
              <p class="mobile-company">{exp.company}</p>
              <span class="mobile-duration">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
            </div>
            {#if exp.current}
              <div class="mobile-current-badge">NOW</div>
            {/if}
          </div>
          
          <div class="mobile-card-body">
            <p class="mobile-description">{exp.description.substring(0, 120)}...</p>
            
            <div class="mobile-impact" style="border-left: 3px solid {exp.color}">
              💡 {exp.impact}
            </div>
            
            <div class="mobile-tech-tags">
              {#each exp.technologies.slice(0, 3) as tech}
                <span class="mobile-tech-tag" style="background: {exp.color}20; color: {exp.color}">
                  {tech}
                </span>
              {/each}
              {#if exp.technologies.length > 3}
                <span class="mobile-tech-more">+{exp.technologies.length - 3}</span>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Experience Details Card -->
    <div class="experience-card" class:visible={isVisible}>
      {#if data.experience[selectedExperience]}
        {@const exp = data.experience[selectedExperience]}
        <div class="card-header" style="border-left: 4px solid {exp.color}">
          <div class="header-content">
            <h3 class="card-role">{exp.role}</h3>
            <div class="card-meta">
              <span class="card-company">{exp.company}</span>
              <span class="card-location">📍 {exp.location}</span>
              <span class="card-duration">🗓️ {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
              <span class="card-type" style="background: {exp.color}20; color: {exp.color}">
                {exp.type.toUpperCase()}
              </span>
            </div>
          </div>
          {#if exp.current}
            <div class="current-badge">CURRENT</div>
          {/if}
        </div>
        
        <div class="card-body">
          <p class="card-description card-description-mobile">{exp.description.substring(0, 120)}...</p>
          <p class="card-description card-description-desktop">{exp.description}</p>
          
          <!-- Impact Highlight -->
          {#if exp.impact}
            <div class="impact-section">
              <h4>🎯 Key Impact</h4>
              <div class="impact-highlight" style="border-left: 3px solid {exp.color}">
                {exp.impact}
              </div>
            </div>
          {/if}
          
          <!-- Achievements Grid -->
          <div class="achievements-section">
            <h4>🏆 Key Achievements</h4>
            <div class="achievements-grid">
              {#each exp.achievements as achievement, i}
                <div 
                  class="achievement-item" 
                  class:achievement-mobile-hidden={i >= 2}
                  style="--delay: {i * 0.1}s"
                  class:visible={isVisible}
                >
                  <div class="achievement-icon">✓</div>
                  <span class="achievement-text-mobile">{achievement.substring(0, 80)}...</span>
                  <span class="achievement-text-desktop">{achievement}</span>
                </div>
              {/each}
            </div>
          </div>
          
          <!-- Tech Stack Visualization -->
          <div class="tech-section">
            <h4>🛠️ Technologies Used</h4>
            <div class="tech-cloud">
              {#each exp.technologies as tech, i}
                <span 
                  class="tech-tag" 
                  style="--delay: {i * 0.05}s; background: {exp.color}15; border-color: {exp.color}30"
                  class:visible={isVisible}
                >
                  {tech}
                </span>
              {/each}
            </div>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .experience-section {
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
    font-size: 3.5rem;
    font-weight: 200;
    color: #b6bac5;
    text-align: center;
    margin-bottom: 4rem;
    letter-spacing: 3px;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }
  
  /* Interactive Timeline */
  .timeline-container {
    position: relative;
    display: flex;
    justify-content: space-between;
    margin: 4rem 0;
    padding: 2rem 0;
  }
  
  .timeline-line {
    display: none;
  }
  
  .timeline-node {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.4s ease;
    z-index: 2;
    opacity: 0;
    transform: translateY(30px);
  }
  
  .timeline-node.visible {
    animation: slideUp 0.6s ease forwards;
    animation-delay: var(--delay);
  }
  
  .timeline-node.active .node-marker {
    background: var(--color);
    box-shadow: 0 0 20px var(--color), 0 0 40px var(--color)30;
    transform: scale(1.2);
  }
  
  .node-marker {
    position: relative;
    width: 20px;
    height: 20px;
    background: rgba(183, 186, 197, 0.3);
    border-radius: 50%;
    border: 3px solid #b6bac5;
    transition: all 0.4s ease;
    margin-bottom: 1rem;
  }
  
  .timeline-node:hover .node-marker {
    background: var(--color);
    transform: scale(1.1);
  }
  
  .node-pulse {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: var(--color);
    opacity: 0.3;
    animation: pulse 2s infinite;
  }
  
  .timeline-node.active .node-pulse {
    animation: pulse 1s infinite;
  }
  
  .node-year {
    position: absolute;
    top: -40px;
    font-size: 0.8rem;
    color: #b6bac5;
    font-weight: 600;
    white-space: nowrap;
  }
  
  .node-content {
    text-align: center;
    min-width: 120px;
  }
  
  .node-role {
    font-size: 0.9rem;
    color: #b6bac5;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }
  
  .node-company {
    font-size: 0.8rem;
    color: rgba(183, 186, 197, 0.7);
  }
  
  /* Experience Card */
  .experience-card {
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    padding: 0;
    border: 1px solid rgba(183, 186, 197, 0.1);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
    margin-top: 3rem;
    opacity: 0;
    transform: translateY(40px);
    transition: all 0.6s ease;
  }
  
  .experience-card.visible {
    opacity: 1;
    transform: translateY(0);
  }
  
  .card-header {
    padding: 2rem;
    border-bottom: 1px solid rgba(183, 186, 197, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .card-role {
    font-size: 1.8rem;
    color: #b6bac5;
    margin-bottom: 1rem;
    font-weight: 300;
  }
  
  .card-meta {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    align-items: center;
  }
  
  .card-company {
    font-size: 1.1rem;
    color: rgba(183, 186, 197, 0.8);
    font-weight: 500;
  }
  
  .card-location, .card-duration {
    font-size: 0.9rem;
    color: rgba(183, 186, 197, 0.6);
  }
  
  .card-type {
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 1px;
  }
  
  .current-badge {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 1px;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .card-description {
    font-size: 1.1rem;
    line-height: 1.7;
    color: rgba(183, 186, 197, 0.8);
    margin-bottom: 2rem;
  }
  
  /* Mobile Experience Grid */
  .mobile-experience-grid {
    display: none;
  }
  
  /* Mobile/Desktop content switching */
  .card-description-mobile,
  .achievement-text-mobile {
    display: none;
  }
  
  .card-description-desktop,
  .achievement-text-desktop {
    display: block;
  }
  
  .impact-section {
    margin: 2rem 0;
  }
  
  .impact-section h4 {
    color: #b6bac5;
    margin-bottom: 1rem;
    font-size: 1rem;
  }
  
  .impact-highlight {
    background: rgba(183, 186, 197, 0.05);
    padding: 1rem 1.5rem;
    border-radius: 10px;
    font-weight: 500;
    color: #b6bac5;
    font-size: 1.1rem;
  }
  
  .achievements-section, .tech-section {
    margin: 2rem 0;
  }
  
  .achievements-section h4, .tech-section h4 {
    color: #b6bac5;
    margin-bottom: 1.5rem;
    font-size: 1rem;
  }
  
  .achievements-grid {
    display: grid;
    gap: 1rem;
  }
  
  .achievement-item {
    display: flex;
    align-items: flex-start;
    gap: 1rem;
    padding: 1rem;
    background: rgba(183, 186, 197, 0.05);
    border-radius: 10px;
    border-left: 3px solid #b6bac5;
    opacity: 0;
    transform: translateX(-20px);
    transition: all 0.4s ease;
  }
  
  .achievement-item.visible {
    animation: slideInLeft 0.6s ease forwards;
    animation-delay: var(--delay);
  }
  
  .achievement-icon {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: white;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .tech-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 0.8rem;
  }
  
  .tech-tag {
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    color: #b6bac5;
    border: 1px solid;
    transition: all 0.3s ease;
    opacity: 0;
    transform: translateY(10px);
  }
  
  .tech-tag.visible {
    animation: popIn 0.4s ease forwards;
    animation-delay: var(--delay);
  }
  
  .tech-tag:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  /* Animations */
  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes slideInLeft {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  @keyframes popIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 0.3; }
    50% { transform: scale(1.5); opacity: 0.1; }
  }
  
  @keyframes glow {
    from { box-shadow: 0 0 10px #4CAF50; }
    to { box-shadow: 0 0 20px #4CAF50, 0 0 30px #4CAF50; }
  }
  
  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .experience-section {
      padding: 2rem 1rem;
      margin: 1rem;
      border-radius: 15px;
    }
    
    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }
    
    .timeline-container {
      display: none;
    }
    
    .timeline-node {
      align-items: center;
      text-align: center;
    }
    
    .node-year {
      position: static;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .node-content {
      min-width: auto;
      padding: 0;
    }
    
    .node-role {
      font-size: 0.85rem;
      margin-bottom: 0.3rem;
      line-height: 1.2;
    }
    
    .node-company {
      font-size: 0.75rem;
    }
    
    .experience-card {
      display: none;
    }
    
    .card-header {
      padding: 1.5rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
    
    .card-role {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
    }
    
    .card-meta {
      flex-direction: column;
      gap: 0.5rem;
      align-items: flex-start;
    }
    
    .card-body {
      padding: 1.5rem;
    }
    
    .card-description {
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    
    /* Show mobile content, hide desktop content */
    .card-description-mobile,
    .achievement-text-mobile {
      display: block;
    }
    
    .card-description-desktop,
    .achievement-text-desktop {
      display: none;
    }
    
    /* Hide extra achievements on mobile - show only first 2 */
    .achievement-mobile-hidden {
      display: none;
    }
    
    /* Show mobile experience grid */
    .mobile-experience-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin: 2rem 0;
    }
    
    .mobile-exp-card {
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(183, 186, 197, 0.1);
      border-radius: 15px;
      padding: 1.2rem;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
      transition: all 0.3s ease;
    }
    
    .mobile-exp-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    
    .mobile-card-header {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    
    .mobile-company-badge {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.9rem;
      color: white;
      flex-shrink: 0;
    }
    
    .mobile-exp-info {
      flex: 1;
    }
    
    .mobile-role {
      font-size: 1rem;
      font-weight: 500;
      color: #b6bac5;
      margin: 0 0 0.2rem 0;
      line-height: 1.2;
    }
    
    .mobile-company {
      font-size: 0.8rem;
      color: rgba(183, 186, 197, 0.8);
      margin: 0 0 0.3rem 0;
    }
    
    .mobile-duration {
      font-size: 0.7rem;
      color: rgba(183, 186, 197, 0.6);
    }
    
    .mobile-current-badge {
      background: #4CAF50;
      color: white;
      padding: 0.2rem 0.5rem;
      border-radius: 8px;
      font-size: 0.6rem;
      font-weight: 600;
      letter-spacing: 0.5px;
    }
    
    .mobile-card-body {
      space-y: 1rem;
    }
    
    .mobile-description {
      font-size: 0.85rem;
      line-height: 1.4;
      color: rgba(183, 186, 197, 0.8);
      margin-bottom: 0.8rem;
    }
    
    .mobile-impact {
      background: rgba(183, 186, 197, 0.05);
      padding: 0.6rem 0.8rem;
      border-radius: 8px;
      font-size: 0.8rem;
      color: #b6bac5;
      margin-bottom: 0.8rem;
    }
    
    .mobile-tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    
    .mobile-tech-tag {
      padding: 0.3rem 0.6rem;
      border-radius: 12px;
      font-size: 0.7rem;
      font-weight: 500;
    }
    
    .mobile-tech-more {
      padding: 0.3rem 0.6rem;
      border-radius: 12px;
      font-size: 0.7rem;
      background: rgba(183, 186, 197, 0.2);
      color: #b6bac5;
      font-weight: 600;
    }
    
    .impact-highlight {
      padding: 0.8rem 1rem;
      font-size: 0.95rem;
    }
    
    .achievements-grid {
      gap: 0.8rem;
    }
    
    .achievement-item {
      padding: 0.8rem;
      flex-direction: column;
      text-align: center;
      gap: 0.5rem;
    }
    
    .achievement-icon {
      width: 16px;
      height: 16px;
      font-size: 0.7rem;
    }
    
    .tech-cloud {
      gap: 0.5rem;
    }
    
    .tech-tag {
      padding: 0.4rem 0.8rem;
      font-size: 0.8rem;
    }
    
    .current-badge {
      padding: 0.4rem 0.8rem;
      font-size: 0.7rem;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .experience-section {
      padding: 3rem 1.5rem;
      margin: 1.5rem;
    }
    
    .section-title {
      font-size: 2.2rem;
      margin-bottom: 3rem;
    }
    
    .timeline-container {
      flex-wrap: wrap;
      justify-content: center;
      gap: 2rem;
    }
    
    .timeline-node {
      flex: 0 0 auto;
    }
    
    .node-content {
      min-width: 130px;
    }
    
    .card-role {
      font-size: 1.4rem;
    }
    
    .card-meta {
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .card-description {
      font-size: 1rem;
    }
    
    /* Show mobile content, hide desktop content */
    .card-description-mobile,
    .achievement-text-mobile {
      display: block;
    }
    
    .card-description-desktop,
    .achievement-text-desktop {
      display: none;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .section-title {
      font-size: 2.8rem;
    }
    
    .timeline-container {
      gap: 1.5rem;
    }
    
    .node-content {
      min-width: 140px;
    }
    
    .card-role {
      font-size: 1.6rem;
    }
    
    .card-meta {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.8rem;
    }
    
    .card-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 1rem;
    }
  }
  
  /* Large Devices (desktops, 992px - 1199px) */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .timeline-container {
      gap: 1.8rem;
    }
    
    .node-content {
      min-width: 150px;
    }
  }
  
  /* Tablet Landscape and Desktop adjustments */
  @media (min-width: 1024px) {
    .timeline-container {
      flex-direction: row;
    }
    
    .timeline-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      width: auto;
      transform: translateY(-50%);
    }
    
    .timeline-node {
      flex-direction: column;
    }
    
    .node-year {
      position: absolute;
      top: -40px;
      margin-right: 0;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .timeline-node {
      min-height: 44px;
      padding: 0.5rem;
      cursor: pointer;
    }
    
    .timeline-node:hover .node-marker {
      transform: none;
      background: rgba(183, 186, 197, 0.3);
    }
    
    .achievement-item,
    .tech-tag {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .tech-tag:hover {
      transform: none;
      box-shadow: none;
    }
  }
  
  /* Landscape orientation for small screens */
  @media (orientation: landscape) and (max-height: 500px) {
    .experience-section {
      padding: 1.5rem 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .timeline-container {
      margin: 1rem 0;
      padding: 0.5rem 0;
    }
    
    .card-header {
      padding: 1rem;
    }
    
    .card-body {
      padding: 1rem;
    }
    
    .card-role {
      font-size: 1.1rem;
    }
    
    .achievements-section,
    .tech-section,
    .impact-section {
      margin: 1rem 0;
    }
  }
</style> 