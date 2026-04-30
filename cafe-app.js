// ==================================================
// cafe-app.js — Логика интерактивного меню
// ==================================================
//
// Что делает этот файл:
//   1. Хранит состояние (активная категория, корзина)
//   2. Рисует категории (фильтры) и блюда (карточки)
//   3. Управляет корзиной: добавить / убрать / считать сумму
//   4. ШАГ 1 → ШАГ 2: открывает модалку с итогами заказа
//   5. Подтверждает заказ и показывает экран успеха
//
// Важно: этот файл подключается ПОСЛЕ cafe-data.js,
// поэтому переменные CATEGORIES и DISHES уже доступны.

// ──────────────────────────────────────────────────
// СОСТОЯНИЕ ПРИЛОЖЕНИЯ
//
// Всё, что может меняться, хранится в одном объекте.
// Это удобно: не надо искать переменные по всему коду.
// ──────────────────────────────────────────────────

const state = {
  activeCategory: 'all', // id выбранной категории

  // Корзина — массив объектов вида: { dish: {...}, quantity: 2 }
  cart: [],
};

// ──────────────────────────────────────────────────
// ССЫЛКИ НА ЭЛЕМЕНТЫ СТРАНИЦЫ
//
// Получаем один раз при старте, не ищем каждый раз заново.
// ──────────────────────────────────────────────────

const categoriesEl     = document.getElementById('categories');
const dishesGridEl     = document.getElementById('dishes-grid');
const cartCountEl      = document.getElementById('cart-count');
const cartBarEl        = document.getElementById('cart-bar');
const cartItemsCountEl = document.getElementById('cart-items-count');
const cartTotalEl      = document.getElementById('cart-total');
const orderBtnEl       = document.getElementById('order-btn');
const cartIconBtnEl    = document.getElementById('cart-icon-btn');
const modalOverlayEl   = document.getElementById('modal-overlay');
const modalBodyEl      = document.getElementById('modal-body');
const modalTotalEl     = document.getElementById('modal-total');
const modalCloseEl     = document.getElementById('modal-close');
const confirmBtnEl     = document.getElementById('confirm-btn');
const successScreenEl  = document.getElementById('success-screen');
const newOrderBtnEl    = document.getElementById('new-order-btn');
const tableNumEl       = document.getElementById('table-num');

// ──────────────────────────────────────────────────
// НОМЕР СТОЛА
//
// Берём из URL-параметра ?table=5 (если есть).
// Это удобно: на каждый стол наклеивают QR-код
// со своей ссылкой, например: menu.html?table=5
// ──────────────────────────────────────────────────

(function setTableNumber() {
  const params = new URLSearchParams(window.location.search);
  const table = params.get('table');
  // Если параметр есть — показываем номер, иначе "—"
  tableNumEl.textContent = table || '—';
})();

// ──────────────────────────────────────────────────
// ОТОБРАЖЕНИЕ КАТЕГОРИЙ
// ──────────────────────────────────────────────────

function renderCategories() {
  // Очищаем и заново создаём кнопки
  categoriesEl.innerHTML = '';

  CATEGORIES.forEach(function(cat) {
    const btn = document.createElement('button');
    btn.className = 'category-btn' + (cat.id === state.activeCategory ? ' active' : '');
    btn.textContent = cat.label;
    btn.setAttribute('data-id', cat.id);
    btn.setAttribute('aria-pressed', cat.id === state.activeCategory ? 'true' : 'false');

    btn.addEventListener('click', function() {
      state.activeCategory = cat.id; // обновляем состояние
      renderCategories();            // перерисовываем фильтры
      renderDishes();                // перерисовываем карточки блюд
    });

    categoriesEl.appendChild(btn);
  });
}

// ──────────────────────────────────────────────────
// ОТОБРАЖЕНИЕ БЛЮД
// ──────────────────────────────────────────────────

