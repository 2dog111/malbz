import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const offers = JSON.parse(fs.readFileSync(path.join(root, "data", "offers.json"), "utf8"));
const errors = [];
const requiredFields = [
  "id", "slug", "category", "priority", "title", "shortTitle", "oneLineBenefit",
  "currentPrice", "oldPrice", "priceSuffix", "currency", "keyFacts", "image",
  "imageAlt", "ctaLabel", "telegramMessage", "summary", "sections", "faq", "status"
];
const forbiddenKeys = new Set([
  "riskLevel", "legalStatus", "policyWarning", "restrictions", "proof", "resaleModel"
]);

function fail(message) {
  errors.push(message);
}

function walk(value, location) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walk(item, `${location}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) fail(`${location}: запрещённое поле ${key}`);
    walk(child, `${location}.${key}`);
  }
}

if (offers.length !== 10) fail(`Ожидалось 10 предложений, найдено ${offers.length}`);
walk(offers, "offers");

for (const field of ["id", "slug", "priority"]) {
  const values = offers.map((offer) => offer[field]);
  if (new Set(values).size !== values.length) fail(`Поле ${field} должно быть уникальным`);
}

for (const offer of offers) {
  for (const field of requiredFields) {
    if (!(field in offer)) fail(`${offer.id || offer.slug}: отсутствует поле ${field}`);
  }
  if (offer.status !== "published") fail(`${offer.id}: предложение не опубликовано`);
  if (!Array.isArray(offer.keyFacts) || offer.keyFacts.length < 1 || offer.keyFacts.length > 3) {
    fail(`${offer.id}: keyFacts должно содержать от 1 до 3 пунктов`);
  }
  if (!Array.isArray(offer.faq) || offer.faq.length > 5) fail(`${offer.id}: FAQ длиннее 5 пунктов`);
  if (!Array.isArray(offer.sections)) fail(`${offer.id}: sections должно быть массивом`);
  for (const section of offer.sections || []) {
    if (section.steps?.length > 4) fail(`${offer.id}: в разделе «${section.title}» больше 4 шагов`);
  }

  const expectedUrl = `https://mal.bz/offers/${offer.slug}/`;
  for (const token of [offer.id, offer.title, offer.currentPrice, expectedUrl]) {
    if (!offer.telegramMessage.includes(token)) fail(`${offer.id}: Telegram-сообщение не содержит «${token}»`);
  }

  const imagePath = path.join(root, offer.image);
  if (!fs.existsSync(imagePath)) {
    fail(`${offer.id}: не найдено изображение ${offer.image}`);
  } else if (fs.statSync(imagePath).size > 700 * 1024) {
    fail(`${offer.id}: изображение больше 700 КБ (${offer.image})`);
  }
}

const homePath = path.join(root, "index.html");
if (!fs.existsSync(homePath)) fail("Не создан index.html");
const home = fs.existsSync(homePath) ? fs.readFileSync(homePath, "utf8") : "";
const exactHero = "Софт, реклама и услуги для малого бизнеса — по специальным ценам";
if (!home.includes(exactHero)) fail("На главной нет утверждённого H1");
if ((home.match(/<article class="offer-card"/g) || []).length !== 10) fail("На главной не 10 карточек");
if (home.includes("data-filter") || /featured|recommended|рекомендуем/i.test(home)) fail("На главной остались фильтры или выделенная подборка");
if (!home.includes('class="hero__visual"') || !home.includes("assets/hero-marketplace-pencil-v2-720.webp")) {
  fail("На первом экране нет восстановленной иллюстрации");
}
const heroImagePath = path.join(root, "assets", "hero-marketplace-pencil-v2-720.webp");
if (!fs.existsSync(heroImagePath) || fs.statSync(heroImagePath).size > 700 * 1024) {
  fail("Облегчённая версия иллюстрации отсутствует или больше 700 КБ");
}
if (/eyebrow|offer-card__category|offer-card__saving|offer-saving/.test(home)) {
  fail("На главной остались бейджи");
}
if (home.includes("10 предложений") || home.includes("Цена и главное условие видны сразу")) {
  fail("На главной остался удалённый служебный текст");
}
if ((home.match(/supplier-link/g) || []).length !== 1 || home.indexOf("supplier-link") < home.indexOf("<footer")) {
  fail("Ссылка поставщика должна быть одна и только в подвале");
}

for (const offer of offers) {
  const routePath = path.join(root, "offers", offer.slug, "index.html");
  if (!fs.existsSync(routePath)) {
    fail(`${offer.id}: не создан маршрут /offers/${offer.slug}/`);
    continue;
  }
  const html = fs.readFileSync(routePath, "utf8");
  for (const token of [offer.id, offer.title, offer.currentPrice, offer.ctaLabel, `https://mal.bz/offers/${offer.slug}/`]) {
    if (!html.includes(token.replaceAll("&", "&amp;")) && !html.includes(token)) {
      fail(`${offer.id}: страница оффера не содержит «${token}»`);
    }
  }
  if (!html.includes('class="sticky-cta"')) fail(`${offer.id}: нет мобильного sticky CTA`);
  if (/eyebrow|offer-card__category|offer-card__saving|offer-saving/.test(html)) {
    fail(`${offer.id}: на странице оффера остались бейджи`);
  }
}

function checkLocalReferences(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const references = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (/^(?:https?:|tg:|mailto:|#)/.test(reference)) continue;
    const clean = reference.split(/[?#]/)[0];
    const resolved = clean === "/" ? root : path.resolve(path.dirname(htmlPath), clean);
    const target = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()
      ? path.join(resolved, "index.html")
      : resolved;
    if (!fs.existsSync(target)) fail(`${path.relative(root, htmlPath)}: не найден локальный ресурс ${reference}`);
  }
}

if (fs.existsSync(homePath)) checkLocalReferences(homePath);
for (const offer of offers) {
  const routePath = path.join(root, "offers", offer.slug, "index.html");
  if (fs.existsSync(routePath)) checkLocalReferences(routePath);
}

const sitemapPath = path.join(root, "sitemap.xml");
if (!fs.existsSync(sitemapPath)) {
  fail("Не создан sitemap.xml");
} else {
  const sitemap = fs.readFileSync(sitemapPath, "utf8");
  if ((sitemap.match(/<url>/g) || []).length !== 11) fail("В sitemap должно быть 11 URL");
}

const generatedText = [home, ...offers.map((offer) => {
  const file = path.join(root, "offers", offer.slug, "index.html");
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
})].join("\n");

if (/цена аккаунта.{0,40}(?:равна|=).{0,10}(?:нулю|0)/i.test(generatedText)) {
  fail("Найдена запрещённая формулировка о нулевой цене аккаунта");
}
if (/pending_legal_review|riskLevel|legalStatus|policyWarning/.test(generatedText)) {
  fail("В публичном HTML остались служебные риск/правовые поля");
}
if (/исходный OpenAI API key|аккаунт OpenAI.{0,80}не переда|статус НДС|фиксированной наценки/i.test(generatedText)) {
  fail("В публичном HTML остались юридические или служебные оговорки");
}

if (errors.length) {
  process.stderr.write(`${errors.map((error) => `ERROR: ${error}`).join("\n")}\n`);
  process.exit(1);
}

process.stdout.write(`Validated ${offers.length} public offers, 10 routes, shared data, assets and sitemap\n`);
