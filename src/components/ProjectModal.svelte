<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'
  import { appState, selectedProject } from '../store/appState.js'

  let modalElement
  let isVisible = false
  let project = null

  // Subscribe to selected project
  const unsubscribe = selectedProject.subscribe(value => {
    if (value) {
      project = value
      showModal()
    } else {
      hideModal()
    }
  })

  onMount(() => {
    return unsubscribe
  })

  function showModal() {
    isVisible = true
    if (modalElement) {
      gsap.timeline()
        .set(modalElement, { display: 'flex' })
        .fromTo(modalElement, 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
        )
        .fromTo('.modal-content', 
          { y: 50, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" },
          "-=0.2"
        )
    }
  }

  function hideModal() {
    if (modalElement) {
      gsap.to(modalElement, {
        opacity: 0,
        scale: 0.9,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          isVisible = false
          project = null
        }
      })
    }
  }

  function closeModal() {
    appState.setSelectedProject(null)
  }

  function handleBackdropClick(e) {
    if (e.target === modalElement) {
      closeModal()
    }
  }
</script>

{#if isVisible && project}
  <div 
    class="modal-backdrop" 
    bind:this={modalElement}
    on:click={handleBackdropClick}
  >
    <div class="modal-content">
      <!-- Close Button -->
      <button class="close-btn" on:click={closeModal}>
        <div class="close-icon">×</div>
      </button>

      <!-- Project Header -->
      <div class="project-header">
        <div class="project-category">{project.category}</div>
        <h1 class="project-title">{project.title}</h1>
        <div class="project-date">{project.date}</div>
      </div>

      <!-- Tech Stack -->
      <div class="tech-stack">
        {#each project.tech as tech}
          <span class="tech-tag">{tech}</span>
        {/each}
      </div>

      <!-- Project Description -->
      <div class="project-description">
        <p>{project.description}</p>
      </div>

      <!-- Features Grid -->
      <div class="features-section">
        <h3>Key Features</h3>
        <div class="features-grid">
          {#each project.features as feature}
            <div class="feature-item">
              <div class="feature-icon">⚡</div>
              <span>{feature}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Metrics -->
      {#if project.metrics}
        <div class="metrics-section">
          <h3>Impact & Performance</h3>
          <div class="metrics-grid">
            {#each Object.entries(project.metrics) as [key, value]}
              <div class="metric-item">
                <div class="metric-value">{value}</div>
                <div class="metric-label">{key}</div>
              </div>
            {/each}
          </div>
        </div>
      {/if}

      <!-- Action Buttons -->
      <div class="action-buttons">
        {#if project.github}
          <a href={project.github} target="_blank" class="btn btn-secondary">
            <span>View Code</span>
            <div class="btn-icon">↗</div>
          </a>
        {/if}
        {#if project.live}
          <a href={project.live} target="_blank" class="btn btn-primary">
            <span>Live Demo</span>
            <div class="btn-icon">🚀</div>
          </a>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    opacity: 0;
  }

  .modal-content {
    background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 40px;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  }

  .close-btn {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;
    color: #ffffff;
  }

  .close-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  .close-icon {
    font-size: 24px;
    font-weight: 300;
  }

  .project-header {
    margin-bottom: 30px;
    text-align: center;
  }

  .project-category {
    color: #888;
    font-size: 14px;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  .project-title {
    font-size: 32px;
    font-weight: 700;
    color: #ffffff;
    margin: 0 0 10px 0;
    line-height: 1.2;
  }

  .project-date {
    color: #666;
    font-size: 16px;
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 30px;
    justify-content: center;
  }

  .tech-tag {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    padding: 8px 16px;
    font-size: 12px;
    color: #ffffff;
    letter-spacing: 1px;
  }

  .project-description {
    margin-bottom: 40px;
  }

  .project-description p {
    font-size: 18px;
    line-height: 1.6;
    color: #cccccc;
    text-align: center;
  }

  .features-section,
  .metrics-section {
    margin-bottom: 40px;
  }

  .features-section h3,
  .metrics-section h3 {
    font-size: 20px;
    color: #ffffff;
    margin-bottom: 20px;
    text-align: center;
  }

  .features-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 15px;
  }

  .feature-item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 15px;
    transition: all 0.3s ease;
  }

  .feature-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  .feature-icon {
    font-size: 20px;
    color: #4CAF50;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 20px;
  }

  .metric-item {
    text-align: center;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 15px;
    padding: 20px;
  }

  .metric-value {
    font-size: 24px;
    font-weight: 700;
    color: #4CAF50;
    margin-bottom: 5px;
  }

  .metric-label {
    font-size: 12px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .action-buttons {
    display: flex;
    gap: 20px;
    justify-content: center;
    margin-top: 40px;
  }

  .btn {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 30px;
    border-radius: 25px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    border: 2px solid;
  }

  .btn-primary {
    background: linear-gradient(45deg, #4CAF50, #45a049);
    color: #ffffff;
    border-color: #4CAF50;
  }

  .btn-secondary {
    background: transparent;
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.3);
  }

  .btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  }

  .btn-primary:hover {
    background: linear-gradient(45deg, #45a049, #4CAF50);
  }

  .btn-secondary:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .btn-icon {
    font-size: 16px;
  }

  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .modal-overlay {
      padding: 10px;
    }
    
    .modal-content {
      padding: 20px 15px;
      margin: 0;
      max-width: 100%;
      max-height: calc(100vh - 20px);
      border-radius: 15px;
    }
    
    .close-btn {
      top: 15px;
      right: 15px;
      width: 32px;
      height: 32px;
      font-size: 16px;
    }
    
    .project-category {
      font-size: 12px;
      letter-spacing: 1px;
      margin-bottom: 8px;
    }
    
    .project-title {
      font-size: 20px;
      margin-bottom: 8px;
    }
    
    .project-date {
      font-size: 14px;
      margin-bottom: 20px;
    }
    
    .tech-stack {
      gap: 6px;
      margin-bottom: 25px;
    }
    
    .tech-tag {
      padding: 6px 12px;
      font-size: 10px;
      border-radius: 15px;
    }
    
    .project-description {
      margin-bottom: 30px;
    }
    
    .project-description p {
      font-size: 14px;
      line-height: 1.5;
      text-align: left;
    }
    
    .features-section,
    .metrics-section {
      margin-bottom: 30px;
    }
    
    .features-section h3,
    .metrics-section h3 {
      font-size: 16px;
      margin-bottom: 15px;
      text-align: left;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }
    
    .feature-item {
      padding: 12px;
      flex-direction: column;
      text-align: center;
      gap: 8px;
    }
    
    .feature-icon {
      font-size: 18px;
    }
    
    .metrics-grid {
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }
    
    .metric-item {
      padding: 15px 10px;
    }
    
    .metric-value {
      font-size: 18px;
      margin-bottom: 4px;
    }
    
    .metric-label {
      font-size: 10px;
    }
    
    .action-buttons {
      flex-direction: column;
      gap: 12px;
      margin-top: 30px;
    }
    
    .btn {
      padding: 12px 20px;
      font-size: 14px;
      border-radius: 20px;
      justify-content: center;
    }
    
    .btn-icon {
      font-size: 14px;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .modal-overlay {
      padding: 15px;
    }
    
    .modal-content {
      padding: 25px 20px;
      margin: 0;
      border-radius: 20px;
      max-height: calc(100vh - 30px);
    }
    
    .close-btn {
      top: 20px;
      right: 20px;
      width: 36px;
      height: 36px;
    }
    
    .project-title {
      font-size: 24px;
    }
    
    .project-description p {
      font-size: 16px;
    }
    
    .features-grid {
      grid-template-columns: 1fr;
      gap: 12px;
    }
    
    .metrics-grid {
      grid-template-columns: repeat(3, 1fr);
    }
    
    .action-buttons {
      flex-direction: row;
      gap: 15px;
    }
    
    .btn {
      padding: 13px 25px;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .modal-content {
      padding: 35px 25px;
      max-width: 90%;
    }
    
    .project-title {
      font-size: 28px;
    }
    
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .metrics-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  /* Large Devices (desktops, 992px and up) */
  @media (min-width: 992px) {
    .modal-content {
      max-width: 800px;
    }
    
    .features-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .metrics-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .close-btn,
    .btn {
      min-height: 44px;
      min-width: 44px;
    }
    
    .feature-item:hover,
    .btn:hover {
      transform: none;
      background: rgba(255, 255, 255, 0.1);
    }
    
    .btn:hover {
      box-shadow: none;
    }
  }
  
  /* Landscape orientation for small screens */
  @media (orientation: landscape) and (max-height: 500px) {
    .modal-content {
      padding: 15px 20px;
      max-height: calc(100vh - 20px);
    }
    
    .project-title {
      font-size: 18px;
      margin-bottom: 6px;
    }
    
    .project-description {
      margin-bottom: 20px;
    }
    
    .project-description p {
      font-size: 14px;
    }
    
    .features-section,
    .metrics-section {
      margin-bottom: 20px;
    }
    
    .features-section h3,
    .metrics-section h3 {
      font-size: 14px;
      margin-bottom: 10px;
    }
    
    .feature-item {
      padding: 10px;
    }
    
    .metric-item {
      padding: 10px;
    }
    
    .action-buttons {
      margin-top: 20px;
      gap: 10px;
    }
    
    .btn {
      padding: 8px 16px;
      font-size: 12px;
    }
  }

  /* Custom scrollbar */
  .modal-content::-webkit-scrollbar {
    width: 6px;
  }

  .modal-content::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  .modal-content::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
</style> 