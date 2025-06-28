<script>
  export let data;
  import { onMount } from 'svelte';
  
  let contactRef;
  let visible = false;
  let isFormFocused = false;
  let copiedField = '';
  
  const contactInfo = [
    { 
      label: 'Email', 
      value: data.personal.email, 
      icon: '✉', 
      link: `mailto:${data.personal.email}`,
      color: '#64B5F6'
    },
    { 
      label: 'Phone', 
      value: data.personal.phone, 
      icon: '📱', 
      link: `tel:${data.personal.phone}`,
      color: '#81C784'
    },
    { 
      label: 'Location', 
      value: data.personal.location, 
      icon: '📍', 
      link: `https://maps.google.com/?q=${encodeURIComponent(data.personal.location)}`,
      color: '#FFB74D'
    },
    { 
      label: 'LinkedIn', 
      value: 'linkedin.com/in/kedarrpandya', 
      icon: '💼', 
      link: data.personal.linkedin,
      color: '#4DB6AC'
    },
    { 
      label: 'GitHub', 
      value: 'github.com/kedarrpandya', 
      icon: '🔗', 
      link: data.personal.github,
      color: '#9C27B0'
    }
  ];

  onMount(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0.3 }
    );
    
    if (contactRef) observer.observe(contactRef);
    
    return () => observer.disconnect();
  });
  
  function copyToClipboard(value, field) {
    navigator.clipboard.writeText(value).then(() => {
      copiedField = field;
      setTimeout(() => {
        copiedField = '';
      }, 2000);
    });
  }
  
  function handleSubmit(event) {
    event.preventDefault();
    // Handle form submission
    alert('Thank you for your message! I\'ll get back to you soon.');
  }
</script>

