<script>
  import { onMount } from 'svelte';
  import ProjectModal from '../ProjectModal.svelte';
  
  export let data;
  
  let projectsContainer;
  let scrollContainer;
  let selectedProject = null;
  let isVisible = false;
  let expandedProjects = new Set(); // Track expanded project descriptions
  
  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVisible = true;
        }
      });
    });
    
    if (projectsContainer) {
      observer.observe(projectsContainer);
    }
    
    return () => observer.disconnect();
  });
  
  function openProject(project) {
    selectedProject = project;
  }
  
  function closeProject() {
    selectedProject = null;
  }
  
  function scrollLeft() {
    scrollContainer.scrollBy({ left: -320, behavior: 'smooth' });
  }
  
  function scrollRight() {
    scrollContainer.scrollBy({ left: 320, behavior: 'smooth' });
  }

  function toggleDescription(projectId) {
    if (expandedProjects.has(projectId)) {
      expandedProjects.delete(projectId);
    } else {
      expandedProjects.add(projectId);
    }
    expandedProjects = expandedProjects; // Trigger reactivity
  }

  function getDisplayDescription(project) {
    if (expandedProjects.has(project.id)) {
      return project.longDescription || project.description;
    }
    // Truncate to show "..." if text is too long
    const maxLength = 120; // Adjust this value as needed
    if (project.description.length > maxLength) {
      return project.description.substring(0, maxLength) + "...";
    }
    return project.description;
  }

  function shouldShowReadMore(project) {
    const maxLength = 120; // Same value as in getDisplayDescription
    return project.description.length > maxLength || 
           (project.longDescription && project.longDescription !== project.description);
  }
</script>