function renderDishes() {
  // Фильтруем: если выбрано "Все блюда" — берём все,
  // иначе оставляем только те, у которых совпадает category
  const filtered = state.activeCategory === 'all'
    ? DISHES
    : DISHES.filter(function(d) { return d.category === state.activeCategory; });

  dishesGridEl.innerHTML = '';

  filtered.forEach(function(dish) {
    // Проверяем: есть ли это блюдо уже в корзине?
    const cartItem = state.cart.find(function(item) { return item.dish.id === dish.id; });
    const quantity = cartItem ? cartItem.quantity : 0;

    // Создаём карточку
    const card = document.createElement('div');
    card.className = 'dish-card';

    // Кнопка: либо "Добавить", либо блок "−  N  +"
    const controlsHtml = quantity > 0
      ? '<div class="dish-controls">'
          + '<button class="qty-btn minus-btn" data-id="' + dish.id + '" aria-label="Убрать одну порцию">−</button>'
          + '<span class="qty-count">' + quantity + '</span>'
          + '<button class="qty-btn plus-btn" data-id="' + dish.id + '" aria-label="Добавить ещё одну порцию">+</button>'
        + '</div>'
      : '<button class="add-btn" data-id="' + dish.id + '">Добавить</button>';

    // Бейдж показываем только если поле badge не null
    const badgeHtml = dish.badge
      ? '<span class="dish-badge">' + dish.badge + '</span>'
      : '';

    // onerror — если фото не загрузилось, показываем нейтральную заглушку.
    // this.onerror=null защищает от бесконечной петли на случай если заглушка тоже недоступна.
    card.innerHTML =
      '<div class="dish-photo-wrap">'
        + '<img class="dish-photo" src="' + dish.photo + '" alt="' + dish.name + '" loading="lazy"'
        + ' onerror="this.onerror=null;this.src=\'https://placehold.co/400x280/e8e2d9/78716c?text=Фото\'">'
        + badgeHtml
      + '</div>'
      + '<div class="dish-info">'
        + '<div class="dish-name">' + dish.name + '</div>'
        + '<div class="dish-weight">' + dish.weight + '</div>'
        + '<div class="dish-desc">' + dish.description + '</div>'
        + '<div class="dish-footer">'
          + '<span class="dish-price">' + dish.price + ' ₽</span>'
          + controlsHtml
        + '</div>'
      + '</div>';

    dishesGridEl.appendChild(card);
  });

  // Навешиваем обработчики на кнопки внутри карточек
  // (нужно делать ПОСЛЕ вставки в DOM)
  dishesGridEl.querySelectorAll('.add-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { addToCart(Number(btn.dataset.id)); });
  });

  dishesGridEl.querySelectorAll('.plus-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { addToCart(Number(btn.dataset.id)); });
  });

  dishesGridEl.querySelectorAll('.minus-btn').forEach(function(btn) {
    btn.addEventListener('click', function() { removeFromCart(Number(btn.dataset.id)); });
  });
}

// ──────────────────────────────────────────────────
// УПРАВЛЕНИЕ КОРЗИНОЙ
// ──────────────────────────────────────────────────

// Добавить одну порцию блюда в корзину
function addToCart(dishId) {
  // Ищем блюдо в списке DISHES
  const dish = DISHES.find(function(d) { return d.id === dishId; });

  // Ищем — может, оно уже есть в корзине?
  const existingItem = state.cart.find(function(item) { return item.dish.id === dishId; });

  if (existingItem) {
    // Уже есть → просто увеличиваем количество
    existingItem.quantity += 1;
  } else {
    // Ещё нет → добавляем как новую позицию
    state.cart.push({ dish: dish, quantity: 1 });
  }

  updateCartBar();
  renderDishes(); // перерисовываем карточки, чтобы показать счётчик
}

// Убрать одну порцию блюда из корзины
function removeFromCart(dishId) {
  const index = state.cart.findIndex(function(item) { return item.dish.id === dishId; });
  if (index === -1) return; // такого в корзине нет — ничего не делаем

  if (state.cart[index].quantity > 1) {
    // Ещё больше одной — уменьшаем количество
    state.cart[index].quantity -= 1;
  } else {
    // Последняя штука — удаляем позицию полностью
    // splice(index, 1) удаляет 1 элемент начиная с index
    state.cart.splice(index, 1);
  }

  updateCartBar();
  renderDishes();
}

// Обновить нижнюю панель корзины
function updateCartBar() {
  // reduce — проходим по массиву и накапливаем сумму/количество
  const totalItems = state.cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
  const totalPrice = state.cart.reduce(function(sum, item) { return sum + item.dish.price * item.quantity; }, 0);

  // Обновляем счётчик в шапке
  cartCountEl.textContent = totalItems;
  if (totalItems > 0) {
    cartCountEl.classList.add('has-items');
  } else {
    cartCountEl.classList.remove('has-items');
  }

  // Обновляем текст в нижней панели
  cartItemsCountEl.textContent = totalItems + ' ' + pluralItems(totalItems);
  cartTotalEl.textContent = totalPrice + ' ₽';

  // Показываем/скрываем нижнюю панель
  if (totalItems > 0) {
    cartBarEl.classList.add('visible');
  } else {
    cartBarEl.classList.remove('visible');
  }
}

