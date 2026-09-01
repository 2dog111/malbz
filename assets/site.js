(() => {
  const dataLayer = window.dataLayer = window.dataLayer || [];

  const track = (eventName, source) => {
    const offer = source.closest("[data-offer-id]") || source;
    dataLayer.push({
      event: eventName,
      offer_id: offer.dataset.offerId || null,
      category: offer.dataset.category || null,
      price: offer.dataset.price || null,
      page_path: window.location.pathname
    });
  };

  document.querySelectorAll("[data-event]").forEach((element) => {
    element.addEventListener("click", () => track(element.dataset.event, element));
  });

  const viewed = new Set();
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.offerId;
        if (entry.isIntersecting && id && !viewed.has(id)) {
          viewed.add(id);
          track("offer_view", entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    document.querySelectorAll("[data-offer-id]:not([data-offer-id='supplier'])").forEach((offer) => observer.observe(offer));
  }

  const openTelegram = (event) => {
    const link = event.currentTarget;
    const message = link.dataset.message;
    if (!message) return;

    event.preventDefault();
    const encoded = encodeURIComponent(message);
    const webUrl = `https://t.me/am7am?text=${encoded}`;
    const nativeUrl = `tg://resolve?domain=am7am&text=${encoded}`;
    let cancelled = false;

    link.href = webUrl;
    let timer;
    const cancelFallback = () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
    const onVisibility = () => {
      if (document.hidden) cancelFallback();
    };
    window.addEventListener("blur", cancelFallback, { once: true });
    document.addEventListener("visibilitychange", onVisibility, { once: true });

    timer = window.setTimeout(() => {
      if (!cancelled) window.location.assign(webUrl);
    }, 700);

    window.location.href = nativeUrl;
  };

  document.querySelectorAll(".js-telegram").forEach((link) => {
    const message = link.dataset.message;
    if (message) link.href = `https://t.me/am7am?text=${encodeURIComponent(message)}`;
    link.addEventListener("click", openTelegram);
  });

  const filters = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll(".offer-grid [data-category]")];
  const result = document.querySelector(".filter-result");
  const empty = document.querySelector(".empty-state");

  const applyFilter = (filter) => {
    let visibleCount = 0;
    filters.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    cards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const visible = filter === "all" || categories.includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (result) result.textContent = `Показано ${visibleCount} ${visibleCount === 1 ? "предложение" : "предложений"}`;
    if (empty) empty.hidden = visibleCount !== 0;
  };

  filters.forEach((button) => button.addEventListener("click", () => applyFilter(button.dataset.filter)));
  document.querySelector("[data-filter-reset]")?.addEventListener("click", () => applyFilter("all"));

  window.malbzTrackCheckoutStart = (offerId, category, price) => {
    dataLayer.push({ event: "checkout_start", offer_id: offerId, category, price, page_path: window.location.pathname });
  };
})();
