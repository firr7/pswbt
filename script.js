(() => {
  const heroMedia = document.getElementById("hero-media");
  const form = document.querySelector("form");
  const feedback = document.getElementById("form-feedback");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (heroMedia) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
    const getScrollProgress = () => {
      if (window.innerWidth < 768) return 0;
      return clamp(window.scrollY / 320, 0, 1);
    };

    const applyHeroState = (progress) => {
      if (window.innerWidth < 768) {
        heroMedia.style.removeProperty("width");
        heroMedia.style.removeProperty("height");
        heroMedia.style.removeProperty("transform");
        return;
      }

      const width = 360 + 180 * progress;
      const height = 430 + 90 * progress;
      const rotateY = -12 + 12 * progress;
      const rotateX = 5 - 5 * progress;
      const scale = 0.92 + 0.08 * progress;

      heroMedia.style.width = `min(100%, ${width.toFixed(2)}px)`;
      heroMedia.style.height = `${height.toFixed(2)}px`;
      heroMedia.style.transform = `rotateY(${rotateY.toFixed(
        2
      )}deg) rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(4)})`;
    };

    let targetProgress = getScrollProgress();
    let currentProgress = targetProgress;
    let rafId = null;

    const animateHero = () => {
      currentProgress += (targetProgress - currentProgress) * 0.12;

      if (Math.abs(targetProgress - currentProgress) < 0.001) {
        currentProgress = targetProgress;
      }

      applyHeroState(currentProgress);

      if (currentProgress !== targetProgress) {
        rafId = window.requestAnimationFrame(animateHero);
      } else {
        rafId = null;
      }
    };

    const updateHero = () => {
      targetProgress = getScrollProgress();

      if (prefersReducedMotion) {
        currentProgress = targetProgress;
        applyHeroState(currentProgress);
        return;
      }

      if (!rafId) {
        rafId = window.requestAnimationFrame(animateHero);
      }
    };

    window.addEventListener("scroll", updateHero, { passive: true });
    window.addEventListener("resize", updateHero, { passive: true });
    updateHero();
  }

  if (form && feedback) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const service = String(data.get("service") || "").trim();

      if (!name || !email || !service) {
        feedback.textContent = "Compila i campi obbligatori per procedere.";
        feedback.className = "text-sm text-rose-600";
        return;
      }

      feedback.textContent = "Grazie! Richiesta ricevuta. Ti contatteremo entro 24 ore.";
      feedback.className = "text-sm text-emerald-700";
      form.reset();
    });
  }

  const tiltedGrid = document.querySelector("[data-tilted-grid]");

  if (tiltedGrid) {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const updateTiltedGrid = () => {
      if (prefersReducedMotion || window.innerWidth < 768) {
        tiltedGrid.style.setProperty("--grid-progress", "0.5");
        return;
      }

      const rect = tiltedGrid.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = clamp(
        (viewportHeight - rect.top) / (viewportHeight + rect.height),
        0,
        1
      );

      tiltedGrid.style.setProperty("--grid-progress", progress.toFixed(4));
    };

    window.addEventListener("scroll", updateTiltedGrid, { passive: true });
    window.addEventListener("resize", updateTiltedGrid, { passive: true });
    updateTiltedGrid();
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }

  if (window.AOS) {
    window.AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 40,
    });
  }

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("service-worker.js").catch(() => {
        /* no-op */
      });
    });
  }
})();
