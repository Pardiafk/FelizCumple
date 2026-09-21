/**
 * script.js — Lógica interactiva del sitio de cumpleaños
 * Sprint 1: Reproductor de música + Apagado de vela + Confeti + Desbloqueo
 *
 * Notas importantes:
 * - El autoplay funciona en desktop. En móvil, los navegadores (Chrome/Safari)
 *   bloquean el audio hasta que el usuario toca la pantalla.
 * - El volumen se establece en 0.35 (bajo y agradable).
 */

'use strict';

/* ============================================================
   REFERENCIAS AL DOM
   ============================================================ */
const musicBtn       = document.getElementById('music-btn');
const vinylIcon      = document.getElementById('vinyl-icon');
const bgAudio        = document.getElementById('bg-audio');

const cakeWrapper    = document.getElementById('cake-wrapper');
const flameContainer = document.getElementById('flame-container');
const smokeContainer = document.getElementById('smoke-container');

const ctaText        = document.getElementById('cta-text');
const scrollHint     = document.getElementById('scroll-hint');
const lockedContent  = document.getElementById('locked-content');

/* ============================================================
   ESTADO DE LA APLICACIÓN
   ============================================================ */
const appState = {
  isPlaying:   false,
  candleBlown: false,
};

/* ============================================================
   REPRODUCTOR DE MÚSICA
   ============================================================ */

function playMusic() {
  bgAudio.volume = 0.35;

  const playPromise = bgAudio.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        appState.isPlaying = true;
        musicBtn.classList.add('playing');
        musicBtn.setAttribute('aria-pressed', 'true');
        musicBtn.title = 'Pausar música';
      })
      .catch((error) => {
        console.info('Autoplay bloqueado (normal en móvil):', error.message);
        musicBtn.title = 'Toca para activar música';
      });
  }
}

function pauseMusic() {
  bgAudio.pause();
  appState.isPlaying = false;
  musicBtn.classList.remove('playing');
  musicBtn.setAttribute('aria-pressed', 'false');
  musicBtn.title = 'Reproducir música';
}

function toggleMusic() {
  if (appState.isPlaying) {
    pauseMusic();
  } else {
    playMusic();
  }
}

musicBtn.addEventListener('click', toggleMusic);

/* ============================================================
   CONFETI — Mucho más espectacular (Tarea 1.5)
   6 disparos en secuencia para llenar toda la pantalla
   ============================================================ */

/** Paleta del proyecto */
const CONFETTI_COLORS = ['#e8a0b8', '#f5c5a3', '#a8d8c0', '#c9b3e8', '#aac8e8', '#f9e4a0', '#ffffff'];

function launchMegaConfetti() {
  // --- Disparo 1: lluvia desde arriba, izquierda ---
  confetti({
    particleCount: 80,
    angle: 55,
    spread: 80,
    startVelocity: 45,
    origin: { x: 0, y: 0.3 },
    colors: CONFETTI_COLORS,
    ticks: 200,
  });

  // --- Disparo 2: lluvia desde arriba, derecha ---
  confetti({
    particleCount: 80,
    angle: 125,
    spread: 80,
    startVelocity: 45,
    origin: { x: 1, y: 0.3 },
    colors: CONFETTI_COLORS,
    ticks: 200,
  });

  // --- Disparo 3: explosión central (pastel) ---
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 35,
      origin: { x: 0.5, y: 0.6 },
      colors: CONFETTI_COLORS,
      ticks: 250,
    });
  }, 200);

  // --- Disparo 4: lateral izquierdo ---
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 70,
      spread: 60,
      startVelocity: 40,
      origin: { x: 0, y: 0.5 },
      colors: CONFETTI_COLORS,
      ticks: 180,
    });
  }, 400);

  // --- Disparo 5: lateral derecho ---
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 110,
      spread: 60,
      startVelocity: 40,
      origin: { x: 1, y: 0.5 },
      colors: CONFETTI_COLORS,
      ticks: 180,
    });
  }, 400);

  // --- Disparo 6: lluvia final suave desde arriba para llenar toda la pantalla ---
  setTimeout(() => {
    confetti({
      particleCount: 100,
      spread: 120,
      startVelocity: 20,
      gravity: 0.5,       // cae despacio
      origin: { x: 0.5, y: 0 },
      colors: CONFETTI_COLORS,
      ticks: 350,
      drift: 0.5,
    });
  }, 700);
}

