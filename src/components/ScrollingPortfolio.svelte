<script>
  import { onMount } from 'svelte';
  import { portfolioData } from '../data/portfolioData.js';
  import ExperienceSection from './sections/ExperienceSection.svelte';
  import ProjectsSection from './sections/ProjectsSection.svelte';
  import SkillsSection from './sections/SkillsSection.svelte';
  import EducationSection from './sections/EducationSection.svelte';
  import TimelineSection from './sections/TimelineSection.svelte';
  import ContactSection from './sections/ContactSection.svelte';

  let scrollY = 0;
  let innerHeight = 0;
  let currentSection = 0;
  let aboutExpanded = false;

  const sections = [
    { id: 'hero', title: 'Welcome', component: null },
    { id: 'about', title: 'About Me', component: null },
    { id: 'experience', title: 'Experience', component: ExperienceSection },
    { id: 'projects', title: 'Projects', component: ProjectsSection },
    { id: 'skills', title: 'Skills', component: SkillsSection },
    { id: 'education', title: 'Education', component: EducationSection },
    { id: 'contact', title: 'Contact', component: ContactSection }
  ];

  $: {
    // Calculate current section based on scroll position and actual element positions
    if (typeof window !== 'undefined') {
      const sectionElements = sections.map(section => document.getElementById(section.id));
      let newCurrentSection = 0;
      
      for (let i = 0; i < sectionElements.length; i++) {
        const element = sectionElements[i];
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= innerHeight / 2 && rect.bottom >= innerHeight / 2) {
            newCurrentSection = i;
            break;
          } else if (rect.top <= innerHeight / 2) {
            newCurrentSection = i;
          }
        }
      }
      
      currentSection = newCurrentSection;
    }
  }

  function scrollToSection(index) {
    const targetElement = document.getElementById(sections[index].id);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  onMount(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
  });

  function toggleAbout() {
    aboutExpanded = !aboutExpanded;
  }
</script>

<svelte:window bind:scrollY bind:innerHeight />



