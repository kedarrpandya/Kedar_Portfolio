<script>
  import { onMount } from 'svelte';
  import ProjectModal from '../ProjectModal.svelte';
  
  export let data;
  
  let projectsContainer;
  let scrollContainer;
  let selectedProject = null;
  let isVisible = false;
  let activeDotIndex = 0;
  let scrollTimeout;
  let debouncedScrollHandler;

  
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
    
    // Add scroll listener to update active dot
    if (scrollContainer) {
      debouncedScrollHandler = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveDot, 100);
      };
      scrollContainer.addEventListener('scroll', debouncedScrollHandler);
      
      // Ensure scroll starts at the beginning to show first card properly
      setTimeout(() => {
        if (scrollContainer) {
          scrollContainer.scrollLeft = 0;
          ensureLastCardVisible();
          updateActiveDot();
        }
      }, 100);
    }
    
    // Handle window resize to recalculate layout
    const handleResize = () => {
      if (scrollContainer) {
        // Reset scroll position on resize to prevent issues
        scrollContainer.style.scrollBehavior = 'auto';
        scrollContainer.scrollLeft = 0;
        setTimeout(() => {
          scrollContainer.style.scrollBehavior = 'smooth';
          ensureLastCardVisible();
          updateActiveDot();
        }, 50);
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      observer.disconnect();
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (scrollContainer && debouncedScrollHandler) {
        scrollContainer.removeEventListener('scroll', debouncedScrollHandler);
      }
      window.removeEventListener('resize', handleResize);
    };
  });
  
  function openProject(project) {
    selectedProject = project;
  }
  
  function closeProject() {
    selectedProject = null;
  }
  
  function scrollLeft() {
    const cardWidth = getCardWidth();
    const gap = getGapWidth();
    scrollContainer.scrollBy({ left: -(cardWidth + gap), behavior: 'smooth' });
  }
  
  function scrollRight() {
    const cardWidth = getCardWidth();
    const gap = getGapWidth();
    scrollContainer.scrollBy({ left: (cardWidth + gap), behavior: 'smooth' });
  }
  
  function scrollToProject(index) {
    if (scrollContainer) {
      // Get responsive card width and gap
      const cardWidth = getCardWidth();
      const gap = getGapWidth();
      const containerPadding = getPaddingWidth();
      
      // Calculate scroll position - account for padding and ensure proper positioning
      let scrollPosition;
      
      if (index === 0) {
        // First card - scroll to beginning
        scrollPosition = 0;
      } else {
        // Other cards - calculate position
        scrollPosition = (cardWidth + gap) * index;
      }
      
      scrollContainer.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
      
      activeDotIndex = index;
    }
  }
  
  // Update active dot based on scroll position
  function updateActiveDot() {
    if (scrollContainer && data.projects) {
      const cardWidth = getCardWidth();
      const gap = getGapWidth();
      const scrollLeft = scrollContainer.scrollLeft;
      
      // Special handling for first card
      if (scrollLeft < cardWidth / 2) {
        activeDotIndex = 0;
        return;
      }
      
      // Calculate index for other cards
      const adjustedScrollLeft = scrollLeft + (cardWidth / 3);
      const newIndex = Math.floor(adjustedScrollLeft / (cardWidth + gap));
      activeDotIndex = Math.max(0, Math.min(newIndex, data.projects.length - 1));
    }
  }
  
  function getCardWidth() {
    const width = window.innerWidth;
    if (width <= 575.98) return 240; // Mobile
    if (width <= 767.98) return 260; // Small devices  
    if (width <= 991.98) return 280; // Medium devices
    if (width <= 1199.98) return 300; // Large devices
    return 320; // Extra large devices
  }
  
  function getGapWidth() {
    const width = window.innerWidth;
    if (width <= 575.98) return 16; // 1rem gap on mobile
    if (width <= 767.98) return 24; // 1.5rem gap
    return 32; // 2rem gap on larger screens
  }
  
  function getPaddingWidth() {
    const width = window.innerWidth;
    if (width <= 575.98) return 24; // 1.5rem padding on mobile
    if (width <= 767.98) return 24; // 1.5rem padding
    return 32; // 2rem padding on larger screens
  }
  
  // Ensure dots are always visible and responsive
  function ensureLastCardVisible() {
    if (scrollContainer && data.projects) {
      // The ::after pseudo-element handles the trailing space
      // Force layout recalculation to ensure proper scrolling
      const scrollWidth = scrollContainer.scrollWidth;
      scrollContainer.style.display = 'flex';
    }
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
            </div>
            
            <!-- Project Content -->
            <div class="card-content">
              <h3 class="project-title">{project.title}</h3>
              <p class="project-subtitle">{project.subtitle}</p>
              
              <!-- Project Description -->
              <div class="project-description-container">
                <p class="project-description">
                  {project.description}
                </p>
                {#if project.description.length > 200}
                  <button class="read-more-btn" on:click={(e) => e.stopPropagation()}>
                    Read more
                  </button>
                {/if}
                
                <!-- GitHub Link -->
                <div class="github-link-container">
                  <a 
                    href={project.github || project.links?.github || 'https://github.com/kedarpandya'} 
                    target="_blank" 
                    class="github-link"
                    on:click={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      window.open(project.github || project.links?.github || 'https://github.com/kedarpandya', '_blank');
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    View on GitHub
                  </a>
                </div>
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
                {#if project.demo}
                  <a href={project.demo} target="_blank" class="project-link" on:click={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    window.open(project.demo, '_blank');
                  }}>
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
          <button 
            class="scroll-dot {index === activeDotIndex ? 'active' : ''}"
            on:click={() => scrollToProject(index)}
            aria-label="Scroll to project {index + 1}"
          ></button>
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
    padding: 4rem 0rem;
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
    overflow: visible;
  }
  
  .section-content {
    max-width: 1600px;
    width: 100%;
    overflow: visible;
    padding: 0 2rem;
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
    overflow: visible;
    border-radius: 20px;
    margin: 0 -2rem;
    padding: 0 2rem;
  }
  
  .projects-container {
    display: flex;
    gap: 2rem;
    padding: 2rem 2rem 2rem 4rem;
    overflow-x: auto;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    scroll-snap-type: x mandatory;
    scroll-padding-left: 4rem;
  }
  
  .projects-container::after {
    content: '';
    flex: 0 0 2rem;
    height: 1px;
    min-width: 2rem;
  }
  
  .projects-container::-webkit-scrollbar {
    display: none;
  }
  
  /* Project Cards */
  .project-card {
    flex: 0 0 300px;
    height: 500px;
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
    scroll-snap-align: start;
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
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 3.38rem;
  }
  
  .project-subtitle {
    color: rgba(183, 186, 197, 0.8);
    font-size: 0.9rem;
    margin-bottom: 1rem;
    font-weight: 500;
    height: 1.35rem;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  
  .project-description-container {
    margin-bottom: 1.5rem;
    height: 7.5rem;
    display: flex;
    flex-direction: column;
  }

  .project-description {
    color: rgba(183, 186, 197, 0.7);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 4;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: 5.4rem;
    flex-shrink: 0;
  }

  .read-more-btn {
    background: none;
    border: none;
    color: rgba(183, 186, 197, 0.8);
    font-size: 0.8rem;
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    margin-top: 0.3rem;
    align-self: flex-start;
  }

  .read-more-btn:hover {
    color: #b6bac5;
  }

  .github-link-container {
    display: flex;
    justify-content: center;
    margin-top: auto;
  }

  .github-link {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    background: linear-gradient(45deg, rgba(183, 186, 197, 0.1), rgba(183, 186, 197, 0.05));
    border: 1px solid rgba(183, 186, 197, 0.2);
    border-radius: 12px;
    color: #b6bac5;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .github-link:hover {
    background: linear-gradient(45deg, rgba(183, 186, 197, 0.2), rgba(183, 186, 197, 0.1));
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    color: #d0d4db;
  }

  .github-link svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
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
    gap: 0.3rem;
  }
  
  .scroll-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(183, 186, 197, 0.3);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
    margin: 0;
  }
  
  .scroll-dot:hover {
    background: rgba(183, 186, 197, 0.5);
    transform: scale(1.2);
  }
  
  .scroll-dot.active {
    background: rgba(183, 186, 197, 0.8);
    transform: scale(1.3);
    box-shadow: 0 0 8px rgba(183, 186, 197, 0.4);
  }
  
  .scroll-dot:focus {
    outline: 2px solid rgba(183, 186, 197, 0.6);
    outline-offset: 2px;
  }
  
  /* Animations */
  @keyframes slideUpCard {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  

  
  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .projects-section {
      padding: 2rem 0rem;
      margin: 1rem;
      border-radius: 15px;
    }
    
    .section-content {
      padding: 0 1rem;
    }
    
    .projects-scroll-wrapper {
      margin: 0 -1rem;
      padding: 0 1rem;
    }
    
    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }
    
    .projects-container {
      padding: 1rem 1.5rem;
      gap: 1rem;
      overflow-x: auto;
      scroll-snap-type: x mandatory;
      scroll-padding: 1.5rem;
      -webkit-overflow-scrolling: touch;
    }
    
    .project-card {
      flex: 0 0 240px;
      height: 520px;
      scroll-snap-align: start;
    }
    
    .card-header {
      padding: 1rem;
    }

    .card-content {
      padding: 1rem 1rem 1.5rem;
    }
    
    .project-title {
      font-size: 1rem;
      margin-bottom: 0.2rem;
      height: 2.4rem;
    }
    
    .project-subtitle {
      font-size: 0.8rem;
      margin-bottom: 0.6rem;
      height: 1rem;
    }
    
    .project-description {
      font-size: 0.8rem;
      line-height: 1.4;
    }

    .project-description-container {
      margin-bottom: 2rem;
      height: 7rem;
    }

    .project-description {
      height: 3.6rem;
      -webkit-line-clamp: 3;
      margin-bottom: 0.8rem;
    }
    
    .github-link-container {
      margin-top: 1rem;
      margin-bottom: 1rem;
    }

    .read-more-btn {
      font-size: 0.7rem;
      margin-top: 0.2rem;
    }
    
    .github-link {
      padding: 0.5rem 1rem;
      font-size: 0.8rem;
    }

    .github-link svg {
      width: 14px;
      height: 14px;
    }
    
    .project-metrics {
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      margin-bottom: 1rem;
      margin-top: 1.5rem;
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
      display: none;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .projects-section {
      padding: 3rem 0rem;
      margin: 1.5rem;
    }
    
    .section-content {
      padding: 0 1.5rem;
    }
    
    .projects-scroll-wrapper {
      margin: 0 -1.5rem;
      padding: 0 1.5rem;
    }
    
    .section-title {
      font-size: 2.2rem;
      margin-bottom: 3rem;
    }
    
    .projects-container {
      padding: 1rem 1.5rem;
      gap: 1.5rem;
      scroll-padding: 1.5rem;
    }
    
    .project-card {
      flex: 0 0 260px;
      height: 450px;
      scroll-snap-align: start;
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
      scroll-snap-align: start;
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
      scroll-snap-align: start;
    }
    
    .scroll-controls {
      display: flex;
    }
  }
  
  /* Extra Large Devices (1200px and up) */
  @media (min-width: 1200px) {
    .project-card {
      flex: 0 0 320px;
      scroll-snap-align: start;
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