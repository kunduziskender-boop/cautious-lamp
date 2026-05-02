/**
 * Слой UI: находим узлы в документе и подставляем результат из render.js.
 * Данные читаются из SITE_DATA (site-data.js); разметка строится в render.js.
 */

// --- Идемпотентные тексты блока записи (не менять формулировки без нужды UX) ---
const BOOKING_MESSAGES = {
  recipientEmailInvalid:
    'В site-data.js в поле contacts.email укажите реальный адрес почты фотографа — без скобок-заглушек.',
  clientContactMissing: 'Укажите телефон или свой email для обратной связи.',
  requiredMissing: 'Заполните обязательные поля.',
  afterMailto:
    'Если почта не открылась, скопируйте текст из письма вручную или напишите на указанную в блоке контактов почту.',
};

const BOOKING_MAIL_SUBJECT_TEXT = 'Запись на съёмку';

/** Сброс сообщения формы записи перед новой попыткой */
function resetBookingFeedback(feedbackEl) {
  if (!feedbackEl) return;
  feedbackEl.textContent = '';
  feedbackEl.classList.remove('booking-form__feedback--warn');
}

/** Сообщение об ошибке: текст + модификатор предупреждения */
function setBookingFeedbackWarn(feedbackEl, message) {
  if (!feedbackEl) return;
  feedbackEl.textContent = message;
  feedbackEl.classList.add('booking-form__feedback--warn');
}

/** Подсказка после перехода mailto (без класса ошибки у фона — как в прежнем коде) */
function setBookingFeedbackSuccessHint(feedbackEl) {
  if (!feedbackEl) return;
  feedbackEl.textContent = BOOKING_MESSAGES.afterMailto;
}

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

/**
 * Строки тела письма — порядок и подписи полей сохранены как были (важно для mailto-длины и ожиданий клиента).
 */
function buildBookingBodyLines(bookingPayload) {
  const { name, phone, emailClient, dateHuman, time, comment } = bookingPayload;

  let bodyLines = [BOOKING_MAIL_SUBJECT_TEXT, '', `Имя: ${name}`];
  if (phone) bodyLines.push(`Телефон: ${phone}`);
  if (emailClient) bodyLines.push(`Email клиента: ${emailClient}`);
  bodyLines.push(`Желаемая дата: ${dateHuman}`, `Желаемое время: ${time}`);
  if (comment) bodyLines.push('', `Комментарий:`, comment);

  return bodyLines;
}

/**
 * Собираем mailto точно как раньше: encodeURIComponent(subject/body/recipient — без изменения алгоритма).
 */
function buildBookingMailtoUrl(recipientTrimmed, plainBodyLines) {
  const subject = encodeURIComponent(BOOKING_MAIL_SUBJECT_TEXT);
  const body = encodeURIComponent(plainBodyLines.join('\n'));
  return `mailto:${encodeURIComponent(recipientTrimmed)}?subject=${subject}&body=${body}`;
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  const feedback = document.getElementById('booking-feedback');
  if (!form) return;

  setBookingDateMin();

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!window.confirm('Вы уверены?')) {
      return;
    }

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

    resetBookingFeedback(feedback);

    if (!isProbablyValidRecipientEmail(to)) {
      setBookingFeedbackWarn(feedback, BOOKING_MESSAGES.recipientEmailInvalid);
      return;
    }

    if (!phone && !emailClient) {
      setBookingFeedbackWarn(feedback, BOOKING_MESSAGES.clientContactMissing);
      phoneEl?.focus();
      return;
    }

    if (!name || !date || !time) {
      setBookingFeedbackWarn(feedback, BOOKING_MESSAGES.requiredMissing);
      return;
    }

    const dateHuman = dateEl.valueAsDate
      ? dateEl.valueAsDate.toLocaleDateString('ru-RU')
      : date;

    const bodyLines = buildBookingBodyLines({
      name,
      phone,
      emailClient,
      dateHuman,
      time,
      comment,
    });

    window.location.href = buildBookingMailtoUrl(to, bodyLines);

    setBookingFeedbackSuccessHint(feedback);
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
