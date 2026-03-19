// Modern SaaS Landing - Interactive Features
document.addEventListener('DOMContentLoaded', function() {
  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
      navbar.style.background = 'rgba(0, 0, 0, 0.2)';
      navbar.style.backdropFilter = 'blur(30px)';
    } else {
      navbar.style.background = 'rgba(0, 0, 0, 0.1)';
      navbar.style.backdropFilter = 'blur(20px)';
    }
  });

  // Smooth scrolling
  document.querySelectorAll('a[href^=\"#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Hero floating animation
  const heroBg = document.querySelector('.hero-background::before');
  let mouseX = 0, mouseY = 0;
  
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;
    
    const hero = document.querySelector('.hero-background');
    if (hero) {
      hero.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    }
  });

  // Feature cards stagger animation
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = `${index * 0.1}s`;
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.feature-card').forEach(card => {
    observer.observe(card);
  });

  // Pricing card pulse
  setInterval(() => {
    const pricingCard = document.querySelector('.pricing-card.featured');
    if (pricingCard) {
      pricingCard.style.transform = 'scale(1.05)';
      setTimeout(() => {
        pricingCard.style.transform = 'scale(1.03)';
      }, 500);
    }
  }, 3000);

  // Stats counter animation (if you add stats section)
  function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const speed = 200;
      
      const inc = target / speed;
      if (count < target) {
        counter.innerText = Math.ceil(count + inc);
        setTimeout(animateCounters, 1);
      } else {
        counter.innerText = target;
      }
    });
  }

  // Parallax for sections
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    document.querySelectorAll('.feature-card').forEach((card, index) => {
      const speed = 0.3;
      card.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
});