/* ============================================================
   ANIMACIÓN DE EXTINCIÓN DE VELA (Tarea 1.5)
   ============================================================ */

function extinguishFlame() {
  flameContainer.classList.add('flame-out');

  setTimeout(() => {
    smokeContainer.style.display = 'block';
  }, 100);
}

function unlockContent() {
  lockedContent.classList.add('unlocked');
  lockedContent.setAttribute('aria-hidden', 'false');
}

/* ============================================================
   MANEJADOR PRINCIPAL — APAGADO DE VELA (Tarea 1.5)
   ============================================================ */

function handleCandleBlow() {
  if (appState.candleBlown) return;

  // Paso 1: marcar como usado y quitar listeners
  appState.candleBlown = true;
  cakeWrapper.removeEventListener('click',      handleCandleBlow);
  cakeWrapper.removeEventListener('touchstart', handleCandleBlow);
  cakeWrapper.removeEventListener('keydown',    handleCandleKeydown);

  // Paso 2: arrancar música si no suena
  if (!appState.isPlaying) {
    playMusic();
  }

  // Paso 3: animación de extinción
  extinguishFlame();

  // Paso 4: confeti masivo a los 250ms
  setTimeout(launchMegaConfetti, 250);

  // Paso 5: ocultar CTA, mostrar scroll hint
  ctaText.style.transition = 'opacity 0.4s ease';
  ctaText.style.opacity    = '0';
  setTimeout(() => {
    ctaText.style.display  = 'none';
    scrollHint.style.display = 'block';
    scrollHint.setAttribute('aria-hidden', 'false');
  }, 450);

  // Paso 6: desbloquear contenido inferior
  setTimeout(unlockContent, 600);

  // Paso 7 (Sprint 2): stagger reveal de la galería
  // Empieza cuando el contenido ya está visible (800ms)
  setTimeout(revealGallery, 800);

  // Paso 8: auto-scroll suave a las secciones (1.5s)
  setTimeout(() => {
    lockedContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 1500);
}

function handleCandleKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    handleCandleBlow();
  }
}

cakeWrapper.addEventListener('click',      handleCandleBlow);
cakeWrapper.addEventListener('touchstart', handleCandleBlow, { passive: true });
cakeWrapper.addEventListener('keydown',    handleCandleKeydown);

/* ============================================================
   INICIALIZACIÓN + AUTOPLAY POR PRIMERA INTERACCIÓN
   ============================================================ */

/**
 * Los navegadores modernos (Chrome, Safari, Firefox) prohíben
 * reproducir audio sin una interacción previa del usuario.
 * La solución es escuchar el PRIMER evento que el usuario genere
 * (click, toque, scroll o tecla) y entonces arrancar la música.
 * Esto imita el efecto de "abre y suena sola" de forma compatible.
 */
function setupAutoplayOnFirstInteraction() {
  const EVENTS = ['click', 'touchstart', 'keydown', 'scroll'];
  let musicStarted = false;

  function onFirstInteraction() {
    if (musicStarted) return;
    musicStarted = true;

    // Quitar todos los listeners de primera interacción
    EVENTS.forEach(ev => document.removeEventListener(ev, onFirstInteraction, { capture: true }));

    // Arrancar música si no estaba sonando ya (el usuario podría haberla
    // activado manualmente antes de que llegara el primer evento)
    if (!appState.isPlaying) {
      // Pequeño delay para que se sienta natural al entrar a la página
      setTimeout(playMusic, 300);
    }
  }

  // Escuchar en fase de captura (capture: true) para recibir el evento
  // incluso si otros elementos lo detienen con stopPropagation
  EVENTS.forEach(ev => document.addEventListener(ev, onFirstInteraction, { capture: true, passive: true }));
}

