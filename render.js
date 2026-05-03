/**
 * Слой «представление» в виде строк HTML и готовых подписей для шапки.
 * Здесь нет getElementById / querySelector — только данные → разметка.
 * V2: телефон и email превращаются в ссылки tel:/mailto: (как раньше в app.js).
 */

/** Значение по умолчанию для заголовка вкладки (должно совпадать с прежним поведением) */
const DEFAULT_DOCUMENT_TITLE = 'Портфолио';

/** Порядок и подписи полей контактов — formatContactDisplay опирается на точные русские строки «Телефон» и «Email» */
const CONTACT_DISPLAY_PAIRS = [
  ['Телефон', 'phone'],
  ['Email', 'email'],
  ['Telegram', 'telegram'],
  ['Instagram', 'instagram'],
  ['Город', 'city'],
];

// Безопасный вывод пользовательских строк как текст внутри HTML (логика совпадает с прежним app.js)
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Кавычки в href недопустимы — режем только их (данные задаёте вы в site-data.js)
function safeHref(value) {
  return String(value).replace(/"/g, '');
}

// Экранирование значения атрибута в двойных кавычках
function escapeAttrValue(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

// Одна строка контакта: для телефона и почты — ссылки (критично не менять условие по подписи label)
function formatContactDisplay(label, value) {
  const text = escapeHtml(value);
  if (label === 'Телефон') {
    const hrefTel = safeHref(value).replace(/\s+/g, '');
    return `<a href="tel:${escapeAttrValue(hrefTel)}">${text}</a>`;
  }
  if (label === 'Email') {
    const addr = safeHref(String(value).trim());
    const hrefMail = encodeURIComponent(addr);
    return `<a href="mailto:${escapeAttrValue(hrefMail)}">${text}</a>`;
  }
  return text;
}

/** Тексты для шапки (без HTML — в шаблоне они вставляются как textContent) */
function getSiteHeaderTexts(siteData) {
  return {
    title: siteData.title || '',
    tagline: siteData.tagline || '',
    documentTitle: siteData.title || DEFAULT_DOCUMENT_TITLE,
  };
}

/** HTML блока «О фотографе» */
function buildAboutHtml(paragraphs) {
  if (!paragraphs || !paragraphs.length) return '';
  return paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('');
}

/** HTML списка контактов */
function buildContactsHtml(contacts) {
  if (!contacts) return '';

  const rows = [];

  CONTACT_DISPLAY_PAIRS.forEach(([label, key]) => {
    const value = contacts[key];
    if (value && String(value).trim() !== '') {
      const displayed = formatContactDisplay(label, value);
      rows.push(`<div class="contacts__item"><strong>${escapeHtml(label)}:</strong> ${displayed}</div>`);
    }
  });

  return rows.join('');
}

/** HTML блока «Способы оплаты» */
function buildPaymentMethodsHtml(methods) {
  if (!methods || !methods.length) return '';
  return methods
    .map((item) => {
      const title = escapeHtml(item.title || '');
      const detailRaw = item.detail && String(item.detail).trim();
      const detail = detailRaw
        ? `<p class="payment-method__detail">${escapeHtml(detailRaw)}</p>`
        : '';
      const urlRaw = item.url && String(item.url).trim();
      const link = urlRaw
        ? `<p class="payment-method__link-wrap"><a class="payment-method__link" href="${escapeAttrValue(safeHref(urlRaw))}" rel="noopener noreferrer">${escapeHtml(
            item.linkLabel && String(item.linkLabel).trim() ? String(item.linkLabel).trim() : 'Перейти'
          )}</a></p>`
        : '';
      return `<article class="payment-method">
        <h3 class="payment-method__title">${title}</h3>
        ${detail}
        ${link}
      </article>`;
    })
    .join('');
}

/** HTML только для <tbody> таблицы услуг */
function buildServicesTableBodyHtml(services) {
  if (!services || !services.length) return '';
  return services
    .map(
      (s) =>
        `<tr>
          <td>${escapeHtml(s.title)}</td>
          <td>${escapeHtml(s.detail)}</td>
          <td>${escapeHtml(s.price)}</td>
        </tr>`
    )
    .join('');
}

/** HTML слайдшоу галереи (escapeHtml для URL/ alt — сохранён прежний уровень «защиты» от строк в атрибутах) */
function buildGalleryHtml(gallery) {
  if (!gallery || !gallery.length) return '';
  const total = gallery.length;
  const slides = gallery
    .map((item, index) => {
      const cap = item.caption
        ? `<figcaption class="gallery-slideshow__figcaption">${escapeHtml(item.caption)}</figcaption>`
        : '';
      const loading = index === 0 ? 'eager' : 'lazy';
      return `<figure class="gallery-slideshow__slide${index === 0 ? ' is-active' : ''}" data-slide-index="${index}"${index === 0 ? '' : ' aria-hidden="true"'}>
          <div class="gallery-slideshow__img-wrap">
            <img class="gallery-slideshow__img" src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}" loading="${loading}" width="640" height="853" decoding="async">
          </div>
          ${cap}
        </figure>`;
    })
    .join('');

  const dots = gallery
    .map(
      (_, index) =>
        `<button type="button" class="gallery-slideshow__dot${index === 0 ? ' is-active' : ''}" role="tab" aria-selected="${index === 0 ? 'true' : 'false'}" aria-label="Показать фото ${index + 1} из ${total}"></button>`
    )
    .join('');

  return `<div class="gallery gallery--slideshow">
      <div class="gallery-slideshow__frame">
        <button type="button" class="gallery-slideshow__btn gallery-slideshow__btn--prev" aria-label="Предыдущее фото">‹</button>
        <div
          class="gallery-slideshow__viewport"
          tabindex="0"
          role="region"
          aria-roledescription="карусель"
          aria-label="Галерея работ"
        >
          ${slides}
        </div>
        <button type="button" class="gallery-slideshow__btn gallery-slideshow__btn--next" aria-label="Следующее фото">›</button>
      </div>
      <p class="gallery-slideshow__counter" aria-live="polite">1 / ${total}</p>
      <div class="gallery-slideshow__dots" role="tablist" aria-label="Выбор слайда">${dots}</div>
    </div>`;
}
