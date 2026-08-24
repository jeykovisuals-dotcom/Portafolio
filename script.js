/* ==========================================================================
   PORTFOLIO INTERACTIVE LOGIC - PURE JAVASCRIPT (ES6)
   Author: Senior Frontend Developer & UI/UX Designer
   Description: Clean, modular, production-ready script for smooth scrolling,
                filtering, intersection observer scroll reveal, and toast notifications.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. DOM ELEMENT REFERENCES
     -------------------------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinksContainer = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav-link');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const emailText = document.getElementById('emailText');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');
  const contactForm = document.getElementById('contactForm');

  /* --------------------------------------------------------------------------
     2. MOBILE MENU DRAWER TOGGLE
     -------------------------------------------------------------------------- */
  if (mobileToggle && navLinksContainer) {
    mobileToggle.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navLinksContainer.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close mobile menu when clicking any nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. STICKY NAVBAR SCROLL & ACTIVE SECTION LINK HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    // Add shadow border to navbar when scrolled down
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      navbar.style.boxShadow = 'none';
    }

    // ScrollSpy active link updating
    const scrollPosition = window.scrollY + 200;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetNavLink) {
        if (scrollPosition > sectionTop && scrollPosition <= sectionTop + sectionHeight) {
          navLinks.forEach(link => link.classList.remove('active'));
          targetNavLink.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', handleScroll);

  /* --------------------------------------------------------------------------
     4. PORTFOLIO CATEGORY FILTER LOGIC
     -------------------------------------------------------------------------- */
  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all filter buttons
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        btn.classList.add('active');

        const selectedFilter = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute('data-category');

          if (selectedFilter === 'all' || cardCategory === selectedFilter) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0) scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px) scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. INTERSECTION OBSERVER FOR SCROLL ENTRANCE ANIMATIONS
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window && revealElements.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Once animated, stop observing this element
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver is not supported
    revealElements.forEach(el => el.classList.add('active'));
  }

  /* --------------------------------------------------------------------------
     6. TOAST NOTIFICATION UTILITY & COPY EMAIL TO CLIPBOARD
     -------------------------------------------------------------------------- */
  function showToast(message) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  if (copyEmailBtn && emailText) {
    copyEmailBtn.addEventListener('click', () => {
      const textToCopy = emailText.textContent.trim();
      navigator.clipboard.writeText(textToCopy)
        .then(() => {
          showToast('¡Correo copiado exitosamente al portapapeles!');
        })
        .catch(() => {
          // Fallback if clipboard API fails
          showToast('No se pudo copiar automáticamente.');
        });
    });
  }

  /* --------------------------------------------------------------------------
     7. CONTACT FORM HANDLING
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
      submitBtn.disabled = true;

      // Simulate asynchronous server response
      setTimeout(() => {
        showToast('¡Mensaje enviado con éxito! Te responderé pronto.');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    });
  }
});