<div class="contact-section" bind:this={contactRef}>
  <div class="section-content">
    <div class="header-area" class:visible>
      <h2 class="section-title">Let's Build Something Amazing</h2>
      <p class="section-subtitle">Ready to turn your data into insights? Let's collaborate on your next project!</p>
    </div>
    
    <div class="contact-container">
      <!-- Contact Cards -->
      <div class="contact-cards">
        {#each contactInfo as contact, index}
          <div 
            class="contact-card" 
            class:visible
            style="--delay: {index * 0.1}s; --color: {contact.color}"
            on:click={() => copyToClipboard(contact.value, contact.label)}
            role="button"
            tabindex="0"
          >
            <div class="card-icon" style="background: {contact.color}20">
              <span class="icon">{contact.icon}</span>
            </div>
            <div class="card-content">
              <div class="card-label">{contact.label}</div>
              <div class="card-value">{contact.value}</div>
              {#if copiedField === contact.label}
                <div class="copied-indicator">Copied!</div>
              {/if}
            </div>
            <div class="card-action">
              <a href={contact.link} target="_blank" rel="noopener noreferrer">
                <span class="action-icon">↗</span>
              </a>
            </div>
          </div>
        {/each}
      </div>
      
      <!-- Contact Form -->
      <div class="contact-form-container" class:visible>
        <div class="form-header">
          <h3>Send a Message</h3>
          <p>Let's discuss your next project</p>
        </div>
        
        <form class="contact-form" class:focused={isFormFocused} on:submit={handleSubmit}>
          <div class="form-group">
            <input 
              type="text" 
              id="name" 
              required 
              placeholder=" "
              on:focus={() => isFormFocused = true}
              on:blur={() => isFormFocused = false}
            />
            <label for="name">Your Name</label>
            <div class="form-line"></div>
          </div>
          
          <div class="form-group">
            <input 
              type="email" 
              id="email" 
              required 
              placeholder=" "
              on:focus={() => isFormFocused = true}
              on:blur={() => isFormFocused = false}
            />
            <label for="email">Email Address</label>
            <div class="form-line"></div>
          </div>
          
          <div class="form-group">
            <input 
              type="text" 
              id="subject" 
              required 
              placeholder=" "
              on:focus={() => isFormFocused = true}
              on:blur={() => isFormFocused = false}
            />
            <label for="subject">Subject</label>
            <div class="form-line"></div>
          </div>
          
          <div class="form-group">
            <textarea 
              id="message" 
              required 
              rows="5" 
              placeholder=" "
              on:focus={() => isFormFocused = true}
              on:blur={() => isFormFocused = false}
            ></textarea>
            <label for="message">Your Message</label>
            <div class="form-line"></div>
          </div>
          
          <button type="submit" class="submit-btn">
            <span class="btn-text">Send Message</span>
            <span class="btn-icon">→</span>
          </button>
        </form>
      </div>
    </div>
    
    <!-- Professional Signature -->
    <div class="signature" class:visible>
      <div class="signature-line"></div>
      <div class="signature-text">
        Available for Data Analytics & BI / Softaware Development Projects • Response within 24 hours
      </div>
      <div class="signature-line"></div>
    </div>
  </div>
</div>

<style>
  .contact-section {
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
    overflow: hidden;
  }

  .section-content {
    max-width: 1200px;
    width: 100%;
    z-index: 2;
  }

  /* Header */
  .header-area {
    text-align: center;
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease;
  }

  .header-area.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .section-title {
    font-size: 3rem;
    font-weight: 200;
    color: #b6bac5;
    margin-bottom: 1rem;
    letter-spacing: 2px;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }

  .section-subtitle {
    font-size: 1.2rem;
    color: rgba(183, 186, 197, 0.8);
    font-weight: 300;
    max-width: 600px;
    margin: 0 auto;
  }

  /* Main Container */
  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    margin-bottom: 4rem;
  }

  /* Contact Cards */
  .contact-cards {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .contact-card {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(183, 186, 197, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr auto;
    gap: 1rem;
    align-items: center;
    backdrop-filter: blur(15px);
    transition: all 0.3s ease;
    cursor: pointer;
    opacity: 0;
    transform: translateX(-30px);
    animation-delay: var(--delay);
  }

  .contact-card.visible {
    opacity: 1;
    transform: translateX(0);
    animation: slideInLeft 0.6s ease forwards;
  }

  .contact-card:hover {
    transform: translateY(-5px);
    border-color: var(--color);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }

  .card-icon {
    width: 50px;
    height: 50px;
    border-radius: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .contact-card:hover .card-icon {
    transform: scale(1.1);
    background: var(--color) !important;
  }

  .icon {
    font-size: 1.5rem;
  }

  .card-content {
    position: relative;
  }

  .card-label {
    font-size: 0.9rem;
    color: rgba(183, 186, 197, 0.7);
    margin-bottom: 0.3rem;
    font-weight: 300;
  }

  .card-value {
    font-size: 1.1rem;
    color: #b6bac5;
    font-weight: 400;
  }

  .copied-indicator {
    position: absolute;
    top: -30px;
    left: 0;
    background: var(--color);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 500;
    animation: fadeInOut 2s ease;
  }

  .card-action {
    opacity: 0;
    transition: all 0.3s ease;
  }

  .contact-card:hover .card-action {
    opacity: 1;
  }

  .card-action a {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    background: var(--color);
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .action-icon {
    color: white;
    font-size: 1rem;
    font-weight: bold;
  }

  /* Contact Form */
  .contact-form-container {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(183, 186, 197, 0.1);
    border-radius: 25px;
    padding: 2.5rem;
    backdrop-filter: blur(15px);
    opacity: 0;
    transform: translateX(30px);
    transition: all 0.8s ease;
  }

  .contact-form-container.visible {
    opacity: 1;
    transform: translateX(0);
  }

  .form-header {
    margin-bottom: 2rem;
    text-align: center;
  }

  .form-header h3 {
    font-size: 1.8rem;
    color: #b6bac5;
    font-weight: 300;
    margin-bottom: 0.5rem;
  }

  .form-header p {
    color: rgba(183, 186, 197, 0.7);
    font-weight: 300;
  }

  .contact-form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .form-group {
    position: relative;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 2px solid rgba(183, 186, 197, 0.2);
    padding: 1rem 0 0.5rem 0;
    font-size: 1rem;
    color: #b6bac5;
    transition: all 0.3s ease;
    resize: vertical;
  }

  .form-group input:focus,
  .form-group textarea:focus {
    outline: none;
    border-bottom-color: #b6bac5;
  }

  .form-group label {
    position: absolute;
    left: 0;
    top: 1rem;
    color: rgba(183, 186, 197, 0.6);
    font-size: 1rem;
    transition: all 0.3s ease;
    pointer-events: none;
    font-weight: 300;
  }

  .form-group input:focus + label,
  .form-group input:not(:placeholder-shown) + label,
  .form-group textarea:focus + label,
  .form-group textarea:not(:placeholder-shown) + label {
    top: -0.5rem;
    font-size: 0.85rem;
    color: #b6bac5;
  }

  .form-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, #64B5F6, #81C784);
    transition: width 0.3s ease;
  }

  .form-group input:focus ~ .form-line,
  .form-group textarea:focus ~ .form-line {
    width: 100%;
  }

  .submit-btn {
    background: linear-gradient(135deg, #383e4e, #b6bac5);
    border: none;
    border-radius: 50px;
    padding: 1rem 2rem;
    color: white;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1rem;
    position: relative;
    overflow: hidden;
  }

  .submit-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
  }

  .submit-btn:active {
    transform: translateY(0);
  }

  .btn-icon {
    transition: transform 0.3s ease;
  }

  .submit-btn:hover .btn-icon {
    transform: translateX(5px);
  }

  /* Signature */
  .signature {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s ease 0.5s;
  }

  .signature.visible {
    opacity: 1;
    transform: translateY(0);
  }

  .signature-line {
    height: 1px;
    width: 100px;
    background: linear-gradient(90deg, transparent, rgba(183, 186, 197, 0.3), transparent);
  }

  .signature-text {
    color: rgba(183, 186, 197, 0.6);
    font-size: 0.9rem;
    font-weight: 300;
    text-align: center;
    white-space: nowrap;
  }

  /* Animations */
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0; transform: translateY(10px); }
    20%, 80% { opacity: 1; transform: translateY(0); }
  }

  /* Mobile Responsive Design */
  
  /* Extra Small Devices (phones, 576px and down) */
  @media (max-width: 575.98px) {
    .contact-section {
      padding: 2rem 1rem;
      margin: 1rem;
      border-radius: 15px;
    }
    
    .section-title {
      font-size: 1.8rem;
      margin-bottom: 2rem;
      letter-spacing: 1px;
    }
    
    .contact-container {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
    
    .contact-cards {
      order: 2;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .contact-form-container {
      order: 1;
      padding: 1.2rem;
      border-radius: 15px;
    }
    
    .contact-card {
      padding: 1rem;
      border-radius: 12px;
    }
    
    .card-content {
      gap: 0.8rem;
    }
    
    .card-icon {
      font-size: 1.5rem;
    }
    
    .card-title {
      font-size: 1rem;
      margin-bottom: 0.3rem;
    }
    
    .card-info {
      font-size: 0.9rem;
    }
    
    .card-meta {
      font-size: 0.75rem;
    }
    
    .copy-btn {
      width: 32px;
      height: 32px;
      padding: 0.4rem;
    }
    
    .copy-btn svg {
      width: 12px;
      height: 12px;
    }
    
    .form-header h3 {
      font-size: 1.4rem;
      margin-bottom: 0.4rem;
    }
    
    .form-header p {
      font-size: 0.9rem;
    }
    
    .contact-form {
      gap: 1.5rem;
    }
    
    .form-group input,
    .form-group textarea {
      font-size: 0.9rem;
      padding: 0.8rem 0 0.4rem 0;
    }
    
    .form-group label {
      font-size: 0.9rem;
      top: 0.8rem;
    }
    
    .form-group input:focus + label,
    .form-group input:not(:placeholder-shown) + label,
    .form-group textarea:focus + label,
    .form-group textarea:not(:placeholder-shown) + label {
      font-size: 0.75rem;
    }
    
    .submit-btn {
      padding: 0.8rem 1.5rem;
      font-size: 0.9rem;
      border-radius: 25px;
      margin-top: 0.5rem;
    }
    
    .signature {
      flex-direction: column;
      gap: 0.8rem;
    }
    
    .signature-line {
      width: 40px;
    }
    
    .signature-text {
      font-size: 0.8rem;
      white-space: normal;
      text-align: center;
    }
  }
  
  /* Small Devices (landscape phones, 576px - 767px) */
  @media (min-width: 576px) and (max-width: 767.98px) {
    .contact-section {
      padding: 3rem 1.5rem;
      margin: 1.5rem;
    }
    
    .section-title {
      font-size: 2.2rem;
      margin-bottom: 3rem;
    }
    
    .contact-container {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }
    
    .contact-cards {
      order: 2;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .contact-form-container {
      order: 1;
      padding: 1.5rem;
    }
    
    .form-header h3 {
      font-size: 1.6rem;
    }
    
    .signature {
      flex-direction: row;
      gap: 1.5rem;
    }
    
    .signature-line {
      width: 60px;
    }
  }
  
  /* Medium Devices (tablets, 768px - 991px) */
  @media (min-width: 768px) and (max-width: 991.98px) {
    .section-title {
      font-size: 2.8rem;
    }
    
    .contact-container {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
    
    .contact-cards {
      order: 2;
      grid-template-columns: repeat(2, 1fr);
    }
    
    .contact-form-container {
      order: 1;
      padding: 2rem;
    }
    
    .form-header h3 {
      font-size: 1.7rem;
    }
  }
  
  /* Large Devices (desktops, 992px - 1199px) */
  @media (min-width: 992px) and (max-width: 1199.98px) {
    .contact-container {
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }
    
    .contact-cards {
      order: 2;
      grid-template-columns: 1fr;
    }
    
    .contact-form-container {
      order: 1;
    }
  }
  
  /* Extra Large Devices (1200px and up) */
  @media (min-width: 1200px) {
    .contact-container {
      grid-template-columns: 2fr 1fr;
      gap: 4rem;
    }
  }
  
  /* Touch device optimizations */
  @media (hover: none) and (pointer: coarse) {
    .contact-card,
    .copy-btn,
    .submit-btn {
      min-height: 44px;
    }
    
    .copy-btn {
      min-width: 44px;
    }
    
    .contact-card:hover {
      transform: none;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }
    
    .copy-btn:hover {
      transform: none;
      background: rgba(183, 186, 197, 0.2);
    }
    
    .submit-btn:hover {
      transform: none;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    
    .submit-btn:hover .btn-icon {
      transform: none;
    }
  }
  
  /* Landscape orientation for small screens */
  @media (orientation: landscape) and (max-height: 500px) {
    .contact-section {
      padding: 1.5rem 1rem;
    }
    
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    
    .contact-container {
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }
    
    .contact-cards {
      order: 2;
      grid-template-columns: 1fr;
      gap: 1rem;
    }
    
    .contact-form-container {
      order: 1;
      padding: 1rem;
    }
    
    .contact-form {
      gap: 1rem;
    }
    
    .form-header h3 {
      font-size: 1.2rem;
      margin-bottom: 0.3rem;
    }
    
    .form-header p {
      font-size: 0.8rem;
    }
    
    .signature {
      margin-top: 1rem;
    }
  }
  
  /* High density displays */
  @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
    .copy-btn svg,
    .btn-icon {
      transform: scale(1.2);
    }
  }
</style> 