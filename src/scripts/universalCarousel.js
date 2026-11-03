// src/scripts/universalCarousel.js

function initScrollCarousels() {
  const containers = document.querySelectorAll('.js-carousel-container');

  containers.forEach((container) => {
    const track = container.querySelector('.js-carousel-track');
    const btnPrev = container.querySelector('.js-carousel-prev');
    const btnNext = container.querySelector('.js-carousel-next');

    if (!track || !btnPrev || !btnNext) return;

    // Умная функция прокрутки с поддержкой постраничного или поштучного режима
    const scroll = (direction) => {
      const isSearchPage = window.location.pathname.includes('/search');

      let widthToScroll;

      if (isSearchPage) {
        // На странице поиска прокручиваем ровно на 1 карточку + отступ (gap)
        const card = track.querySelector('div');
        if (card) {
          const style = window.getComputedStyle(track);
          const gap = parseInt(style.gap) || 16;
          widthToScroll = card.offsetWidth + gap;
        } else {
          widthToScroll = 270; // запасной вариант
        }
      } else {
        // На остальных страницах — старое поведение (на всю видимую ширину)
        widthToScroll = track.offsetWidth;
      }

      track.scrollBy({
        left: direction === 'next' ? widthToScroll : -widthToScroll,
        behavior: 'smooth'
      });
    };

    btnNext.addEventListener('click', () => scroll('next'));
    btnPrev.addEventListener('click', () => scroll('prev'));
  });
}

function initFadeSliders() {
  const sliderContainers = document.querySelectorAll('.js-slider-container');

  sliderContainers.forEach((container) => {
    const slides = container.querySelectorAll('.js-slide-item');
    const btnPrev = container.querySelector('.js-btn-prev');
    const btnNext = container.querySelector('.js-btn-next');

    if (slides.length === 0 || !btnPrev || !btnNext) return;

    let currentSlide = 0;

    const showSlide = (index) => {
      slides.forEach((slide, i) => {
        if (i === index) {
          slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
          slide.classList.add('opacity-100', 'z-10');
        } else {
          slide.classList.remove('opacity-100', 'z-10');
          slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
        }
      });
    };

    btnNext.addEventListener('click', () => {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    });

    btnPrev.addEventListener('click', () => {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    });
  });
}

function initYoutubeShields() {
  const wrappers = document.querySelectorAll('.js-video-wrapper');
  
  wrappers.forEach(wrapper => {
    const shield = wrapper.querySelector('.js-video-shield');
    const iframe = wrapper.querySelector('.js-video-iframe');

    if (!shield || !iframe) return;

    wrapper.addEventListener('mouseenter', () => {
      shield.style.pointerEvents = 'none';
      iframe.style.pointerEvents = 'auto';
    });

    wrapper.addEventListener('mouseleave', () => {
      shield.style.pointerEvents = 'auto';
      iframe.style.pointerEvents = 'none';
      if (document.activeElement === iframe) window.focus();
    });
  });
}

function setupAllVisualElements() {
  initScrollCarousels();
  initFadeSliders();
  initYoutubeShields();
}

document.addEventListener('DOMContentLoaded', setupAllVisualElements);
document.addEventListener('astro:after-swap', setupAllVisualElements);
