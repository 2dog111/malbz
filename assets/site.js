(() => {
  "use strict";

  const dataLayer = window.dataLayer = window.dataLayer || [];
  const toast = document.querySelector(".copy-toast");
  let toastTimer;

  function eventPayload(source, overrides = {}) {
    const page = document.body;
    return {
      offer_id: source?.dataset.offerId || page.dataset.offerId || "",
      offer_title: source?.dataset.offerTitle || page.dataset.offerTitle || "",
      category: source?.dataset.category || page.dataset.category || "",
      price: source?.dataset.price || page.dataset.price || "",
      page_path: window.location.pathname,
      cta_location: source?.dataset.ctaLocation || "",
      ...overrides
    };
  }

  function track(eventName, source, overrides) {
    dataLayer.push({ event: eventName, ...eventPayload(source, overrides) });
  }

  function showToast(message) {
    if (!toast) return;
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("is-visible");
    toastTimer = window.setTimeout(() => {
      toast.classList.remove("is-visible");
      toast.hidden = true;
    }, 4000);
  }

  async function copyMessage(message) {
    const field = document.createElement("textarea");
    field.value = message;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.append(field);
    field.select();
    const copied = document.execCommand("copy");
    field.remove();
    if (copied) return;

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(message);
      return;
    }

    throw new Error("copy failed");
  }

  function openTelegramProfile() {
    const webUrl = "https://t.me/am7am";
    let fallbackTimer;

    const cancelFallback = () => {
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("blur", cancelFallback);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
    const onVisibilityChange = () => {
      if (document.hidden) cancelFallback();
    };

    window.addEventListener("blur", cancelFallback, { once: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    fallbackTimer = window.setTimeout(() => {
      cancelFallback();
      window.location.href = webUrl;
    }, 700);
    window.location.href = "tg://resolve?domain=am7am";
  }

  if (document.body.dataset.page === "home") {
    track("home_view", document.body, { cta_location: "page" });
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-event]");
    if (!target || target.classList.contains("js-telegram")) return;
    track(target.dataset.event, target);
  });

  document.querySelectorAll(".js-telegram").forEach((link) => {
    link.addEventListener("click", async (event) => {
      event.preventDefault();
      const message = link.dataset.message || "";
      const eventName = link.dataset.event || "offer_telegram_click";
      track(eventName, link);

      const copyResult = message ? copyMessage(message) : Promise.resolve();
      openTelegramProfile();

      try {
        await copyResult;
        if (eventName === "offer_telegram_click") track("offer_copy_message", link);
        showToast("Текст заявки скопирован. Вставьте его в чат.");
      } catch {
        showToast("Не удалось скопировать текст. Откройте чат и напишите название предложения.");
      }
    });
  });

  const viewedOffers = new Set();
  const cards = document.querySelectorAll(".offer-card[data-offer-id]");
  if ("IntersectionObserver" in window && cards.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const id = entry.target.dataset.offerId;
        if (entry.isIntersecting && !viewedOffers.has(id)) {
          viewedOffers.add(id);
          track("offer_card_view", entry.target, { cta_location: "home_catalog" });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    cards.forEach((card) => observer.observe(card));
  }
})();