// Склонение слова "блюдо" (1 блюдо, 2 блюда, 5 блюд)
function pluralItems(n) {
  var lastTwo = n % 100;
  var lastOne = n % 10;
  if (lastTwo >= 11 && lastTwo <= 14) return 'блюд';
  if (lastOne === 1) return 'блюдо';
  if (lastOne >= 2 && lastOne <= 4) return 'блюда';
  return 'блюд';
}

// ──────────────────────────────────────────────────
// ШАГ 2: МОДАЛЬНОЕ ОКНО — ПОДТВЕРЖДЕНИЕ ЗАКАЗА
// ──────────────────────────────────────────────────

function openOrderModal() {
  // Считаем итоговую сумму
  const totalPrice = state.cart.reduce(function(sum, item) { return sum + item.dish.price * item.quantity; }, 0);

  // Формируем список позиций в заказе
  modalBodyEl.innerHTML = state.cart.map(function(item) {
    return '<div class="modal-item">'
      + '<img class="modal-item-photo" src="' + item.dish.photo + '" alt="' + item.dish.name + '"'
      + ' onerror="this.onerror=null;this.src=\'https://placehold.co/56x56/e8e2d9/78716c?text=...\'">'
      + '<div class="modal-item-info">'
        + '<span class="modal-item-name">' + item.dish.name + '</span>'
        + '<span class="modal-item-qty">× ' + item.quantity + '</span>'
      + '</div>'
      + '<span class="modal-item-price">' + (item.dish.price * item.quantity) + ' ₽</span>'
    + '</div>';
  }).join('');

  // Показываем итоговую сумму
  modalTotalEl.textContent = totalPrice + ' ₽';

  // Показываем модалку (добавляем CSS-класс)
  modalOverlayEl.classList.add('visible');
  document.body.classList.add('modal-open'); // блокируем прокрутку фона

  // Фокусируемся на кнопке закрытия — это важно для доступности
  modalCloseEl.focus();
}

function closeOrderModal() {
  modalOverlayEl.classList.remove('visible');
  document.body.classList.remove('modal-open');
}

// Пользователь нажал "Подтвердить заказ"
function confirmOrder() {
  closeOrderModal();

  // Показываем экран успеха
  successScreenEl.classList.add('visible');

  // Очищаем корзину
  state.cart = [];
  updateCartBar();
}

// ──────────────────────────────────────────────────
// ОБРАБОТЧИКИ СОБЫТИЙ (КНОПКИ)
// ──────────────────────────────────────────────────

// Нажали "Оформить заказ" в нижней панели → открываем модалку
orderBtnEl.addEventListener('click', openOrderModal);

// Иконка корзины в шапке → тоже открывает заказ (если корзина не пуста)
cartIconBtnEl.addEventListener('click', function() {
  if (state.cart.length > 0) openOrderModal();
});

// Закрыть модалку кнопкой ✕
modalCloseEl.addEventListener('click', closeOrderModal);

// Подтвердить заказ
confirmBtnEl.addEventListener('click', confirmOrder);

// Закрыть модалку кликом по тёмному фону (вне окна)
modalOverlayEl.addEventListener('click', function(e) {
  // e.target — элемент по которому кликнули.
  // Если кликнули именно по оверлею (а не по окну внутри) — закрываем.
  if (e.target === modalOverlayEl) {
    closeOrderModal();
  }
});

// Закрыть модалку клавишей Escape (удобно и важно для доступности)
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modalOverlayEl.classList.contains('visible')) {
    closeOrderModal();
  }
});

// Кнопка "Новый заказ" на экране успеха
newOrderBtnEl.addEventListener('click', function() {
  successScreenEl.classList.remove('visible');
  renderDishes(); // перерисовываем карточки без счётчиков
});

// ──────────────────────────────────────────────────
// ЗАПУСК ПРИЛОЖЕНИЯ
//
// Эти две строки выполняются сразу при загрузке страницы
// ──────────────────────────────────────────────────

renderCategories(); // рисуем кнопки фильтров
renderDishes();     // рисуем карточки блюд
