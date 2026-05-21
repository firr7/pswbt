(() => {
  const heroMedia = document.getElementById("hero-media");
  const form = document.querySelector("form");
  const feedback = document.getElementById("form-feedback");
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const toggleHeroExpand = () => {
    if (!heroMedia || window.innerWidth < 768) return;
    if (window.scrollY > 80) heroMedia.classList.add("is-expanded");
    else heroMedia.classList.remove("is-expanded");
  };

  window.addEventListener("scroll", toggleHeroExpand, { passive: true });
  toggleHeroExpand();

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
