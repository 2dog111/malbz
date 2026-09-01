import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const offersPath = path.join(projectRoot, "data", "offers.json");
const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"))
  .filter((offer) => offer.status === "published")
  .sort((left, right) => left.priority - right.priority);

const escapeHtml = (value) => String(value ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const priceText = (offer) => [offer.currentPrice, offer.priceSuffix].filter(Boolean).join(" ");
const offerUrl = (offer) => `https://mal.bz/offers/${offer.slug}/`;

function head({ title, description, canonical, image, depth = 0 }) {
  const prefix = depth === 0 ? "" : "../../";
  const absoluteImage = `https://mal.bz/${image || "assets/malbz-logo.png"}`;
  return `  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}">
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <meta property="og:type" content="${depth === 0 ? "website" : "product"}">
    <meta property="og:title" content="${escapeHtml(title)}">
    <meta property="og:description" content="${escapeHtml(description)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(absoluteImage)}">
    <link rel="icon" type="image/png" sizes="64x64" href="${prefix}assets/favicon.png">
    <link rel="apple-touch-icon" href="${prefix}assets/apple-touch-icon.png">
    <link rel="preload" href="${prefix}assets/fonts/onest-cyrillic-variable.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${prefix}market.css?v=20260901-2">
    <script src="${prefix}assets/site.js?v=20260901-2" defer></script>
  </head>`;
}

function brand(prefix = "") {
  return `<a class="brand" href="${prefix || "/"}" aria-label="MaL.BZ — главная">
        <img src="${prefix}assets/malbz-logo.png" alt="" width="46" height="46">
        <span>MaL.BZ</span>
      </a>`;
}

function telegramAttributes(offer, location) {
  return `href="https://t.me/am7am" class="button button--primary js-telegram" data-message="${escapeHtml(offer.telegramMessage)}" data-event="offer_telegram_click" data-offer-id="${escapeHtml(offer.id)}" data-offer-title="${escapeHtml(offer.title)}" data-category="${escapeHtml(offer.category)}" data-price="${escapeHtml(priceText(offer))}" data-cta-location="${escapeHtml(location)}"`;
}

function renderCard(offer, index) {
  const oldPrice = offer.oldPrice
    ? `<span class="offer-card__old-price">${escapeHtml(offer.oldPrice)}</span>`
    : "";
  const saving = offer.saving
    ? `<span class="offer-card__saving">${escapeHtml(offer.saving)}</span>`
    : "";
  const loading = index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"';
  return `          <article class="offer-card" id="offer-${escapeHtml(offer.id)}" data-offer-id="${escapeHtml(offer.id)}" data-offer-title="${escapeHtml(offer.title)}" data-category="${escapeHtml(offer.category)}" data-price="${escapeHtml(priceText(offer))}">
            <div class="offer-card__head">
              <img src="${escapeHtml(offer.image)}" alt="${escapeHtml(offer.imageAlt)}" width="64" height="64" ${loading} decoding="async">
              <span class="offer-card__category">${escapeHtml(offer.categoryLabel)}</span>
            </div>
            <h3>${escapeHtml(offer.title)}</h3>
            <p class="offer-card__benefit">${escapeHtml(offer.oneLineBenefit)}</p>
            <div class="offer-card__price-row">
              <p class="offer-card__price">${escapeHtml(offer.currentPrice)}${offer.priceSuffix ? `<small>${escapeHtml(offer.priceSuffix)}</small>` : ""}</p>
${[oldPrice, saving].filter(Boolean).map((item) => `              ${item}`).join("\n")}
            </div>
            <ul class="offer-card__facts">
${offer.keyFacts.map((fact) => `              <li>${escapeHtml(fact)}</li>`).join("\n")}
            </ul>
            <div class="offer-card__actions">
              <a ${telegramAttributes(offer, "home_card")}>${escapeHtml(offer.ctaLabel)}</a>
              <a class="offer-card__details" href="offers/${escapeHtml(offer.slug)}/" data-event="offer_details_click" data-offer-id="${escapeHtml(offer.id)}" data-offer-title="${escapeHtml(offer.title)}" data-category="${escapeHtml(offer.category)}" data-price="${escapeHtml(priceText(offer))}" data-cta-location="home_card">Подробнее</a>
            </div>
          </article>`;
}

function renderHome() {
  const cards = offers.map(renderCard).join("\n");
  return `<!doctype html>
<html lang="ru">
${head({
  title: "MaL.BZ — софт, реклама и услуги для малого бизнеса",
  description: "Софт, реклама и услуги для малого бизнеса по специальным ценам. Выберите предложение и сразу напишите по нему в Telegram.",
  canonical: "https://mal.bz/",
  image: "assets/hero-marketplace-pencil-v2.png"
})}
  <body data-page="home">
    <a class="skip-link" href="#offers">К предложениям</a>
    <header class="site-header">
      ${brand()}
      <a class="header-link" href="#offers">Все предложения</a>
    </header>

    <main>
      <section class="hero" aria-labelledby="hero-title">
        <p class="eyebrow">MaL.BZ</p>
        <h1 id="hero-title">Софт, реклама и услуги для малого бизнеса — по специальным ценам</h1>
        <p class="hero__lead">Выберите предложение, посмотрите условия и сразу напишите по нему в Telegram.</p>
        <a class="button button--primary hero__button" href="#offers">Смотреть предложения</a>
      </section>

      <section class="catalog" id="offers" aria-labelledby="offers-title">
        <div class="catalog__heading">
          <div>
            <p class="eyebrow">${offers.length} предложений</p>
            <h2 id="offers-title">Выберите подходящий оффер</h2>
          </div>
          <p>Цена и главное условие видны сразу. Подробности — на странице предложения.</p>
        </div>
        <div class="offer-grid">
${cards}
        </div>
      </section>

      <section class="home-faq" aria-labelledby="faq-title">
        <h2 id="faq-title">Перед покупкой</h2>
        <details>
          <summary>Как начать покупку?</summary>
          <p>Нажмите основную кнопку в карточке. Текст заявки скопируется, затем откроется Telegram.</p>
        </details>
        <details>
          <summary>Что будет в сообщении?</summary>
          <p>Название, цена, код оффера и ссылка на его страницу. Вам останется вставить текст в чат.</p>
        </details>
        <details>
          <summary>Где посмотреть полный состав?</summary>
          <p>Нажмите «Подробнее» в нужной карточке. На странице оффера собраны условия и состав предложения.</p>
        </details>
      </section>
    </main>

    <footer class="site-footer">
      <p><span>MaL.BZ</span> — софт и услуги для малого бизнеса.</p>
      <div class="site-footer__links">
        <a href="https://t.me/am7am">Telegram: @am7am</a>
        <a href="https://t.me/am7am" class="js-telegram supplier-link" data-message="Здравствуйте. Хочу добавить своё предложение на MaL.BZ." data-event="supplier_link_click" data-cta-location="footer">Добавить своё предложение</a>
      </div>
    </footer>
    <div class="copy-toast" role="status" aria-live="polite" hidden>Текст заявки скопирован. Вставьте его в чат.</div>
  </body>
</html>
`;
}

function renderTable(table) {
  return `        <div class="pricing-table-wrap">
          <table class="pricing-table">
            <thead><tr>${table.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead>
            <tbody>
${table.rows.map((row) => `              <tr>${row.map((cell, index) => `<td data-label="${escapeHtml(table.headers[index])}">${escapeHtml(cell)}</td>`).join("")}</tr>`).join("\n")}
            </tbody>
          </table>
        </div>`;
}

function renderSection(section) {
  const paragraphs = (section.paragraphs || []).map((paragraph) => `        <p>${escapeHtml(paragraph)}</p>`).join("\n");
  const steps = section.steps?.length
    ? `        <ol>${section.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`
    : "";
  const itemList = section.items?.length
    ? `<ul>${section.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
  const items = section.collapsible && itemList
    ? `        <details class="feature-disclosure"><summary>Показать все возможности</summary>${itemList}</details>`
    : itemList ? `        ${itemList}` : "";
  const table = section.table ? renderTable(section.table) : "";
  const source = section.source
    ? `        <p class="source-note"><a href="${escapeHtml(section.source.url)}">${escapeHtml(section.source.label)}</a>. ${escapeHtml(section.source.note)}</p>`
    : "";
  return `      <section class="detail-section">
        <h2>${escapeHtml(section.title)}</h2>
${paragraphs}
${steps}
${items}
${table}
${source}
      </section>`;
}

function renderOfferFaq(offer) {
  if (!offer.faq?.length) return "";
  return `      <section class="detail-section offer-faq" aria-labelledby="faq-${escapeHtml(offer.id)}">
        <h2 id="faq-${escapeHtml(offer.id)}">Основные вопросы</h2>
${offer.faq.slice(0, 5).map((item) => `        <details><summary>${escapeHtml(item.question)}</summary><p>${escapeHtml(item.answer)}</p></details>`).join("\n")}
      </section>`;
}

function renderOffer(offer) {
  const prefix = "../../";
  return `<!doctype html>
<html lang="ru">
${head({
  title: `${offer.title} — MaL.BZ`,
  description: offer.oneLineBenefit,
  canonical: offerUrl(offer),
  image: offer.image,
  depth: 2
})}
  <body class="offer-detail" data-page="offer" data-offer-id="${escapeHtml(offer.id)}" data-offer-title="${escapeHtml(offer.title)}" data-category="${escapeHtml(offer.category)}" data-price="${escapeHtml(priceText(offer))}">
    <header class="site-header site-header--offer">
      ${brand(prefix)}
      <a class="header-link" href="${prefix}#offers">Все предложения</a>
    </header>

    <main class="offer-page">
      <a class="offer-page__back" href="${prefix}#offer-${escapeHtml(offer.id)}">← Вернуться к каталогу</a>
      <section class="offer-hero">
        <div class="offer-hero__identity">
          <img class="offer-hero__icon" src="${prefix}${escapeHtml(offer.image)}" alt="${escapeHtml(offer.imageAlt)}" width="72" height="72" fetchpriority="high" decoding="async">
          <p class="eyebrow">${escapeHtml(offer.categoryLabel)}</p>
        </div>
        <h1>${escapeHtml(offer.title)}</h1>
        <p class="offer-hero__lead">${escapeHtml(offer.oneLineBenefit)}</p>
        <div class="offer-price-row">
          <p class="offer-price">${escapeHtml(offer.currentPrice)}${offer.priceSuffix ? `<small>${escapeHtml(offer.priceSuffix)}</small>` : ""}</p>
${[
  offer.oldPrice ? `<span class="offer-old-price">${escapeHtml(offer.oldPrice)}</span>` : "",
  offer.saving ? `<span class="offer-saving">${escapeHtml(offer.saving)}</span>` : ""
].filter(Boolean).map((item) => `          ${item}`).join("\n")}
        </div>
        <ul class="offer-hero__facts">
${offer.keyFacts.map((fact) => `          <li>${escapeHtml(fact)}</li>`).join("\n")}
        </ul>
        <a ${telegramAttributes(offer, "offer_hero")}>${escapeHtml(offer.ctaLabel)}</a>
      </section>

      <section class="detail-section detail-section--summary">
        <h2>Коротко о предложении</h2>
        <p>${escapeHtml(offer.summary)}</p>
      </section>
${offer.sections.map(renderSection).join("\n")}
${renderOfferFaq(offer)}
      <section class="offer-final">
        <div>
          <h2>${escapeHtml(offer.ctaLabel)}</h2>
          <p>${escapeHtml(priceText(offer))}</p>
        </div>
        <a ${telegramAttributes(offer, "offer_footer")}>Написать по предложению</a>
      </section>
    </main>

    <footer class="site-footer offer-footer">
      <p><span>MaL.BZ</span> — софт и услуги для малого бизнеса.</p>
      <a href="${prefix}#offers">Все предложения</a>
    </footer>

    <div class="sticky-cta" aria-label="Быстрый переход в Telegram">
      <span>${escapeHtml(offer.currentPrice)}</span>
      <a ${telegramAttributes(offer, "offer_sticky")}>${escapeHtml(offer.ctaLabel)}</a>
    </div>
    <div class="copy-toast" role="status" aria-live="polite" hidden>Текст заявки скопирован. Вставьте его в чат.</div>
  </body>
</html>
`;
}

fs.writeFileSync(path.join(projectRoot, "index.html"), renderHome());

for (const offer of offers) {
  const offerDirectory = path.join(projectRoot, "offers", offer.slug);
  fs.mkdirSync(offerDirectory, { recursive: true });
  fs.writeFileSync(path.join(offerDirectory, "index.html"), renderOffer(offer));
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://mal.bz/</loc></url>
${offers.map((offer) => `  <url><loc>${offerUrl(offer)}</loc></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(projectRoot, "sitemap.xml"), sitemap);

process.stdout.write(`Built ${offers.length} offers from data/offers.json\n`);
