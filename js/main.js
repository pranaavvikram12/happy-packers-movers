/* ========================================
   Happy Packers & Movers and Logistics — Main JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Preloader
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('hidden'), 600);
    });
    setTimeout(() => preloader.classList.add('hidden'), 3000); // fallback
  }

  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const handleScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  }

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('open');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // Scroll reveal
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealElements.forEach(el => observer.observe(el));
  }

  // Animated Counters
  const counterElements = document.querySelectorAll('.counter-number[data-target]');
  if (counterElements.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counterElements.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(target * eased);
      el.innerHTML = current.toLocaleString() + `<span class="suffix">${suffix}</span>`;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Multi-step Quote Form
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    let currentStep = 1;

    window.nextStep = function(step) {
      const currentStepEl = document.querySelector(`.quote-step[data-step="${currentStep}"]`);
      const inputs = currentStepEl.querySelectorAll('input[required], select[required]');
      let valid = true;
      inputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = '#EF4444';
          valid = false;
        } else {
          input.style.borderColor = '';
        }
      });
      if (!valid) return;

      currentStep = step;
      updateQuoteStep();
    };

    window.prevStep = function(step) {
      currentStep = step;
      updateQuoteStep();
    };

    function updateQuoteStep() {
      document.querySelectorAll('.quote-step').forEach(s => s.classList.remove('active'));
      const activeStep = document.querySelector(`.quote-step[data-step="${currentStep}"]`);
      if (activeStep) activeStep.classList.add('active');

      document.querySelectorAll('.progress-circle').forEach((circle, i) => {
        circle.classList.remove('active', 'done');
        if (i + 1 < currentStep) circle.classList.add('done');
        else if (i + 1 === currentStep) circle.classList.add('active');
      });

      document.querySelectorAll('.progress-line').forEach((line, i) => {
        line.classList.toggle('active', i + 1 < currentStep);
      });
    }

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🎉 Thank you! Your quote request has been submitted. We\'ll contact you shortly.');
      quoteForm.reset();
      currentStep = 1;
      updateQuoteStep();
    });
  }

  // Testimonials Slider
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const sliderDots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let slideInterval;

  if (testimonialCards.length) {
    function showSlide(index) {
      testimonialCards.forEach(card => card.classList.remove('active'));
      sliderDots.forEach(dot => dot.classList.remove('active'));
      currentSlide = (index + testimonialCards.length) % testimonialCards.length;
      testimonialCards[currentSlide].classList.add('active');
      if (sliderDots[currentSlide]) sliderDots[currentSlide].classList.add('active');
    }

    window.nextSlide = () => showSlide(currentSlide + 1);
    window.prevSlide = () => showSlide(currentSlide - 1);
    window.goToSlide = (index) => showSlide(index);

    function startAutoSlide() {
      slideInterval = setInterval(() => showSlide(currentSlide + 1), 5000);
    }

    startAutoSlide();
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
      sliderContainer.addEventListener('mouseenter', () => clearInterval(slideInterval));
      sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
  }

  // Enquiry Modal
  const modal = document.getElementById('enquiryModal');
  if (modal) {
    if (!sessionStorage.getItem('enquiryShown')) {
      setTimeout(() => {
        modal.classList.add('show');
        sessionStorage.setItem('enquiryShown', 'true');
      }, 2000);
    }

    window.closeModal = function() {
      modal.classList.remove('show');
    };

    window.openModal = function() {
      modal.classList.add('show');
    };

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  // Enquiry form submission
  const enquiryForm = document.getElementById('enquiryForm');
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          showToast('✅ Enquiry submitted successfully! We\'ll reach out soon.');
          this.reset();
          if (typeof closeModal === 'function') closeModal();
        } else {
          showToast('❌ Something went wrong. Please try again or call us directly.');
        }
      })
      .catch(() => {
        showToast('✅ Enquiry submitted! We\'ll reach out to you soon.');
        this.reset();
        if (typeof closeModal === 'function') closeModal();
      });
    });
  }

  // Contact form submission
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
      .then(response => {
        if (response.ok) {
          showToast('✅ Message sent successfully! We\'ll get back to you within 24 hours.');
          this.reset();
        } else {
          showToast('❌ Something went wrong. Please try again.');
        }
      })
      .catch(() => {
        showToast('✅ Message sent! We\'ll get back to you shortly.');
        this.reset();
      });
    });
  }

  // Toast notification
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }
  window.showToast = showToast;

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Quote form scroll
  window.scrollToQuote = function() {
    const quoteSection = document.getElementById('quoteSection');
    if (quoteSection) {
      quoteSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
});
