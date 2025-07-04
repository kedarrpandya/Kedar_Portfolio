<script>
  import { onMount } from 'svelte'
  import { gsap } from 'gsap'
  import { ScrollTrigger } from 'gsap/ScrollTrigger'
  import { appState, isMenuOpen, fps, currentSection } from '../store/appState.js'
  import { portfolioData } from '../data/portfolioData.js'

  gsap.registerPlugin(ScrollTrigger)

  let manifestoText = `////////// WE BUILD DIGITAL EXPERIENCES THAT PUSH THE BOUNDARIES OF WHAT'S POSSIBLE. OUR APPROACH COMBINES CUTTING-EDGE TECHNOLOGY WITH ARTISTIC VISION TO CREATE IMMERSIVE WORLDS THAT CAPTIVATE AND INSPIRE.`
  
  let performanceElement
  let currentFPS = 120
  let activeSection = 0
  let scrollY = 0
  let innerHeight = 0

  // Navigation sections that match the actual sections in ScrollingPortfolio
  const navSections = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' }
  ]

  // Calculate active section based on scroll position
  $: {
    if (typeof window !== 'undefined' && scrollY !== undefined && innerHeight) {
      updateActiveSection();
    }
  }
  
  function updateActiveSection() {
    const sections = navSections.map(section => document.getElementById(section.id));
    let newActiveSection = 0;
    
    // Check each section to see which one is currently in view
    for (let i = sections.length - 1; i >= 0; i--) {
      const element = sections[i];
      if (element) {
        const rect = element.getBoundingClientRect();
        // If section top is above or at the viewport top (accounting for some offset)
        if (rect.top <= 100) {
          newActiveSection = i;
          break;
        }
      }
    }
    
    if (newActiveSection !== activeSection) {
      activeSection = newActiveSection;
      console.log('Active section updated to:', navSections[activeSection]?.label);
    }
  }

  // Function to scroll to a specific section
  function scrollToSection(sectionId) {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Handle navigation dot click
  function handleNavClick(sectionId) {
    scrollToSection(sectionId);
  }

  // Handle keyboard navigation
  function handleNavKeydown(event, sectionId) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      scrollToSection(sectionId);
    }
  }

  // Subscribe to FPS updates
  const unsubscribeFPS = fps.subscribe(value => {
    currentFPS = value
  })

  onMount(() => {
    // Force initial calculation
    setTimeout(() => {
      scrollY = window.scrollY;
      updateActiveSection();
    }, 100);
    
    return () => {
      unsubscribeFPS()
    }
  })

  function toggleMenu() {
    appState.toggleMenu()
  }

  // Sound toggle function removed - not used
</script>

<svelte:window bind:scrollY bind:innerHeight />

<!-- Glass Panel - Top Left -->
<div class="glass-panel">
  <div class="glass-header">
    <div class="logo-section">
      <div class="logo-text">Portfolio</div>
      <!-- <div class="logo-subtitle">PORTFOLIO</div> -->
    </div>
    <div class="experience-badge">
      <div class="experience-number">3+</div>
      <div class="experience-label">Years of Experience</div>
    </div>
  </div>
  
  <div class="profile-section">
    <div class="hero-name">{portfolioData.personal.name}</div>
    <div class="hero-title">{portfolioData.personal.title}</div>
    <div class="hero-subtitle">Data Specialist</div>
  </div>
  
  <div class="tagline-section">
    <div class="hero-tagline">{portfolioData.personal.tagline}</div>
    <div class="hero-location">
      <span class="location-dot">📍</span>
      Available Worldwide
    </div>
  </div>
  
  <div class="status-section">
    <div class="status-indicator">
      <div class="status-dot"></div>
      <div class="status-text">Available for Full-time / Contract /Project Roles</div>
    </div>
  </div>
</div>

<!-- Bottom Center - Scroll Indicator -->
<div class="scroll-indicator-container">
  <div class="scroll-indicator">
    <div class="scroll-text">Scroll to explore portfolio</div>
    <div class="scroll-arrow">↓</div>
  </div>
</div>

