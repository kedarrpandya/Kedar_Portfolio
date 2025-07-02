<script>
  export let data;
  import { onMount } from 'svelte';
  
  let educationRef;
  let visible = false;

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    
    if (educationRef) observer.observe(educationRef);
    
    return () => observer.disconnect();
  });
</script>

<div class="education-section" bind:this={educationRef}>
  <div class="section-content">
    <h2 class="section-title">Education & Certifications</h2>
    
    <div class="education-content">
      <!-- Education -->
      <div class="education-block">
        <h3 class="block-title">Academic Background</h3>
        <div class="education-timeline">
          {#each data.education as edu, index}
            <div 
              class="education-item" 
              class:visible 
              style="--delay: {index * 0.2}s"
            >
              <div class="education-marker">
                <div class="marker-dot"></div>
                <div class="marker-line"></div>
              </div>
              
              <div class="education-content-card">
                <div class="education-header">
                  <h4 class="education-degree">{edu.degree}</h4>
                  <div class="education-meta">
                    <span class="education-school">{edu.school}</span>
                    <span class="education-location">{edu.location}</span>
                    <span class="education-period">{edu.startDate} - {edu.endDate}</span>
                    {#if edu.current}
                      <span class="education-current">Latest</span>
                    {/if}
                  </div>
                </div>
                
                <p class="education-description education-description-mobile">{edu.description.substring(0, 100)}...</p>
      <p class="education-description education-description-desktop">{edu.description}</p>
                
                <div class="education-courses">
                  <span class="courses-label">Relevant Coursework:</span>
                  <div class="courses-list">
                    {#each edu.relevantCourses as course}
                      <span class="course-tag">{course}</span>
                    {/each}
                  </div>
                </div>
                
                <div class="education-gpa">
                  <span class="gpa-label">GPA:</span>
                  <span class="gpa-value">{edu.gpa}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Certifications -->
      <div class="certifications-block">
        <h3 class="block-title">Professional Certifications</h3>
        <div class="certifications-grid">
          {#each data.certifications as cert, index}
            <div 
              class="certification-card" 
              class:visible 
              style="--delay: {(data.education.length + index) * 0.15}s"
            >
              <div class="cert-header">
                <h4 class="cert-name">{cert.name}</h4>
                <div class="cert-meta">
                  <span class="cert-issuer">{cert.issuer}</span>
                  <span class="cert-date">{cert.date}</span>
                </div>
              </div>
              
              <p class="cert-description cert-description-mobile">{cert.description.substring(0, 90)}...</p>
      <p class="cert-description cert-description-desktop">{cert.description}</p>
              
              <div class="cert-skills">
                {#each cert.skills as skill}
                  <span class="skill-tag">{skill}</span>
                {/each}
              </div>
              
              <div class="cert-footer">
                <span class="cert-id">ID: {cert.credentialId}</span>
                {#if cert.verified}
                  <span class="cert-verified">✓ Verified</span>
                {/if}
              </div>
            </div>
          {/each}
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  .education-section {
    min-height: 100vh;
    padding: 3rem !important;
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
    max-width: 1200px;
    width: 100%;
  }

  .section-title {
    font-size: 3rem;
    font-weight: 200;
    color: #b6bac5;
    text-align: center;
    margin-bottom: 4rem;
    letter-spacing: 2px;
  }

  .education-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
  }

  .block-title {
    font-size: 1.8rem;
    font-weight: 300;
    color: #b6bac5;
    margin-bottom: 2rem;
    text-align: center;
  }

  /* Education Timeline */
  .education-timeline {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }

  .education-item {
    display: grid;
    grid-template-columns: 60px 1fr;
    gap: 2rem;
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.8s ease;
    transition-delay: var(--delay);
  }

  .education-item.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .education-marker {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
  }

  .marker-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: #b6bac5;
    border: 3px solid #383e4e;
    z-index: 2;
    position: relative;
  }

  .marker-line {
    width: 2px;
    height: 100%;
    background: linear-gradient(to bottom, #383e4e, rgba(56, 62, 78, 0.3));
    position: absolute;
    top: 16px;
    z-index: 1;
  }

  .education-item:last-child .marker-line {
    display: none;
  }

  .education-content-card {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(183, 186, 197, 0.2);
    border-radius: 15px;
    padding: 2rem;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .education-header {
    margin-bottom: 1.5rem;
  }

  .education-degree {
    font-size: 1.3rem;
    font-weight: 400;
    color: #b6bac5;
    margin-bottom: 0.5rem;
  }

  .education-meta {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    font-size: 0.9rem;
    color: rgba(183, 186, 197, 0.7);
  }

  .education-school {
    font-weight: 500;
    color: #b6bac5;
  }

  .education-current {
    background: #4CAF50;
    color: white;
    padding: 0.2rem 0.5rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 500;
    width: fit-content;
  }

  .education-description {
    color: rgba(183, 186, 197, 0.8);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
  
  /* Mobile/Desktop content switching */
  .education-description-mobile,
  .cert-description-mobile {
    display: none;
  }
  
  .education-description-desktop,
  .cert-description-desktop {
    display: block;
  }

  .education-courses {
    margin-bottom: 1rem;
  }

  .courses-label {
    color: #b6bac5;
    font-size: 0.9rem;
    font-weight: 500;
    display: block;
    margin-bottom: 0.5rem;
  }

  .courses-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .course-tag {
    background: rgba(183, 186, 197, 0.1);
    color: rgba(183, 186, 197, 0.8);
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    font-size: 0.75rem;
  }

  .education-gpa {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(183, 186, 197, 0.1);
  }

  .gpa-label {
    color: rgba(183, 186, 197, 0.6);
    font-size: 0.9rem;
  }

  .gpa-value {
    color: #b6bac5;
    font-weight: 500;
  }

  /* Certifications Grid */
  .certifications-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .certification-card {
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(183, 186, 197, 0.2);
    border-radius: 15px;
    padding: 1.5rem;
    opacity: 0;
    transform: translateX(50px);
    transition: all 0.8s ease;
    transition-delay: var(--delay);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  .certification-card.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .cert-header {
    margin-bottom: 1rem;
  }

  .cert-name {
    font-size: 1.1rem;
    font-weight: 400;
    color: #b6bac5;
    margin-bottom: 0.5rem;
  }

  .cert-meta {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;
    color: rgba(183, 186, 197, 0.7);
  }

  .cert-issuer {
    font-weight: 500;
    color: #b6bac5;
  }

  .cert-description {
    color: rgba(183, 186, 197, 0.8);
    line-height: 1.5;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }

  .cert-skills {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
    margin-bottom: 1rem;
  }

  .skill-tag {
    background: rgba(183, 186, 197, 0.1);
    color: rgba(183, 186, 197, 0.8);
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
    font-size: 0.7rem;
  }

  .cert-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: rgba(183, 186, 197, 0.6);
  }

  .cert-verified {
    color: #4CAF50;
    font-weight: 500;
  }

  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .education-section {
      padding: 2rem 1rem;
      margin: 1rem;
      border-radius: 15px;
    }
    
    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }
    
    .education-content {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .block-title {
      font-size: 1.3rem;
      margin-bottom: 1.5rem;
    }
    
    .education-list {
      gap: 2rem;
    }
    
    .education-item {
      grid-template-columns: 30px 1fr;
      gap: 0.8rem;
    }
    
    .education-content-card {
      padding: 1.2rem;
    }
    
    .education-degree {
      font-size: 1.1rem;
      margin-bottom: 0.4rem;
    }
    
    .education-meta {
      font-size: 0.8rem;
      gap: 0.2rem;
    }
    
    .education-description {
      font-size: 0.9rem;
      line-height: 1.5;
      margin-bottom: 1.2rem;
    }
    
    /* Show mobile content, hide desktop content */
    .education-description-mobile,
    .cert-description-mobile {
      display: block;
    }
    
    .education-description-desktop,
    .cert-description-desktop {
      display: none;
    }
    
    .courses-label {
      font-size: 0.8rem;
    }
    
    .course-tag {
      padding: 0.15rem 0.4rem;
      font-size: 0.7rem;
    }
    
    .education-gpa {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
    }
    
    .gpa-label {
      font-size: 0.8rem;
    }
    
    .certification-card {
      padding: 1.2rem;
    }
    
    .cert-name {
      font-size: 1rem;
      margin-bottom: 0.4rem;
    }
    
    .cert-meta {
      flex-direction: column;
      gap: 0.2rem;
      font-size: 0.75rem;
    }
    
    .cert-description {
      font-size: 0.85rem;
      margin-bottom: 0.8rem;
    }
    
    .skill-tag {
      padding: 0.15rem 0.4rem;
      font-size: 0.65rem;
    }
    
    .cert-footer {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.3rem;
      font-size: 0.7rem;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .education-section {
      padding: 3rem 1.5rem;
      margin: 1.5rem;
    }
    
    .section-title {
      font-size: 2.2rem;
      margin-bottom: 3rem;
    }
    
    .education-content {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
    
    .education-item {
      grid-template-columns: 35px 1fr;
      gap: 1rem;
    }
    
    .education-content-card,
    .certification-card {
      padding: 1.5rem;
    }
    
    .block-title {
      font-size: 1.6rem;
    }
    
    .education-degree {
      font-size: 1.2rem;
    }
    
    .cert-name {
      font-size: 1.05rem;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .section-title {
      font-size: 2.8rem;
    }
    
    .education-content {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    
    .education-item {
      grid-template-columns: 40px 1fr;
      gap: 1.2rem;
    }
    
    .block-title {
      font-size: 1.8rem;
    }
  }
  
  /* Large Devices (desktops, 992px and up) */
  @media (min-width: 992px) {
    .education-content {
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .course-tag,
    .skill-tag {
      min-height: 32px;
      min-width: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .education-current {
      min-height: 32px;
      display: flex;
      align-items: center;
    }
  }
  
  /* Landscape orientation for small screens */
  @media (orientation: landscape) and (max-height: 500px) {
    .education-section {
      padding: 1.5rem 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .education-content {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .education-list {
      gap: 1rem;
    }
    
    .education-content-card,
    .certification-card {
      padding: 1rem;
    }
    
    .block-title {
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    
    .education-description,
    .cert-description {
      margin-bottom: 0.8rem;
    }
  }
</style> 