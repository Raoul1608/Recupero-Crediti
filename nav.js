/* ══════════════════════════════════════
   CREDITFORCE ITALIA — NAVIGATION & LOGIC
══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  /* ── Mobile menu toggle ── */
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconOpen = document.getElementById('icon-open');
  const iconClose = document.getElementById('icon-close');

  menuBtn.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    iconOpen.classList.toggle('hidden', isOpen);
    iconClose.classList.toggle('hidden', !isOpen);
  });

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      iconOpen.classList.remove('hidden');
      iconClose.classList.add('hidden');
    });
  });

  /* ── Scroll reveal animations ── */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ── Active nav link highlight on scroll ── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          link.style.color = href === '#' + id ? '#f1f5f9' : '';
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(s => navObserver.observe(s));

  /* ── Toast notifications ── */
  window.showToast = function (title, msg, type = 'success') {
    const toast = document.getElementById('toast');
    const toastTitle = document.getElementById('toast-title');
    const toastMsg = document.getElementById('toast-msg');
    const toastIcon = document.getElementById('toast-icon');

    toastTitle.textContent = title;
    toastMsg.textContent = msg;

    if (type === 'success') {
      toastIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#34d399" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`;
    } else {
      toastIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="#f87171" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`;
    }

    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
    toast.style.pointerEvents = 'auto';

    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(hideToast, 5500);
  };

  window.hideToast = function () {
    const toast = document.getElementById('toast');
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.pointerEvents = 'none';
  };

  /* ── Contact form validation & submission ── */
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('submit-btn');

  function validateField(input) {
    const parent = input.parentElement;
    const errorEl = parent.querySelector('.field-error');
    let valid = true;

    if (input.required && !input.value.trim()) {
      valid = false;
    }
    if (input.type === 'email' && input.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(input.value.trim())) valid = false;
    }
    if (input.tagName === 'SELECT' && input.required && !input.value) {
      valid = false;
    }

    if (errorEl) {
      errorEl.classList.toggle('hidden', valid);
    }
    input.style.borderColor = valid ? '' : 'rgba(220,38,38,0.7)';
    return valid;
  }

  ['name', 'email', 'phone', 'amount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', () => validateField(el));
      el.addEventListener('input', () => validateField(el));
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fields = ['name', 'email', 'phone', 'amount'];
      let allValid = true;

      fields.forEach(id => {
        const el = document.getElementById(id);
        if (!validateField(el)) allValid = false;
      });

      const privacy = document.getElementById('privacy');
      if (!privacy.checked) {
        showToast('Consenso richiesto', 'Accetta la Privacy Policy per continuare.', 'error');
        return;
      }

      if (!allValid) {
        showToast('Dati incompleti', 'Verifica i campi evidenziati e riprova.', 'error');
        return;
      }

      // Simulate submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="spinner" fill="none" viewBox="0 0 24 24">
          <circle style="opacity:0.25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path style="opacity:0.75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        Invio in corso…
      `;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg class="icon-white-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
          </svg>
          Invia Richiesta di Analisi Gratuita
        `;
        form.reset();
        showToast(
          'Richiesta inviata!',
          'Ti ricontatteremo entro 24 ore lavorative. Controlla la tua email.',
          'success'
        );
      }, 1800);
    });
  }

  /* ── Newsletter signup ── */
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = e.target.querySelector('input');
      if (input.value) {
        input.value = '';
        showToast('Iscrizione completata!', 'Riceverai aggiornamenti normativi e novità del settore.', 'success');
      }
    });
  }

});