<div class="projects-section" bind:this={projectsContainer}>
  <div class="section-content">
    <h2 class="section-title">Featured Projects</h2>
    <p class="section-subtitle">Explore my portfolio of data analytics and development projects</p>
    
    <!-- Scroll Controls -->
    <div class="scroll-controls">
      <button class="scroll-btn left" on:click={scrollLeft} aria-label="Scroll left">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        </svg>
      </button>
      <button class="scroll-btn right" on:click={scrollRight} aria-label="Scroll right">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    </div>
    
    <!-- Horizontal Scrolling Projects -->
    <div class="projects-scroll-wrapper">
      <div class="projects-container" bind:this={scrollContainer}>
        {#each data.projects as project, index}
          <div 
            class="project-card" 
            class:visible={isVisible}
            style="--delay: {index * 0.1}s"
            on:click={() => openProject(project)}
            on:keydown={(e) => e.key === 'Enter' && openProject(project)}
            role="button"
            tabindex="0"
          >
            <!-- Project Header -->
            <div class="card-header">
              <div class="project-category" style="background: {getCategoryColor(project.category)}20; color: {getCategoryColor(project.category)}">
                {project.category}
              </div>
              {#if project.featured}
                <div class="featured-badge">★ FEATURED</div>
              {/if}
            </div>
            
            <!-- Project Content -->
            <div class="card-content">
              <h3 class="project-title">{project.title}</h3>
              <p class="project-subtitle">{project.subtitle}</p>
              
              <!-- Project Description with Read More -->
              <div class="project-description-container">
                <p class="project-description">{getDisplayDescription(project)}</p>
                {#if shouldShowReadMore(project)}
                  <button 
                    class="read-more-btn"
                    on:click|stopPropagation={() => toggleDescription(project.id)}
                  >
                    {expandedProjects.has(project.id) ? 'Show Less' : 'Read More'}
                  </button>
                {/if}
              </div>
              
              <!-- Project Metrics -->
              <div class="project-metrics">
                <div class="metric">
                  <span class="metric-label">Year</span>
                  <span class="metric-value">{project.year}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Duration</span>
                  <span class="metric-value">{project.duration}</span>
                </div>
                <div class="metric">
                  <span class="metric-label">Team</span>
                  <span class="metric-value">{project.team}</span>
                </div>
              </div>
              
              <!-- Technology Stack -->
              <div class="tech-stack">
                {#each project.technologies.slice(0, 4) as tech}
                  <span class="tech-chip">{tech}</span>
                {/each}
                {#if project.technologies.length > 4}
                  <span class="tech-more">+{project.technologies.length - 4}</span>
                {/if}
              </div>
            </div>
            
            <!-- Project Footer -->
            <div class="card-footer">
              <div class="project-links">
                {#if project.github}
                  <a href={project.github} target="_blank" class="project-link" on:click|stopPropagation>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                  </a>
                {/if}
                {#if project.demo}
                  <a href={project.demo} target="_blank" class="project-link" on:click|stopPropagation>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7h-2v7z"/>
                    </svg>
                  </a>
                {/if}
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
    
    <!-- Scroll Indicator -->
    <div class="scroll-indicator">
      <div class="scroll-dots">
        {#each data.projects as _, index}
          <div class="scroll-dot"></div>
        {/each}
      </div>
    </div>
  </div>
</div>

<!-- Project Modal -->
{#if selectedProject}
  <ProjectModal project={selectedProject} on:close={closeProject} />
{/if}

<script context="module">
  function getCategoryColor(category) {
    const colors = {
      'Data Analytics': '#4CAF50',
      'Data Engineering': '#2196F3',
      'Machine Learning': '#FF9800',
      'Web Development': '#9C27B0',
      'DevOps': '#F44336',
      'Cybersecurity': '#607D8B'
    };
    return colors[category] || '#b6bac5';
  }
</script>

<style>
  .projects-section {
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
    position: relative;
  }
  
  .section-content {
    max-width: 1600px;
    width: 100%;
  }
  
  .section-title {
    font-size: 3.5rem;
    font-weight: 200;
    color: #b6bac5;
    text-align: center;
    margin-bottom: 1rem;
    letter-spacing: 3px;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  }
  
  .section-subtitle {
    text-align: center;
    color: rgba(183, 186, 197, 0.7);
    font-size: 1.1rem;
    margin-bottom: 4rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  
  /* Scroll Controls */
  .scroll-controls {
    position: absolute;
    top: 50%;
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    z-index: 10;
    pointer-events: none;
  }
  
  .scroll-btn {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(183, 186, 197, 0.2);
    color: #b6bac5;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    pointer-events: auto;
  }
  
  .scroll-btn:hover {
    background: rgba(183, 186, 197, 0.1);
    transform: scale(1.1);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }
  
  .scroll-btn svg {
    width: 24px;
    height: 24px;
  }
  
  /* Projects Container */
  .projects-scroll-wrapper {
    position: relative;
    overflow: hidden;
    border-radius: 20px;
  }
  
  .projects-container {
    display: flex;
    gap: 2rem;
    padding: 2rem 1rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  
  .projects-container::-webkit-scrollbar {
    display: none;
  }
  
  /* Project Cards */
  .project-card {
    flex: 0 0 300px;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    border: 1px solid rgba(183, 186, 197, 0.1);
    padding: 0;
    cursor: pointer;
    transition: all 0.4s ease;
    transform: translateY(50px);
    opacity: 0;
    position: relative;
    overflow: hidden;
  }
  
  .project-card.visible {
    animation: slideUpCard 0.8s ease forwards;
    animation-delay: var(--delay);
  }
  
  .project-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: rgba(183, 186, 197, 0.3);
  }
  
  .project-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4CAF50, #2196F3, #FF9800, #9C27B0);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .project-card:hover::before {
    opacity: 1;
  }
  
  /* Card Header */
  .card-header {
    padding: 1.5rem 1.5rem 0;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .project-category {
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
  
  .featured-badge {
    background: linear-gradient(45deg, #FFD700, #FFA500);
    color: #000;
    padding: 0.3rem 0.6rem;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.5px;
    animation: sparkle 2s ease-in-out infinite;
  }
  
  /* Card Content */
  .card-content {
    padding: 1.5rem;
  }
  
  .project-title {
    font-size: 1.3rem;
    color: #b6bac5;
    margin-bottom: 0.5rem;
    font-weight: 400;
    line-height: 1.3;
  }
  
  .project-subtitle {
    color: rgba(183, 186, 197, 0.8);
    font-size: 0.9rem;
    margin-bottom: 1rem;
    font-weight: 500;
  }
  
  .project-description-container {
    margin-bottom: 1.5rem;
  }

  .project-description {
    color: rgba(183, 186, 197, 0.7);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
  }

  .read-more-btn {
    background: none;
    border: none;
    color: #4CAF50;
    font-size: 0.8rem;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    transition: color 0.3s ease;
  }

  .read-more-btn:hover {
    color: #66BB6A;
  }
  
  /* Project Metrics */
  .project-metrics {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.8rem;
    margin-bottom: 1.5rem;
    padding: 1rem;
    background: rgba(183, 186, 197, 0.05);
    border-radius: 10px;
  }
  
  .metric {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 50px;
  }

  .metric:nth-child(1) {
    /* Year - Left aligned */
    align-items: flex-start;
    text-align: left;
  }

  .metric:nth-child(2) {
    /* Duration - Right aligned */
    align-items: flex-end;
    text-align: right;
  }

  .metric:nth-child(3) {
    /* Team - Center aligned */
    align-items: center;
    text-align: center;
  }
  
  .metric-label {
    display: block;
    font-size: 0.7rem;
    color: rgba(183, 186, 197, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.3rem;
    font-weight: 600;
  }
  
  .metric-value {
    font-size: 0.85rem;
    color: #b6bac5;
    font-weight: 600;
    line-height: 1.2;
    word-wrap: break-word;
    text-align: center;
  }
  
  /* Tech Stack */
  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-bottom: 1rem;
  }
  
  .tech-chip {
    padding: 0.3rem 0.6rem;
    background: rgba(183, 186, 197, 0.1);
    border: 1px solid rgba(183, 186, 197, 0.2);
    border-radius: 12px;
    font-size: 0.7rem;
    color: rgba(183, 186, 197, 0.8);
    font-weight: 500;
  }
  
  .tech-more {
    padding: 0.3rem 0.6rem;
    background: rgba(183, 186, 197, 0.2);
    border-radius: 12px;
    font-size: 0.7rem;
    color: #b6bac5;
    font-weight: 600;
  }
  
  /* Card Footer */
  .card-footer {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .project-links {
    display: flex;
    gap: 0.5rem;
  }
  
  .project-link {
    width: 32px;
    height: 32px;
    background: rgba(183, 186, 197, 0.1);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(183, 186, 197, 0.6);
    transition: all 0.3s ease;
  }
  
  .project-link:hover {
    background: rgba(183, 186, 197, 0.2);
    color: #b6bac5;
    transform: translateY(-2px);
  }
  
  .project-link svg {
    width: 16px;
    height: 16px;
  }
  
  .view-details-btn {
    background: linear-gradient(45deg, rgba(183, 186, 197, 0.1), rgba(183, 186, 197, 0.05));
    border: 1px solid rgba(183, 186, 197, 0.2);
    color: #b6bac5;
    padding: 0.5rem 1rem;
    border-radius: 10px;
    font-size: 0.8rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: all 0.3s ease;
  }
  
  .view-details-btn:hover {
    background: linear-gradient(45deg, rgba(183, 186, 197, 0.2), rgba(183, 186, 197, 0.1));
    transform: translateY(-2px);
  }
  
  .view-details-btn svg {
    width: 14px;
    height: 14px;
  }
  
  /* Scroll Indicator */
  .scroll-indicator {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
  
  .scroll-dots {
    display: flex;
    gap: 0.5rem;
  }
  
  .scroll-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(183, 186, 197, 0.3);
    transition: all 0.3s ease;
  }
  
  /* Animations */
  @keyframes slideUpCard {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes sparkle {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  
  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .projects-section {
      padding: 2rem 1rem;
      margin: 1rem;
      border-radius: 15px;
    }
    
    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }
    
    .projects-container {
      padding: 1rem 0;
      gap: 1rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
    }
    
    .project-card {
      flex: 0 0 240px;
      scroll-snap-align: start;
      min-height: auto;
    }
    
    .card-header {
      padding: 1rem;
    }
    
    .project-title {
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }
    
    .project-subtitle {
      font-size: 0.8rem;
      margin-bottom: 0.8rem;
    }
    
    .project-description {
      font-size: 0.8rem;
      line-height: 1.4;
    }

    .project-description-container {
      margin-bottom: 1rem;
    }
    
    .read-more-btn {
      font-size: 0.75rem;
    }
    
    .project-metrics {
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
      padding: 0.8rem;
    }
    
    .metric {
      min-height: 45px;
    }

    /* Mobile: Year (left), Duration (right), Team spans both columns center */
    .metric:nth-child(1) {
      /* Year - Left aligned */
      align-items: flex-start;
      text-align: left;
    }

    .metric:nth-child(2) {
      /* Duration - Right aligned */
      align-items: flex-end;
      text-align: right;
    }

    .metric:nth-child(3) {
      /* Team - Center aligned, spans both columns */
      grid-column: 1 / -1;
      align-items: center;
      text-align: center;
    }
    
    .metric-label {
      font-size: 0.65rem;
      margin-bottom: 0.2rem;
    }
    
    .metric-value {
      font-size: 0.75rem;
    }
    
    .tech-stack {
      gap: 0.3rem;
      margin-bottom: 0.8rem;
    }
    
    .tech-chip {
      padding: 0.25rem 0.5rem;
      font-size: 0.65rem;
    }
    
    .card-footer {
      padding: 0 1rem 1rem;
    }
    
    .project-link {
      width: 28px;
      height: 28px;
    }
    
    .project-link svg {
      width: 14px;
      height: 14px;
    }
    
    .view-details-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.7rem;
    }
    
    .scroll-controls {
      display: none;
    }
    
    .scroll-indicator {
      margin-top: 1rem;
    }
    
    .scroll-dot {
      width: 6px;
      height: 6px;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .projects-section {
      padding: 3rem 1.5rem;
      margin: 1.5rem;
    }
    
    .section-title {
      font-size: 2.2rem;
      margin-bottom: 3rem;
    }
    
    .projects-container {
      padding: 1rem 0.5rem;
      gap: 1.5rem;
    }
    
    .project-card {
      flex: 0 0 260px;
    }
    
    .project-title {
      font-size: 1.1rem;
    }
    
    .project-description {
      font-size: 0.85rem;
    }
    
    .project-metrics {
      grid-template-columns: 1fr 1fr;
      gap: 0.8rem;
    }
    
    .metric {
      min-height: 48px;
    }

    /* Small devices: Year (left), Duration (right), Team spans both columns center */
    .metric:nth-child(1) {
      align-items: flex-start;
      text-align: left;
    }

    .metric:nth-child(2) {
      align-items: flex-end;
      text-align: right;
    }

    .metric:nth-child(3) {
      grid-column: 1 / -1;
      align-items: center;
      text-align: center;
    }
    
    .scroll-controls {
      display: none;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .section-title {
      font-size: 2.8rem;
    }
    
    .project-card {
      flex: 0 0 280px;
    }
    
    .projects-container {
      gap: 2rem;
    }
    
    .project-metrics {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .scroll-controls {
      display: none;
    }
  }
  
  /* Large Devices (desktops, 992px - 1199px) */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .project-card {
      flex: 0 0 300px;
    }
    
    .scroll-controls {
      display: flex;
    }
  }
  
  /* Extra Large Devices (1200px and up) */
  @media (min-width: 1200px) {
    .project-card {
      flex: 0 0 320px;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .project-link,
    .view-details-btn {
      min-height: 44px;
      min-width: 44px;
    }
    
    .project-link:hover,
    .view-details-btn:hover {
      transform: none;
      background: rgba(183, 186, 197, 0.1);
    }
    
    .project-card:hover {
      transform: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
  }
  
  /* Landscape orientation for small screens */
  @media (orientation: landscape) and (max-height: 500px) {
    .projects-section {
      padding: 1.5rem 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .project-card {
      min-height: 200px;
    }
    
    .card-header {
      padding: 0.8rem;
    }
    
    .project-description {
      -webkit-line-clamp: 2;
      margin-bottom: 0.8rem;
    }
    
    .project-metrics {
      padding: 0.6rem;
      margin-bottom: 0.8rem;
    }
    
    .card-footer {
      padding: 0 0.8rem 0.8rem;
    }
  }
  
  /* High density displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .project-link svg,
    .view-details-btn svg {
      transform: scale(1.2);
    }
  }
</style> 