<!-- Navigation Dots -->
<nav class="scroll-nav">
  {#each sections as section, index}
    <button
      class="nav-dot"
      class:active={currentSection === index}
      on:click={() => scrollToSection(index)}
      title={section.title}
    >
      <span class="nav-label">{section.title}</span>
    </button>
  {/each}
</nav>

<!-- Progress Bar -->
<div class="progress-bar">
  <div 
    class="progress-fill" 
    style="width: {((currentSection + 1) / sections.length) * 100}%"
  ></div>
</div>

<!-- Hero Section - Empty spacer for 3D scene -->
<section class="hero-section" id="hero">
  <div class="hero-content">
    <!-- Content removed - now handled by UIOverlay glass panel -->
  </div>
</section>

<!-- About Section -->
<section class="about-section" id="about">
  <div class="section-content">
    <h2 class="section-title">About Me</h2>
    
    <!-- Mobile Simple Content -->
    <div class="about-mobile">
      <div class="mobile-about-card">
        <div class="mobile-about-content">
          <p class="mobile-about-text">{portfolioData.personal.summary.substring(0, 160)}...</p>
          
          <div class="mobile-quick-contact">
            <a href="mailto:{portfolioData.personal.email}" class="mobile-contact-btn">
              📧 Email Me
            </a>
            <a href="tel:{portfolioData.personal.phone}" class="mobile-contact-btn">
              📞 Call Me
            </a>
          </div>
          
          <div class="mobile-stats">
            <div class="mobile-stat">
              <span class="mobile-stat-number">{portfolioData.experience.length}</span>
              <span class="mobile-stat-label">Roles</span>
            </div>
            <div class="mobile-stat">
              <span class="mobile-stat-number">{portfolioData.projects.length}</span>
              <span class="mobile-stat-label">Projects</span>
            </div>
            <div class="mobile-stat">
              <span class="mobile-stat-number">3+</span>
              <span class="mobile-stat-label">Years</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Desktop Content -->
    <div class="about-desktop">
      <div class="about-grid">
        <div class="about-text">
          <p class="about-summary about-summary-desktop">{portfolioData.personal.summary}</p>
          <div class="contact-info">
            <div class="contact-item">
              <span class="contact-label">Email:</span>
              <a href="mailto:{portfolioData.personal.email}">{portfolioData.personal.email}</a>
            </div>
            <div class="contact-item">
              <span class="contact-label">Phone:</span>
              <a href="tel:{portfolioData.personal.phone}">{portfolioData.personal.phone}</a>
            </div>
            <div class="contact-links">
              <a href={portfolioData.personal.linkedin} target="_blank">LinkedIn</a>
              <a href={portfolioData.personal.github} target="_blank">GitHub</a>
            </div>
          </div>
        </div>
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">{portfolioData.experience.length}</span>
            <span class="stat-label">Professional Roles</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{portfolioData.projects.length}</span>
            <span class="stat-label">Major Projects</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">{portfolioData.certifications.length}</span>
            <span class="stat-label">Certifications</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">3+</span>
            <span class="stat-label">Years Experience</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Dynamic Sections -->
{#each sections.slice(2) as section, index}
  {#if section.component}
    <section class="portfolio-section" id={section.id}>
      <svelte:component this={section.component} data={portfolioData} />
    </section>
  {/if}
{/each}

<style>
  :global(html) {
    scroll-snap-type: y mandatory;
  }

  /* Navigation */
  .scroll-nav {
    position: fixed;
    right: 2rem;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1000;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  /* Mobile: Hide navigation on very small screens */
  @media (max-width: 480px) {
    .scroll-nav {
      right: 1rem;
      gap: 0.8rem;
    }
  }

  .nav-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(183, 186, 197, 0.3);
    border: 2px solid rgba(183, 186, 197, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .nav-dot:hover,
  .nav-dot.active {
    background: #b6bac5;
    border-color: #b6bac5;
    transform: scale(1.2);
  }

  .nav-label {
    position: absolute;
    right: 20px;
    background: rgba(56, 62, 78, 0.9);
    color: #b6bac5;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.75rem;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  .nav-dot:hover .nav-label {
    opacity: 1;
  }

  /* Progress Bar */
  .progress-bar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: rgba(56, 62, 78, 0.3);
    z-index: 1000;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #383e4e 0%, #b6bac5 100%);
    transition: width 0.3s ease;
  }

  /* Sections */
  section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 2rem;
  }

  .section-content {
    max-width: 1200px;
    width: 100%;
    padding: 2rem;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 200;
    color: #b6bac5;
    text-align: center;
    margin-bottom: 3rem;
    letter-spacing: 2px;
  }

  /* Hero Section */
  .hero-section {
    background: linear-gradient(135deg, rgba(56, 62, 78, 0.1) 0%, rgba(183, 186, 197, 0.05) 100%);
    flex-direction: column;
  }

  .hero-content {
    text-align: center;
    z-index: 10;
  }

  .hero-name {
    font-size: 4rem;
    font-weight: 200;
    color: #b6bac5;
    margin-bottom: 1rem;
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(183, 186, 197, 0.3);
  }

  .hero-title {
    font-size: 1.5rem;
    font-weight: 300;
    color: rgba(183, 186, 197, 0.8);
    margin-bottom: 0.5rem;
    letter-spacing: 1px;
  }

  .hero-tagline {
    font-size: 1.1rem;
    color: rgba(183, 186, 197, 0.6);
    margin-bottom: 2rem;
    letter-spacing: 0.5px;
  }

  .hero-location {
    font-size: 0.9rem;
    color: rgba(183, 186, 197, 0.5);
    margin-bottom: 4rem;
  }

  .scroll-indicator {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: rgba(183, 186, 197, 0.5);
    font-size: 0.8rem;
    animation: pulse 2s infinite;
  }

  .scroll-arrow {
    width: 1px;
    height: 30px;
    background: linear-gradient(to bottom, transparent, #b6bac5);
    position: relative;
  }

  .scroll-arrow::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 6px solid #b6bac5;
  }

  /* About Section */
  .about-section {
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    margin: 2rem;
    padding: 3rem !important;
    border: 1px solid rgba(183, 186, 197, 0.1);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  }

  .about-grid {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 4rem;
    align-items: start;
  }

  .about-summary {
    font-size: 1.2rem;
    line-height: 1.8;
    color: #b6bac5;
    margin-bottom: 2rem;
    font-weight: 300;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  /* Mobile/Desktop text switching */
  .about-summary-mobile {
    display: none;
  }
  
  .about-summary-desktop {
    display: block;
  }

  /* Mobile/Desktop About Section Switching */
  .about-mobile {
    display: none;
  }
  
  .about-desktop {
    display: block;
  }

  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .contact-item {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .contact-label {
    font-weight: 500;
    color: #b6bac5;
    min-width: 60px;
  }

  .contact-item a {
    color: rgba(183, 186, 197, 0.8);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .contact-item a:hover {
    color: #b6bac5;
  }

  .contact-links {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .contact-links a {
    padding: 0.5rem 1rem;
    background: rgba(56, 62, 78, 0.3);
    border-radius: 20px;
    color: #b6bac5;
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }

  .contact-links a:hover {
    background: rgba(56, 62, 78, 0.5);
    transform: translateY(-2px);
  }

  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }

  .stat-item {
    text-align: center;
    padding: 1.5rem;
    background: rgba(56, 62, 78, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(183, 186, 197, 0.1);
  }

  .stat-number {
    display: block;
    font-size: 2rem;
    font-weight: 200;
    color: #b6bac5;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.8rem;
    color: rgba(183, 186, 197, 0.6);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  /* Animations */
  @keyframes pulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* Comprehensive Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .hero-section {
      padding: 2rem 1rem;
    }
    
    .hero-name {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      letter-spacing: 1px;
    }
    
    .hero-title {
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }
    
    .hero-tagline {
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    
    .hero-location {
      font-size: 0.8rem;
      margin-bottom: 2rem;
    }
    
    .scroll-indicator {
      font-size: 0.7rem;
    }
    
    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
    }
    
    .about-section {
      margin: 1rem;
      padding: 2rem !important;
      border-radius: 15px;
    }
    
    .about-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
    
    .about-summary {
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    /* Show mobile text, hide desktop text */
    .about-summary-mobile {
      display: block;
    }
    
    .about-summary-desktop {
      display: none;
    }
    
    .contact-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
    }
    
    .contact-links {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .stat-item {
      padding: 1rem;
    }
    
    .stat-number {
      font-size: 1.5rem;
    }
    
    .stat-label {
      font-size: 0.7rem;
    }
    
    .scroll-nav {
      right: 0.5rem;
      gap: 0.6rem;
    }
    
    .nav-dot {
      width: 4px;
      height: 4px;
      border-width: 1px;
    }
    
    .progress-bar {
      height: 2px;
    }
    
    .portfolio-section {
      padding: 1rem 0;
    }
    
    /* Mobile About Section */
    .about-mobile {
      display: block;
    }
    
    .about-desktop {
      display: none;
    }
    
    .mobile-about-card {
      background: rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      border: 1px solid rgba(183, 186, 197, 0.1);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    }
    
    .mobile-about-content {
      text-align: center;
    }
    
    .mobile-about-text {
      font-size: 1rem;
      line-height: 1.6;
      color: rgba(183, 186, 197, 0.9);
      margin-bottom: 2rem;
      text-align: left;
    }
    
    .mobile-quick-contact {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .mobile-contact-btn {
      flex: 1;
      padding: 1rem;
      background: linear-gradient(135deg, #383e4e, #b6bac5);
      color: white;
      text-decoration: none;
      border-radius: 15px;
      text-align: center;
      font-size: 0.9rem;
      font-weight: 600;
      transition: all 0.3s ease;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    
    .mobile-contact-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
    
    .mobile-stats {
      display: flex;
      justify-content: space-around;
      gap: 1rem;
    }
    
    .mobile-stat {
      text-align: center;
      padding: 1rem;
      background: rgba(183, 186, 197, 0.05);
      border-radius: 15px;
      flex: 1;
      border: 1px solid rgba(183, 186, 197, 0.1);
    }
    
    .mobile-stat-number {
      display: block;
      font-size: 1.8rem;
      font-weight: 700;
      color: #b6bac5;
      margin-bottom: 0.3rem;
      text-shadow: 0 0 10px rgba(183, 186, 197, 0.3);
    }
    
    .mobile-stat-label {
      font-size: 0.7rem;
      color: rgba(183, 186, 197, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 500;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .hero-name {
      font-size: 2.3rem;
      letter-spacing: 2px;
    }
    
    .hero-title {
      font-size: 1.2rem;
    }
    
    .hero-tagline {
      font-size: 1rem;
    }
    
    .section-title {
      font-size: 2rem;
    }
    
    .about-section {
      margin: 1.5rem;
      padding: 2.5rem !important;
    }
    
    .about-grid {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .about-summary {
      font-size: 1.1rem;
    }
    
    /* Show mobile text, hide desktop text */
    .about-summary-mobile {
      display: block;
    }
    
    .about-summary-desktop {
      display: none;
    }
    
    .stats-grid {
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .contact-links {
      flex-direction: row;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .hero-name {
      font-size: 3rem;
    }
    
    .hero-title {
      font-size: 1.3rem;
    }
    
    .section-title {
      font-size: 2.5rem;
    }
    
    .about-grid {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }
  
  /* Large Devices (desktops, 992px - 1199px) */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .hero-name {
      font-size: 3.5rem;
    }
    
    .about-grid {
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr 1fr;
    }
  }
  
  /* Extra Large Devices (1200px and up) */
  @media (min-width: 1200px) {
    .hero-name {
      font-size: 4rem;
    }
    
    .about-grid {
      grid-template-columns: 2fr 1fr;
      gap: 4rem;
    }
    
    .stats-grid {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
  }
  
  /* Landscape orientation for mobile devices */
  @media (orientation: landscape) and (max-height: 500px) {
    .hero-section {
      padding: 1rem;
    }
    
    .hero-name {
      font-size: 1.8rem;
      margin-bottom: 0.3rem;
    }
    
    .hero-title {
      font-size: 0.9rem;
      margin-bottom: 0.2rem;
    }
    
    .hero-tagline {
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    
    .hero-location {
      margin-bottom: 1rem;
    }
    
    .scroll-indicator {
      display: none;
    }
    
    .about-section {
      padding: 1.5rem !important;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .nav-dot {
      width: 16px;
      height: 16px;
      border-width: 3px;
    }
    
    .contact-links a {
      min-height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    /* Remove hover effects on touch devices */
    .nav-dot:hover {
      transform: none;
    }
    
    .contact-item a:hover,
    .contact-links a:hover {
      color: inherit;
      background: inherit;
      transform: none;
    }
  }
</style> 