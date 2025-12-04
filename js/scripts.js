document.addEventListener("DOMContentLoaded", () => {
  const yearTarget = document.getElementById("year");
  if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    setupProjectParallax();
    setupHeroParallax();
    setupSectionTitleParallax();
  }

  setupResearchCarousel();
  setupNavToggle();
  setupBackToTop();

});

function setupProjectParallax() {
  const cards = document.querySelectorAll(".project-card");

  cards.forEach((card) => {
    const reset = () => {
      card.style.setProperty("--moveX", "0px");
      card.style.setProperty("--moveY", "0px");
      card.style.setProperty("--mascot-moveX", "0px");
      card.style.setProperty("--mascot-moveY", "0px");
    };

    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

      const moveX = relativeX * 12;
      const moveY = relativeY * 10;
      const mascotMoveX = relativeX * 18;
      const mascotMoveY = relativeY * 16;

      card.style.setProperty("--moveX", `${moveX}px`);
      card.style.setProperty("--moveY", `${moveY}px`);
      card.style.setProperty("--mascot-moveX", `${mascotMoveX}px`);
      card.style.setProperty("--mascot-moveY", `${mascotMoveY}px`);
    });

    card.addEventListener("pointerleave", reset);
    card.addEventListener("blur", reset);
  });
}

function setupNavToggle() {
  const topBars = document.querySelectorAll(".top-bar");
  if (!topBars.length) return;

  topBars.forEach((bar) => {
    const toggle = bar.querySelector(".nav-toggle");
    const nav = bar.querySelector(".primary-nav");
    if (!toggle || !nav) return;

    const closeNav = () => {
      nav.classList.remove("is-open");
      toggle.classList.remove("is-active");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeNav();
      }
    });
  });
}

function setupBackToTop() {
  const links = document.querySelectorAll(".footer-link");
  if (!links.length) return;

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const target = link.getAttribute("href");
      if (target === "#top") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

function setupHeroParallax() {
  const heroCanvas = document.querySelector(".hero-canvas");
  if (!heroCanvas) return;

  const reset = () => {
    heroCanvas.style.setProperty("--hero-moveX", "0px");
    heroCanvas.style.setProperty("--hero-moveY", "0px");
  };

  heroCanvas.addEventListener("pointermove", (event) => {
    const bounds = heroCanvas.getBoundingClientRect();
    const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
    const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

    const moveX = relativeX * 18;
    const moveY = relativeY * 14;

    heroCanvas.style.setProperty("--hero-moveX", `${moveX}px`);
    heroCanvas.style.setProperty("--hero-moveY", `${moveY}px`);
  });

  heroCanvas.addEventListener("pointerleave", reset);
}

function setupSectionTitleParallax() {
  const titles = document.querySelectorAll(".section-title");

  titles.forEach((title) => {
    const reset = () => {
      title.style.setProperty("--title-moveX", "0px");
      title.style.setProperty("--title-moveY", "0px");
    };

    title.addEventListener("pointermove", (event) => {
      const bounds = title.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;

      const moveX = relativeX * 14;
      const moveY = relativeY * 10;

      title.style.setProperty("--title-moveX", `${moveX}px`);
      title.style.setProperty("--title-moveY", `${moveY}px`);
    });

    title.addEventListener("pointerleave", reset);
    title.addEventListener("blur", reset);
  });
}

function setupResearchCarousel() {
  const containers = document.querySelectorAll(".project-slider");
  if (!containers.length) return;

  containers.forEach((container) => {
    const sliderWindow = container.querySelector(".slider-window");
    const track = container.querySelector(".slider-track");
    if (!track || !sliderWindow) return;

    const slides = track.querySelectorAll("figure");
    const prevBtn = container.querySelector(".slider-prev");
    const nextBtn = container.querySelector(".slider-next");
    const dotsWrapper = container.querySelector(".slider-dots");
    if (!slides.length || !prevBtn || !nextBtn || !dotsWrapper) return;

    dotsWrapper.innerHTML = "";
    slides.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
      dot.addEventListener("click", () => showSlide(index));
      dotsWrapper.appendChild(dot);
    });

    const dots = dotsWrapper.querySelectorAll("button");
    let currentIndex = 0;

    const showSlide = (index) => {
      currentIndex = Math.max(0, Math.min(index, slides.length - 1));
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === currentIndex));
      prevBtn.disabled = currentIndex === 0;
      nextBtn.disabled = currentIndex === slides.length - 1;
    };

    prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
    nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));

    let isDragging = false;
    let startX = 0;
    let dragOffset = 0;
    let activePointerId = null;

    const pointerDown = (event) => {
      isDragging = true;
      startX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
      activePointerId = event.pointerId ?? null;
      if (activePointerId !== null) {
        sliderWindow.setPointerCapture?.(activePointerId);
      }
    };

    const pointerMove = (event) => {
      if (!isDragging) return;
      const currentX = event.clientX ?? event.touches?.[0]?.clientX ?? 0;
      dragOffset = currentX - startX;
      const offsetPercent = (dragOffset / sliderWindow.offsetWidth) * 100;
      track.style.transform = `translateX(${-(currentIndex * 100) + offsetPercent}%)`;
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      const threshold = sliderWindow.offsetWidth * 0.2;
      if (Math.abs(dragOffset) > threshold) {
        if (dragOffset < 0) {
          showSlide(currentIndex + 1);
        } else {
          showSlide(currentIndex - 1);
        }
      } else {
        showSlide(currentIndex);
      }
      dragOffset = 0;
      if (activePointerId !== null) {
        sliderWindow.releasePointerCapture?.(activePointerId);
        activePointerId = null;
      }
    };

    sliderWindow.addEventListener("pointerdown", (event) => {
      pointerDown(event);
      event.preventDefault();
    });
    sliderWindow.addEventListener("pointermove", pointerMove);
    sliderWindow.addEventListener("pointerup", endDrag);
    sliderWindow.addEventListener("pointerleave", endDrag);
    sliderWindow.addEventListener("pointercancel", endDrag);

    showSlide(0);
  });
}
