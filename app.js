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

function isProbablyValidRecipientEmail(email) {
  const s = String(email || '').trim();
  return s.includes('@') && !s.startsWith('(');
}

/** Минимальная дата для поля записи — сегодня (локально в браузере) */
function setBookingDateMin() {
  const input = document.getElementById('booking-date');
  if (!input) return;
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  input.min = `${y}-${m}-${day}`;
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  const feedback = document.getElementById('booking-feedback');
  if (!form) return;

  setBookingDateMin();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameEl = document.getElementById('booking-name');
    const phoneEl = document.getElementById('booking-phone');
    const emailClientEl = document.getElementById('booking-email-client');
    const dateEl = document.getElementById('booking-date');
    const timeEl = document.getElementById('booking-time');
    const commentEl = document.getElementById('booking-comment');

    if (!nameEl || !dateEl || !timeEl || !SITE_DATA?.contacts?.email) return;

    const name = String(nameEl.value || '').trim();
    const phone = String(phoneEl?.value || '').trim();
    const emailClient = String(emailClientEl?.value || '').trim();
    const date = dateEl.value;
    const time = timeEl.value;
    const comment = String(commentEl?.value || '').trim();

    const to = SITE_DATA.contacts.email.trim();

    if (feedback) {
      feedback.textContent = '';
      feedback.classList.remove('booking-form__feedback--warn');
    }

    if (!isProbablyValidRecipientEmail(to)) {
      if (feedback) {
        feedback.textContent =
          'В site-data.js в поле contacts.email укажите реальный адрес почты фотографа — без скобок-заглушек.';
        feedback.classList.add('booking-form__feedback--warn');
      }
      return;
    }

    if (!phone && !emailClient) {
      if (feedback) {
        feedback.textContent = 'Укажите телефон или свой email для обратной связи.';
        feedback.classList.add('booking-form__feedback--warn');
      }
      phoneEl?.focus();
      return;
    }

    if (!name || !date || !time) {
      if (feedback) {
        feedback.textContent = 'Заполните обязательные поля.';
        feedback.classList.add('booking-form__feedback--warn');
      }
      return;
    }

    const dateHuman = dateEl.valueAsDate
      ? dateEl.valueAsDate.toLocaleDateString('ru-RU')
      : date;

    let bodyLines = [`Запись на съёмку`, '', `Имя: ${name}`];
    if (phone) bodyLines.push(`Телефон: ${phone}`);
    if (emailClient) bodyLines.push(`Email клиента: ${emailClient}`);
    bodyLines.push(`Желаемая дата: ${dateHuman}`, `Желаемое время: ${time}`);
    if (comment) bodyLines.push('', `Комментарий:`, comment);

    const subject = encodeURIComponent('Запись на съёмку');
    const body = encodeURIComponent(bodyLines.join('\n'));
    const mailto = `mailto:${encodeURIComponent(to)}?subject=${subject}&body=${body}`;

    window.location.href = mailto;

    if (feedback) {
      feedback.textContent =
        'Если почта не открылась, скопируйте текст из письма вручную или напишите на указанную в блоке контактов почту.';
    }
  });
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
  initBookingForm();
}

// Когда дерево документа готово — запускаем отрисовку
document.addEventListener('DOMContentLoaded', init);