function init() {
  bgAudio.volume = 0.35;
  bgAudio.pause();
  bgAudio.currentTime = 0;

  musicBtn.setAttribute('aria-pressed', 'false');
  musicBtn.title = 'Reproducir música';
  lockedContent.setAttribute('aria-hidden', 'true');

  // Activar autoplay en la primera interacción del usuario
  setupAutoplayOnFirstInteraction();

  console.info('🎂 Sitio de cumpleaños de Valeria — listo.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ════════════════════════════════════════════════════════════
   SPRINT 2 — STAGGER REVEAL (entrada progresiva de la galería)
   ════════════════════════════════════════════════════════════ */

/**
 * Añade la clase .revealed a cada tarjeta de foto con un delay
 * incremental de 120ms entre cada una (usando el índice del array).
 * Las tarjetas de Yayo van al final de la secuencia.
 */
function revealGallery() {
  const entries = document.querySelectorAll('.photo-entry, .yayo-frame');
  entries.forEach((el, index) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, index * 120);
  });
}

/* ════════════════════════════════════════════════════════════
   SPRINT 2 — LIGHTBOX MODAL
   ════════════════════════════════════════════════════════════ */

const lightbox        = document.getElementById('lightbox');
const lightboxImg     = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose   = document.getElementById('lightbox-close');

/**
 * Abre el lightbox mostrando la imagen ampliada.
 * Si la imagen es de Valeria, muestra su caption arriba.
 * Si es de Yayo, solo muestra la imagen limpia.
 *
 * @param {string} src     - URL de la imagen a mostrar
 * @param {string} caption - Subtítulo (vacío para fotos de Yayo)
 */
function openLightbox(src, caption) {
  lightboxImg.src             = src;
  lightboxCaption.textContent = caption || '';
  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  // Bloquear scroll del body mientras está abierto
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra el lightbox con transición suave.
 * Limpia la imagen después de que la transición termina.
 */
function closeLightbox() {
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  // Limpiar src después de la animación de cierre (300ms)
  setTimeout(() => {
    lightboxImg.src = '';
    lightboxCaption.textContent = '';
  }, 300);
}

// Botón ✕ cierra el lightbox
lightboxClose.addEventListener('click', closeLightbox);

// Tocar fuera de la imagen (sobre el fondo oscuro) también cierra
lightbox.addEventListener('click', (event) => {
  // Solo cerrar si el clic fue en el fondo, no en la imagen o botón
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Tecla Escape cierra el lightbox
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

/**
 * Event delegation: escucha clicks en todas las imágenes .zoomable
 * tanto de Valeria como de Yayo.
 * Usa delegación en el document para no preocuparse por si las
 * imágenes se añaden dinámicamente.
 */
document.addEventListener('click', (event) => {
  const target = event.target;
  if (!target.classList.contains('zoomable')) return;

  // Buscar si la imagen tiene un caption (solo fotos de Valeria)
  const captionEl = target.closest('.photo-entry')?.querySelector('.photo-caption');
  const caption   = captionEl ? captionEl.textContent.trim() : '';

  openLightbox(target.src, caption);
});

// Soporte táctil: feedback de scale en frames al presionar
document.addEventListener('touchstart', (event) => {
  const frame = event.target.closest('.photo-frame, .yayo-frame');
  if (frame) {
    frame.style.transform = 'scale(0.98)';
    // Restaurar después del toque
    setTimeout(() => { frame.style.transform = ''; }, 120);
  }
}, { passive: true });

/* ════════════════════════════════════════════════════════════
   SPRINT 2 — LÓGICA DEL CARRUSEL (Actualización de Dots y Autoplay)
   ════════════════════════════════════════════════════════════ */
const carouselTrack = document.getElementById('valeria-carousel');
const dots = document.querySelectorAll('.carousel-dots .dot');

if (carouselTrack && dots.length > 0) {
  let autoPlayInterval;

  const startAutoPlay = () => {
    // Evitar múltiples intervalos
    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
      const itemWidth = carouselTrack.clientWidth;
      const maxScroll = carouselTrack.scrollWidth - itemWidth;
      let targetScroll = carouselTrack.scrollLeft + itemWidth;
      
      // Si llegamos al final, volver al principio
      if (targetScroll >= maxScroll + 10) {
        targetScroll = 0;
      }
      
      carouselTrack.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }, 3500); // Avanza cada 3.5 segundos
  };

  const resetAutoPlay = () => {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  };

  // Actualizar dot activo al hacer scroll
  carouselTrack.addEventListener('scroll', () => {
    const scrollPosition = carouselTrack.scrollLeft;
    const itemWidth = carouselTrack.clientWidth;
    const currentIndex = Math.round(scrollPosition / itemWidth);

    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  });

  // Permitir hacer click en los dots para ir a una foto
  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      resetAutoPlay(); // Reiniciar el timer si el usuario interactúa
      const targetIndex = parseInt(e.target.getAttribute('data-index'));
      const itemWidth = carouselTrack.clientWidth;
      carouselTrack.scrollTo({
        left: targetIndex * itemWidth,
        behavior: 'smooth'
      });
    });
  });

  // Pausar/reiniciar autoplay si el usuario desliza con el dedo
  carouselTrack.addEventListener('touchstart', () => clearInterval(autoPlayInterval), {passive: true});
  carouselTrack.addEventListener('touchend', resetAutoPlay, {passive: true});

  // Iniciar autoplay
  startAutoPlay();
}