<!-- Right Side Navigation Panel -->
<div class="right-navigation">
  <div class="nav-dots">
    {#each navSections as section, index}
      <button 
        class="nav-dot {activeSection === index ? 'active' : ''}" 
        data-section={section.id}
        on:click={() => handleNavClick(section.id)}
        on:keydown={(event) => handleNavKeydown(event, section.id)}
        aria-label="Navigate to {section.label} section"
      >
        <div class="dot-indicator"></div>
        <div class="dot-label">{section.label}</div>
      </button>
    {/each}
  </div>
</div>

<!-- Sound control removed - unused functionality -->

<!-- Performance Monitor (Development)
<div class="performance-monitor" bind:this={performanceElement}>
  <div class="fps-counter">FPS: {currentFPS}</div>
</div> -->

<!-- Navigation Menu (Hidden by default) -->
{#if $isMenuOpen}
  <div class="menu-overlay">
    <div class="menu-content">
      <button class="menu-item" on:click={() => appState.setCurrentSection(0)}>
        HOME
      </button>
      <button class="menu-item" on:click={() => appState.setCurrentSection(1)}>
        ABOUT
      </button>
      <button class="menu-item" on:click={() => appState.setCurrentSection(2)}>
        PROJECTS
      </button>
      <button class="menu-item" on:click={() => appState.setCurrentSection(3)}>
        CONTACT
      </button>
    </div>
  </div>
{/if}

<style>
  /* Text Panel Styles */
  .glass-panel {
    position: absolute;
    top: 40px;
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    max-width: 95vw;
    z-index: 100;
    pointer-events: none;
    animation: fadeInText 2s ease 0.5s both;
    text-align: center;
    
    /* Simple Text Container */
    background: none;
    backdrop-filter: none;
    border-radius: 0;
    border: none;
    box-shadow: none;
    padding: 20px;
    overflow: visible;
  }

  .glass-panel::before {
    display: none;
  }

  .glass-panel::after {
    display: none;
  }

  /* Glass Header */
  .glass-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 25px;
    padding-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
  }

  .logo-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 15px;
  }

  .logo-text {
    font-size: 24px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 3px;
    text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  }

  .logo-subtitle {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.7);
    letter-spacing: 2px;
    font-weight: 300;
    margin-top: 2px;
  }

  .experience-badge {
    text-align: center;
    padding: 8px 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .experience-number {
    font-size: 18px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
  }

  .experience-label {
    font-size: 9px;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 1px;
    font-weight: 300;
  }

  /* Profile Section */
  .profile-section {
    margin-bottom: 20px;
    width: 100%;
    overflow: visible;
    text-align: center;
  }

  .hero-name {
    font-size: 36px;
    font-weight: 900;
    color: #ffffff;
    margin-bottom: 10px;
    letter-spacing: 2px;
    text-shadow: 
      0 0 30px rgba(255, 255, 255, 0.6),
      2px 2px 4px rgba(0, 0, 0, 0.5);
    line-height: 1.2;
    white-space: normal;
    overflow: visible;
    width: 100%;
    display: block;
    word-wrap: break-word;
  }

  .hero-title {
    font-size: 16px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 6px;
    letter-spacing: 0.5px;
    text-shadow: 0 0 15px rgba(255, 255, 255, 0.4);
    line-height: 1.4;
    word-wrap: break-word;
    overflow-wrap: break-word;
    width: 100%;
    display: block;
  }

  .hero-subtitle {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 300;
    letter-spacing: 1px;
  }

  /* Tagline Section */
  .tagline-section {
    margin-bottom: 20px;
    padding: 15px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .hero-tagline {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.5;
    margin-bottom: 10px;
    font-weight: 400;
    letter-spacing: 0.5px;
  }

  .hero-location {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    letter-spacing: 0.5px;
    font-weight: 300;
  }

  .location-dot {
    font-size: 12px;
  }

  /* Status Section */
  .status-section {
    margin-top: 15px;
  }

  .status-indicator {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 25px;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .status-dot {
    width: 8px;
    height: 8px;
    background: #4ade80;
    border-radius: 50%;
    animation: pulse 2s infinite;
    box-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
  }

  .status-text {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
    letter-spacing: 0.5px;
  }

  /* Scroll Indicator at Bottom Center */
  .scroll-indicator-container {
    position: fixed;
    bottom: 5%;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
    z-index: 100;
    pointer-events: none;
  }

  .scroll-indicator {
    animation: float 3s ease-in-out infinite;
  }

  .scroll-text {
    font-size: 12px;
    color: #b6bac5;
    letter-spacing: 2px;
    margin-bottom: 8px;
    text-transform: uppercase;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    animation: fadeInUp 1.5s ease 1.4s both;
  }

  .scroll-arrow {
    font-size: 18px;
    color: #b6bac5;
    animation: bounce 2s infinite;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
  }



  /* Sound control styles removed - functionality not used */

  /* Performance Monitor */
  .performance-monitor {
    position: fixed;
    top: 20px;
    left: 20px;
    z-index: 200;
    background: rgba(0, 0, 0, 0.7);
    padding: 8px 12px;
    border-radius: 4px;
    pointer-events: none;
  }

  .fps-counter {
    font-size: 12px;
    color: #00ff00;
    font-family: monospace;
    letter-spacing: 1px;
  }

  /* Menu Overlay */
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.95);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease;
  }

  .menu-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }

  .menu-item {
    font-size: 32px;
    color: #ffffff;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 10px 0;
    background: none;
    border: none;
    font-family: inherit;
    text-align: left;
    width: 100%;
  }

  .menu-item:hover {
    color: #cccccc;
    transform: translateX(10px);
  }

  .menu-item:focus {
    outline: 2px solid rgba(255, 255, 255, 0.5);
    outline-offset: 2px;
  }

  /* Animations */
  @keyframes fadeInText {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }



  @keyframes pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.7;
      transform: scale(1.1);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-5px); }
    60% { transform: translateY(-3px); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 480px and down) */
  @media (max-width: 480px) {
    .glass-panel {
      position: absolute;
      top: 20px;
      left: 10px;
      right: 10px;
      width: auto;
      max-width: none;
      padding: 20px 15px;
      border-radius: 0;
      background: none;
      backdrop-filter: none;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      overflow: visible;
    }
    
    .profile-section {
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      flex: 1;
    }
    
    .glass-header {
      display: none;
    }
    
    .logo-text {
      display: none;
    }
    
    .logo-subtitle {
      display: none;
    }
    
    .experience-badge {
      display: none;
    }
    
    .experience-number {
      display: none;
    }
    
    .experience-label {
      display: none;
    }
    
    .hero-name {
      font-size: 28px;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 0 25px rgba(255, 255, 255, 0.8);
      line-height: 1.2;
      text-align: center;
      white-space: normal;
      overflow: visible;
      word-wrap: break-word;
      overflow-wrap: break-word;
      width: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 0 0 auto;
    }
    
    .hero-title {
      font-size: 14px;
      margin-bottom: 4px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.4;
      letter-spacing: 0.2px;
      text-align: center;
      word-wrap: break-word;
      overflow-wrap: break-word;
      width: auto;
      display: flex;
      justify-content: center;
      align-items: center;
      white-space: normal;
      flex: 0 0 auto;
    }
    
    .hero-subtitle {
      display: none;
    }
    
    .tagline-section {
      display: none;
    }
    
    .hero-tagline {
      display: none;
    }
    
    .hero-location {
      display: none;
    }
    
    .status-section {
      display: none;
    }
    
    .status-indicator {
      display: none;
    }
    
    .status-text {
      display: none;
    }
    
    .scroll-text {
      font-size: 9px;
      letter-spacing: 1px;
    }
    
    .scroll-arrow {
      font-size: 14px;
    }
    
    .sound-control {
      bottom: 15px;
      right: 15px;
      width: 32px;
      height: 32px;
    }
    
    .sound-line {
      width: 16px;
      height: 1.5px;
    }
    
    .menu-item {
      font-size: 20px;
    }
  }
  
  /* Medium Mobile Devices (iPhone 12 Pro, etc - 481px - 575px) */
  @media (min-width: 481px) and (max-width: 575.98px) {
    .glass-panel {
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100vw - 30px);
      max-width: 450px;
      padding: 18px 15px;
      border-radius: 0;
      background: none;
      backdrop-filter: none;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      overflow: visible;
    }
    
    .profile-section {
      width: 100%;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .glass-header {
      display: none;
    }
    
    .logo-text {
      display: none;
    }
    
    .logo-subtitle {
      display: none;
    }
    
    .experience-badge {
      display: none;
    }
    
    .experience-number {
      display: none;
    }
    
    .experience-label {
      display: none;
    }
    
    .hero-name {
      font-size: 28px;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
      font-weight: 900;
      color: #ffffff;
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
      line-height: 1.1;
      text-align: center;
      white-space: normal;
      overflow: visible;
      word-wrap: break-word;
      overflow-wrap: break-word;
      width: 100%;
      display: block;
      max-width: 100%;
    }
    
    .hero-title {
      font-size: 14px;
      margin-bottom: 4px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.95);
      line-height: 1.3;
      letter-spacing: 0.2px;
      text-align: center;
      word-wrap: break-word;
      overflow-wrap: break-word;
      max-width: 100%;
      width: 100%;
      display: block;
      white-space: normal;
    }
    
    .hero-subtitle {
      display: none;
    }
    
    .tagline-section {
      display: none;
    }
    
    .hero-tagline {
      display: none;
    }
    
    .hero-location {
      display: none;
    }
    
    .status-section {
      display: none;
    }
    
    .status-indicator {
      display: none;
    }
    
    .status-text {
      display: none;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .glass-panel {
      top: 20px;
      left: 20px;
      width: 320px;
      padding: 25px;
    }
    
    .logo-text {
      font-size: 20px;
      letter-spacing: 2.5px;
    }
    
    .hero-name {
      font-size: 22px;
      letter-spacing: 1.5px;
    }
    
    .hero-title {
      font-size: 13px;
    }
    
    .hero-subtitle {
      font-size: 10px;
    }
    
    .hero-tagline {
      font-size: 11px;
    }
    
    .experience-number {
      font-size: 16px;
    }
    
    .experience-label {
      font-size: 8px;
    }
    
    .sound-control {
      width: 36px;
      height: 36px;
    }
    
    .menu-item {
      font-size: 22px;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .glass-panel {
      top: 30px;
      left: 30px;
      width: 350px;
      padding: 28px;
    }
    
    .logo-text {
      font-size: 22px;
    }
    
    .hero-name {
      font-size: 24px;
    }
    
    .hero-title {
      font-size: 14px;
    }
    
    .hero-tagline {
      font-size: 12px;
    }
    
    .experience-number {
      font-size: 17px;
    }
    
    .menu-item {
      font-size: 26px;
    }
  }
  
  /* Large Devices (desktops, 992px - 1199px) */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .glass-panel {
      top: 35px;
      left: 35px;
      width: 370px;
    }
    
    .hero-name {
      font-size: 26px;
    }
    
    .hero-title {
      font-size: 15px;
    }
    
    .menu-item {
      font-size: 28px;
    }
  }
  
  /* Extra Large Devices (1200px and up) */
  @media (min-width: 1200px) {
    .glass-panel {
      top: 40px;
      left: 40px;
      width: 380px;
    }
    
    .menu-item {
      font-size: 30px;
    }
  }
  
  /* Landscape orientation adjustments */
  @media (orientation: landscape) and (max-height: 500px) {
    .glass-panel {
      top: 10px;
      padding: 15px 20px;
    }
    
    .glass-header {
      margin-bottom: 12px;
      padding-bottom: 8px;
    }
    
    .profile-section {
      margin-bottom: 12px;
    }
    
    .tagline-section {
      padding: 8px 0;
      margin-bottom: 12px;
    }
    
    .hero-name {
      font-size: 18px;
      margin-bottom: 4px;
    }
    
    .hero-title {
      font-size: 11px;
      margin-bottom: 2px;
    }
    
    .hero-subtitle {
      font-size: 9px;
    }
  }

  /* Right Side Navigation */
  .right-navigation {
    position: fixed;
    right: 25px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    pointer-events: all;
  }

  .debug-indicator {
    position: absolute;
    top: -40px;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    color: rgba(183, 186, 197, 0.9);
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 8px;
    white-space: nowrap;
    border: 1px solid rgba(183, 186, 197, 0.2);
  }

  .nav-dots {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 0;
  }

  .nav-dot {
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0;
    padding: 8px 0;
    background: none;
    border: none;
    transition: all 0.3s ease;
    border-radius: 0;
    min-width: auto;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .dot-indicator {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(183, 186, 197, 0.3);
    border: none;
    transition: all 0.4s ease;
    position: relative;
    flex-shrink: 0;
  }

  .nav-dot.active .dot-indicator {
    background: rgba(183, 186, 197, 1);
    transform: scale(2.5);
    box-shadow: 0 0 8px rgba(183, 186, 197, 0.6);
  }

  .nav-dot:hover .dot-indicator {
    background: rgba(183, 186, 197, 0.6);
    transform: scale(1.5);
  }

  .dot-label {
    font-size: 9px;
    color: rgba(183, 186, 197, 0.6);
    font-weight: 400;
    letter-spacing: 0.3px;
    opacity: 0;
    transform: translateX(-12px);
    transition: all 0.3s ease;
    white-space: nowrap;
    text-transform: uppercase;
    position: absolute;
    right: 25px;
    top: 50%;
    transform: translateY(-50%) translateX(-12px);
    background: rgba(0, 0, 0, 0.8);
    padding: 4px 8px;
    border-radius: 4px;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(183, 186, 197, 0.1);
  }

  .nav-dot:hover .dot-label {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
    color: rgba(183, 186, 197, 0.9);
  }

  .nav-dot:focus {
    outline: 2px solid rgba(183, 186, 197, 0.5);
    outline-offset: 2px;
  }

  /* Responsive Design for Right Navigation */
  @media (max-width: 1400px) {
    .right-navigation {
      display: none;
    }
  }

  @media (min-width: 1400px) {
    .nav-dots {
      gap: 14px;
    }
    
    .nav-dot {
      width: 16px;
      height: 16px;
    }
    
    .dot-indicator {
      width: 3px;
      height: 3px;
    }
    
    .dot-label {
      font-size: 8px;
      right: 20px;
    }
  }

  @media (min-width: 1600px) {
    .right-navigation {
      right: 30px;
    }
    
    .nav-dots {
      gap: 16px;
    }
    
    .nav-dot {
      width: 20px;
      height: 20px;
    }
    
    .dot-indicator {
      width: 4px;
      height: 4px;
    }
    
    .dot-label {
      font-size: 9px;
      right: 25px;
    }
  }
</style> 