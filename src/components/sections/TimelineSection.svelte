<script>
  export let data;
  import { onMount } from 'svelte';
  
  let timelineRef;
  let visible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    
    if (timelineRef) observer.observe(timelineRef);
    
    return () => observer.disconnect();
  });

  function getTypeColor(type) {
    switch(type) {
      case 'education': return '#4CAF50';
      case 'career': return '#2196F3';
      case 'achievement': return '#FF9800';
      default: return '#b6bac5';
    }
  }

  function getTypeIcon(type) {
    switch(type) {
      case 'education': return '🎓';
      case 'career': return '💼';
      case 'achievement': return '🏆';
      default: return '📅';
    }
  }
</script>

<div class="timeline-section" bind:this={timelineRef}>
  <div class="section-content">
    <h2 class="section-title">Career Journey</h2>
    <p class="timeline-subtitle">A chronological view of my professional growth and achievements</p>
    
    <div class="timeline-container">
      <div class="timeline-line"></div>
      
      {#each data.timeline as event, index}
        <div 
          class="timeline-item" 
          class:visible 
          style="--delay: {index * 0.15}s; --color: {getTypeColor(event.type)}"
        >
          <div class="timeline-marker">
            <div class="marker-icon">{getTypeIcon(event.type)}</div>
            <div class="marker-year">{event.year}</div>
          </div>
          
          <div class="timeline-content">
            <div class="timeline-type" style="color: {getTypeColor(event.type)}">
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </div>
            <h3 class="timeline-event">{event.event}</h3>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Leadership & Achievements -->
    <div class="achievements-section">
      <h3 class="achievements-title">Leadership & Impact</h3>
      <div class="achievements-grid">
        {#each data.leadership as leadership, index}
          <div 
            class="achievement-card" 
            class:visible 
            style="--delay: {(data.timeline.length + index) * 0.1}s"
          >
            <h4 class="achievement-title">{leadership.title}</h4>
            <div class="achievement-org">{leadership.organization}</div>
            <div class="achievement-period">{leadership.period}</div>
            <p class="achievement-description">{leadership.description}</p>
            <div class="achievement-impact">
              <span class="impact-label">Impact:</span>
              <span class="impact-value">{leadership.impact}</span>
            </div>
            <div class="achievement-skills">
              {#each leadership.skills as skill}
                <span class="skill-tag">{skill}</span>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .timeline-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: rgba(56, 62, 78, 0.03);
  }

  .section-content {
    max-width: 1000px;
    width: 100%;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 200;
    color: #b6bac5;
    text-align: center;
    margin-bottom: 1rem;
    letter-spacing: 2px;
  }

  .timeline-subtitle {
    text-align: center;
    color: rgba(183, 186, 197, 0.7);
    margin-bottom: 4rem;
    font-size: 1.1rem;
  }

  /* Timeline */
  .timeline-container {
    position: relative;
    margin-bottom: 4rem;
  }

  .timeline-line {
    position: absolute;
    left: 2rem;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, #383e4e, rgba(56, 62, 78, 0.3));
  }

  .timeline-item {
    display: grid;
    grid-template-columns: 80px 1fr;
    gap: 2rem;
    margin-bottom: 2rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
    transition-delay: var(--delay);
  }

  .timeline-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .timeline-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 2;
  }

  .marker-icon {
    width: 40px;
    height: 40px;
    background: var(--color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 3px solid #383e4e;
    margin-bottom: 0.5rem;
  }

  .marker-year {
    background: rgba(56, 62, 78, 0.9);
    color: #b6bac5;
    padding: 0.3rem 0.6rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
  }

  .timeline-content {
    background: rgba(56, 62, 78, 0.05);
    border: 1px solid rgba(183, 186, 197, 0.1);
    border-radius: 12px;
    padding: 1.5rem;
    position: relative;
  }

  .timeline-content::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 20px;
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid rgba(56, 62, 78, 0.05);
  }

  .timeline-type {
    font-size: 0.8rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
  }

  .timeline-event {
    font-size: 1.1rem;
    font-weight: 400;
    color: #b6bac5;
    line-height: 1.4;
  }

  /* Achievements */
  .achievements-section {
    margin-top: 4rem;
  }

  .achievements-title {
    font-size: 2rem;
    font-weight: 300;
    color: #b6bac5;
    text-align: center;
    margin-bottom: 3rem;
  }

  .achievements-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 2rem;
  }

  .achievement-card {
    background: rgba(56, 62, 78, 0.05);
    border: 1px solid rgba(183, 186, 197, 0.1);
    border-radius: 16px;
    padding: 2rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
    transition-delay: var(--delay);
  }

  .achievement-card.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .achievement-title {
    font-size: 1.3rem;
    font-weight: 400;
    color: #b6bac5;
    margin-bottom: 0.5rem;
  }

  .achievement-org {
    color: rgba(183, 186, 197, 0.8);
    font-weight: 500;
    margin-bottom: 0.3rem;
  }

  .achievement-period {
    color: rgba(183, 186, 197, 0.6);
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .achievement-description {
    color: rgba(183, 186, 197, 0.8);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .achievement-impact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 1rem;
    background: rgba(183, 186, 197, 0.05);
    border-radius: 8px;
  }

  .impact-label {
    color: rgba(183, 186, 197, 0.6);
    font-size: 0.9rem;
  }

  .impact-value {
    color: #b6bac5;
    font-weight: 500;
  }

  .achievement-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .skill-tag {
    background: rgba(183, 186, 197, 0.1);
    color: rgba(183, 186, 197, 0.8);
    padding: 0.3rem 0.6rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .section-title {
      font-size: 2rem;
    }

    .timeline-item {
      grid-template-columns: 60px 1fr;
      gap: 1rem;
    }

    .timeline-line {
      left: 1.5rem;
    }

    .marker-icon {
      width: 35px;
      height: 35px;
      font-size: 1rem;
    }

    .timeline-content {
      padding: 1rem;
    }

    .achievements-grid {
      grid-template-columns: 1fr;
    }

    .achievement-card {
      padding: 1.5rem;
    }
  }
</style> 