/* ════════════════════════════════════════════════════════════
   SPRINT 3 — LÓGICA DEL CARRUSEL DE CARTAS EXTENSAS
   ════════════════════════════════════════════════════════════ */
const lettersSlider = document.getElementById('letters-slider');
const lettersDots = document.querySelectorAll('.letters-dots .letter-dot');
const btnPrev = document.getElementById('letter-prev');
const btnNext = document.getElementById('letter-next');

if (lettersSlider) {
  const updateLettersState = () => {
    const scrollPosition = lettersSlider.scrollLeft;
    const itemWidth = lettersSlider.clientWidth;
    const currentIndex = Math.round(scrollPosition / itemWidth);

    // Actualizar dots
    lettersDots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  };

  // Escuchar el scroll nativo
  lettersSlider.addEventListener('scroll', updateLettersState);

  // Botón Siguiente
  if (btnNext) {
    btnNext.addEventListener('click', () => {
      const itemWidth = lettersSlider.clientWidth;
      lettersSlider.scrollBy({ left: itemWidth, behavior: 'smooth' });
    });
  }

  // Botón Anterior
  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      const itemWidth = lettersSlider.clientWidth;
      lettersSlider.scrollBy({ left: -itemWidth, behavior: 'smooth' });
    });
  }

  // Hacer click en los dots
  lettersDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const itemWidth = lettersSlider.clientWidth;
      lettersSlider.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
      });
    });
  });
}

/* ════════════════════════════════════════════════════════════
   SPRINT 4 — LÓGICA DE DESCARGA DE CUPONES
   ════════════════════════════════════════════════════════════ */
function downloadCoupon(couponId, filename) {
  const couponElement = document.getElementById(couponId);
  const btn = event.target;
  const originalText = btn.innerText;

  // Cambiar estado visual del botón
  btn.innerText = "Generando imagen... ⏳";
  btn.disabled = true;

  // Verificar si la librería html2canvas está cargada
  if (typeof html2canvas === 'undefined') {
    alert("Hubo un error cargando el generador de imágenes. Por favor, recarga la página e intenta de nuevo.");
    btn.innerText = originalText;
    btn.disabled = false;
    return;
  }

  // Generar el canvas con alta resolución
  html2canvas(couponElement, {
    scale: 3, // Alta definición para pantallas móviles (Retina/OLED)
    backgroundColor: null,
    useCORS: true
  }).then(canvas => {
    // Crear enlace falso para forzar descarga
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click(); // Iniciar descarga

    // Éxito
    btn.innerText = "¡Guardado con éxito! ✓";
    setTimeout(() => {
      btn.innerText = originalText;
      btn.disabled = false;
    }, 2500);
  }).catch(err => {
    console.error("Error al generar cupón:", err);
    btn.innerText = "Error al guardar";
    btn.disabled = false;
    setTimeout(() => {
      btn.innerText = originalText;
      btn.disabled = false;
    }, 3000);
  });
}
