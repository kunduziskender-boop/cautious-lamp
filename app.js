/**
 * Слой UI: находим узлы в документе и подставляем результат из render.js.
 * Данные читаются из SITE_DATA (site-data.js); разметка строится в render.js.
 */

function fillAbout() {
  const root = document.getElementById('about-text');
  if (!root || !SITE_DATA.aboutParagraphs) return;
  root.innerHTML = buildAboutHtml(SITE_DATA.aboutParagraphs);
}

function fillContacts() {
  const root = document.getElementById('contacts-list');
  if (!root || !SITE_DATA.contacts) return;
  root.innerHTML = buildContactsHtml(SITE_DATA.contacts);
}

function fillServicesTable() {
  const tbody = document.querySelector('#services-table tbody');
  if (!tbody || !SITE_DATA.services) return;
  tbody.innerHTML = buildServicesTableBodyHtml(SITE_DATA.services);
}

function fillGallery() {
  const root = document.getElementById('gallery');
  if (!root || !SITE_DATA.gallery) return;
  root.innerHTML = buildGalleryHtml(SITE_DATA.gallery);
}

function fillHeader() {
  const titleEl = document.querySelector('.site-title');
  const taglineEl = document.querySelector('.site-tagline');
  const { title, tagline, documentTitle } = getSiteHeaderTexts(SITE_DATA);

  if (titleEl && title) {
    titleEl.textContent = title;
  }
  if (taglineEl && tagline) {
    taglineEl.textContent = tagline;
  }

  document.title = documentTitle;
}

function init() {
  fillHeader();
  fillAbout();
  fillContacts();
  fillServicesTable();
  fillGallery();
}

// Когда дерево документа готово — запускаем отрисовку
document.addEventListener('DOMContentLoaded', init);
