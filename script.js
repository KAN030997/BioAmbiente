/* ============================================
MENÚ MÓVIL
============================================ */
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = navToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-xmark');
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = navToggle.querySelector('i');
      icon.classList.add('fa-bars');
      icon.classList.remove('fa-xmark');
    });
  });
}

/* ============================================
HEADER CON SOMBRA AL SCROLL
============================================ */
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

/* ============================================
NAVEGACIÓN ACTIVA SEGÚN SECCIÓN VISIBLE
============================================ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').slice(1) === current) {
      link.classList.add('active');
    }
  });
});

/* ============================================
ANIMACIONES AL HACER SCROLL
============================================ */
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

/* ============================================
CARRUSEL DE GALERÍA DE PROYECTOS
============================================ */
const projectGallery = document.querySelector('.project-gallery');

if (projectGallery) {
  const galleryTrack = projectGallery.querySelector('.project-gallery__track');
  const gallerySlides = [...projectGallery.querySelectorAll('.project-gallery__item')];
  const galleryDots = [...projectGallery.querySelectorAll('.project-gallery__dot')];
  const galleryCount = projectGallery.querySelector('.project-gallery__count');
  let currentGallerySlide = 0;

  const showGallerySlide = (index) => {
    currentGallerySlide = (index + gallerySlides.length) % gallerySlides.length;
    galleryTrack.style.transform = `translateX(-${currentGallerySlide * 100}%)`;

    gallerySlides.forEach((slide, slideIndex) => {
      slide.setAttribute('aria-hidden', String(slideIndex !== currentGallerySlide));
    });

    galleryDots.forEach((dot, dotIndex) => {
      const isCurrent = dotIndex === currentGallerySlide;
      dot.classList.toggle('is-active', isCurrent);
      if (isCurrent) {
        dot.setAttribute('aria-current', 'true');
      } else {
        dot.removeAttribute('aria-current');
      }
    });

    galleryCount.textContent = `${currentGallerySlide + 1} / ${gallerySlides.length}`;
  };

  projectGallery.querySelector('.project-gallery__arrow--prev').addEventListener('click', () => {
    showGallerySlide(currentGallerySlide - 1);
  });

  projectGallery.querySelector('.project-gallery__arrow--next').addEventListener('click', () => {
    showGallerySlide(currentGallerySlide + 1);
  });

  galleryDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      showGallerySlide(Number(dot.dataset.slideTo));
    });
  });

  projectGallery.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showGallerySlide(currentGallerySlide - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      showGallerySlide(currentGallerySlide + 1);
    }
  });

  const galleryViewport = projectGallery.querySelector('.project-gallery__viewport');
  let pointerStartX = null;

  galleryViewport.addEventListener('pointerdown', (event) => {
    pointerStartX = event.clientX;
  });

  galleryViewport.addEventListener('pointerup', (event) => {
    if (pointerStartX === null) return;
    const swipeDistance = event.clientX - pointerStartX;
    if (Math.abs(swipeDistance) > 50) {
      showGallerySlide(currentGallerySlide + (swipeDistance < 0 ? 1 : -1));
    }
    pointerStartX = null;
  });

  galleryViewport.addEventListener('pointercancel', () => {
    pointerStartX = null;
  });

  showGallerySlide(0);
}

/* ============================================
MANEJO DEL FORMULARIO DE CONTACTO (FormSubmit.co)
============================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita la recarga de la página
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Validación básica
    if (!data.nombre || !data.email || !data.mensaje) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }
    
    // Cambiar texto del botón para indicar carga
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerText;
    submitButton.innerText = 'Enviando...';
    submitButton.disabled = true;

    // Envío a FormSubmit.co mediante AJAX
    fetch(contactForm.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        alert('¡Gracias por contactarnos! Te responderemos pronto.');
        contactForm.reset();
      } else {
        alert('Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
      }
    })
    .catch(error => {
      console.error('Error de envío:', error);
      alert('Hubo un error de conexión. Por favor, inténtalo de nuevo.');
    })
    .finally(() => {
      // Restaurar botón
      submitButton.innerText = originalButtonText;
      submitButton.disabled = false;
    });
  });
}

/* ============================================
SMOOTH SCROLL PARA ENLACES INTERNOS
============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

/* ============================================
MENSAJE DE CONSOLA
============================================ */
console.log('%c BIOAMBIENTE NICARAGUA ', 'background: #2D5016; color: #fff; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('Sitio web cargado correctamente 🌿');