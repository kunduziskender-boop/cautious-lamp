/**
 * Слой «представление» в виде строк HTML и готовых подписей для шапки.
 * Здесь нет getElementById / querySelector — только данные → разметка.
 * V2: телефон и email превращаются в ссылки tel:/mailto: (как раньше в app.js).
 */

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

// Одна строка контакта: для телефона и почты — ссылки
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
    documentTitle: siteData.title || 'Портфолио',
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

  const pairs = [
    ['Телефон', contacts.phone],
    ['Email', contacts.email],
    ['Telegram', contacts.telegram],
    ['Instagram', contacts.instagram],
    ['Город', contacts.city],
  ];

  const rows = [];
  pairs.forEach(([label, value]) => {
    if (value && String(value).trim() !== '') {
      const displayed = formatContactDisplay(label, value);
      rows.push(
        `<div class="contacts__item"><strong>${escapeHtml(label)}:</strong> ${displayed}</div>`
      );
    }
  });
  return rows.join('');
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

/** HTML сетки галереи */
function buildGalleryHtml(gallery) {
  if (!gallery || !gallery.length) return '';
  return gallery
    .map((item) => {
      const cap = item.caption
        ? `<figcaption>${escapeHtml(item.caption)}</figcaption>`
        : '';
      return `<figure class="gallery__figure">
          <img class="gallery__img" src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt || '')}" loading="lazy" width="640" height="853">
          ${cap}
        </figure>`;
    })
    .join('');
}
