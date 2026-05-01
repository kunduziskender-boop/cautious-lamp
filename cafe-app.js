// ==================================================
// cafe-app.js — Логика интерактивного меню
// ==================================================
//
// Структура (читай сверху вниз):
//   [ДАННЫЕ]      state          — активная категория и корзина
//   [DOM]         DOM            — все элементы страницы
//   [КОРЗИНА]     Cart           — методы управления корзиной
//   [МОДАЛКА]     Modal          — методы открытия/закрытия заказа
//   [РЕНДЕР]      renderCategories, renderDishes — рисуют на странице
//   [СОБЫТИЯ]     addEventListener — кнопки и клавиши
//   [СТАРТ]       инициализация страницы

// ──────────────────────────────────────────────────
// 1. СОСТОЯНИЕ
// ──────────────────────────────────────────────────

const state = {
  activeCategory: 'all', // id выбранной категории
  cart: [],              // массив: [{ dish: {...}, quantity: 2 }, ...]
};

// ──────────────────────────────────────────────────
// 2. DOM — объект со всеми элементами страницы
//
// Вместо 16 отдельных переменных — один организованный объект.
// Легче найти нужный элемент и видна вся структура.
// ──────────────────────────────────────────────────

const DOM = {
  // Фильтры и сетка
  categories: document.getElementById('categories'),
  dishes: document.getElementById('dishes-grid'),

  // Корзина внизу
  cartBar: document.getElementById('cart-bar'),
  cartCount: document.getElementById('cart-count'),
  cartIconBtn: document.getElementById('cart-icon-btn'),
  cartItemsCount: document.getElementById('cart-items-count'),
  cartTotal: document.getElementById('cart-total'),
  orderBtn: document.getElementById('order-btn'),

  // Модальное окно
  modal: document.getElementById('modal-overlay'),
  modalBody: document.getElementById('modal-body'),
  modalClose: document.getElementById('modal-close'),
  modalTotal: document.getElementById('modal-total'),
  confirmBtn: document.getElementById('confirm-btn'),

  // Экран успеха
  successScreen: document.getElementById('success-screen'),
  newOrderBtn: document.getElementById('new-order-btn'),

  // Стол
  tableNum: document.getElementById('table-num'),
};

// ──────────────────────────────────────────────────
// 3. КОРЗИНА — объект с методами
//
// Вся логика корзины в одном месте: добавить, убрать, считать сумму.
// Методы сами обновляют UI через this.refresh().
// ──────────────────────────────────────────────────

const Cart = {
  // Добавить одну порцию блюда
  // Макс 99 штук (реалистично для кафе)
  add(dishId) {
    const dish = DISHES.find(d => d.id === dishId);
    const existing = this.items.find(item => item.dish.id === dishId);

    if (existing) {
      if (existing.quantity < 99) {
        existing.quantity += 1;
      }
    } else {
      this.items.push({ dish, quantity: 1 });
    }

    this.refresh();
  },

  // Убрать одну порцию или удалить позицию
  remove(dishId) {
    const index = this.items.findIndex(item => item.dish.id === dishId);
    if (index === -1) return;

    if (this.items[index].quantity > 1) {
      this.items[index].quantity -= 1;
    } else {
      this.items.splice(index, 1);
    }

    this.refresh();
  },

  // Считать итоги: количество и сумму в одном проходе
  getTotals() {
    let items = 0;
    let price = 0;

    for (const item of this.items) {
      items += item.quantity;
      price += item.dish.price * item.quantity;
    }

    return { items, price };
  },

  // Обновить UI корзины и перерисовать карточки
  refresh() {
    const { items, price } = this.getTotals();

    DOM.cartCount.textContent = items;
    DOM.cartCount.classList.toggle('has-items', items > 0);
    DOM.cartItemsCount.textContent = items + ' ' + pluralItems(items);
    DOM.cartTotal.textContent = price + ' ₽';
    DOM.cartBar.classList.toggle('visible', items > 0);

    renderDishes(); // перерисовываем счётчики на карточках
  },

  // Очистить корзину
  clear() {
    this.items = [];
    this.refresh();
  },

  // Ссылка на state.cart (используется в других функциях)
  get items() {
    return state.cart;
  },

  set items(val) {
    state.cart = val;
  },
};

// ──────────────────────────────────────────────────
// 4. МОДАЛКА — объект с методами для шага 2
//
// Все операции модальной шапки в одном месте: открыть, закрыть, подтвердить.
// ──────────────────────────────────────────────────

const Modal = {
  // Открыть модалку с итогами заказа
  open() {
    const { price } = Cart.getTotals();

    DOM.modalBody.innerHTML = state.cart.map(item => {
      const linePrice = item.dish.price * item.quantity;
      return '<div class="modal-item">'
        + '<img class="modal-item-photo" src="' + item.dish.photo + '" alt="' + item.dish.name + '"'
        + ' onerror="this.onerror=null;this.src=\'https://placehold.co/56x56/e8e2d9/78716c?text=...\'">'
        + '<div class="modal-item-info">'
          + '<span class="modal-item-name">' + item.dish.name + '</span>'
          + '<span class="modal-item-qty">× ' + item.quantity + '</span>'
        + '</div>'
        + '<span class="modal-item-price">' + linePrice + ' ₽</span>'
      + '</div>';
    }).join('');

    DOM.modalTotal.textContent = price + ' ₽';
    DOM.modal.classList.add('visible');
    document.body.classList.add('modal-open');
    DOM.modalClose.focus();
  },

  // Закрыть модалку
  close() {
    DOM.modal.classList.remove('visible');
    document.body.classList.remove('modal-open');
  },

  // Подтвердить заказ → показать успех → очистить корзину
  confirm() {
    this.close();
    DOM.successScreen.classList.add('visible');
    Cart.clear();
  },
};

// ──────────────────────────────────────────────────
// 5. РЕНДЕР: ОТОБРАЖЕНИЕ НА СТРАНИЦЕ
// ──────────────────────────────────────────────────

function renderCategories() {
  DOM.categories.innerHTML = '';

  CATEGORIES.forEach(function(cat) {
    const isActive = cat.id === state.activeCategory;
    const btn = document.createElement('button');
    btn.className = 'category-btn' + (isActive ? ' active' : '');
    btn.textContent = cat.label;
    btn.setAttribute('data-id', cat.id);
    btn.setAttribute('aria-pressed', String(isActive));

    btn.addEventListener('click', function() {
      state.activeCategory = cat.id;
      renderCategories();
      renderDishes();
    });

    DOM.categories.appendChild(btn);
  });
}

function renderDishes() {
  const filtered = state.activeCategory === 'all'
    ? DISHES
    : DISHES.filter(d => d.category === state.activeCategory);

  DOM.dishes.innerHTML = '';

  filtered.forEach(function(dish) {
    const cartItem = state.cart.find(item => item.dish.id === dish.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const card = document.createElement('div');
    card.className = 'dish-card';

    const controls = quantity > 0
      ? '<div class="dish-controls">'
          + '<button class="qty-btn minus-btn" data-id="' + dish.id + '" aria-label="Убрать одну порцию">−</button>'
          + '<span class="qty-count">' + quantity + '</span>'
          + '<button class="qty-btn plus-btn" data-id="' + dish.id + '" aria-label="Добавить ещё одну порцию">+</button>'
        + '</div>'
      : '<button class="add-btn" data-id="' + dish.id + '">Добавить</button>';

    const badge = dish.badge
      ? '<span class="dish-badge">' + dish.badge + '</span>'
      : '';

    card.innerHTML =
      '<div class="dish-photo-wrap">'
        + '<img class="dish-photo" src="' + dish.photo + '" alt="' + dish.name + '" loading="lazy"'
        + ' onerror="this.onerror=null;this.src=\'https://placehold.co/400x280/e8e2d9/78716c?text=Фото\'">'
        + badge
      + '</div>'
      + '<div class="dish-info">'
        + '<div class="dish-name">' + dish.name + '</div>'
        + '<div class="dish-weight">' + dish.weight + '</div>'
        + '<div class="dish-desc">' + dish.description + '</div>'
        + '<div class="dish-footer">'
          + '<span class="dish-price">' + dish.price + ' ₽</span>'
          + controls
        + '</div>'
      + '</div>';

    DOM.dishes.appendChild(card);
  });
}

// ──────────────────────────────────────────────────
// 6. ДЕЛЕГАЦИЯ СОБЫТИЙ НА КАРТОЧКАХ
//
// Вместо трёх querySelectorAll-циклов (переназначаются при каждой перерисовке),
// один слушатель на контейнере, который навешивается один раз.
// ──────────────────────────────────────────────────

DOM.dishes.addEventListener('click', function(e) {
  // closest() ищет ближайший элемент с data-id, поднимаясь вверх по DOM
  const btn = e.target.closest('[data-id]');
  if (!btn) return;

  const dishId = Number(btn.dataset.id);

  if (btn.classList.contains('minus-btn')) {
    Cart.remove(dishId);
  } else {
    // add-btn и plus-btn — оба добавляют
    Cart.add(dishId);
  }
});

// ──────────────────────────────────────────────────
// 7. ОБРАБОТЧИКИ: КНОПКИ И КЛАВИШИ
// ──────────────────────────────────────────────────

// Нижняя панель: "Оформить заказ"
DOM.orderBtn.addEventListener('click', () => Modal.open());

// Иконка корзины в шапке
DOM.cartIconBtn.addEventListener('click', function() {
  if (state.cart.length > 0) Modal.open();
});

// Закрыть модалку кнопкой ✕
DOM.modalClose.addEventListener('click', () => Modal.close());

// Подтвердить заказ
DOM.confirmBtn.addEventListener('click', () => Modal.confirm());

// Закрыть модалку кликом по фону (не по самому окну)
DOM.modal.addEventListener('click', function(e) {
  if (e.target === DOM.modal) Modal.close();
});

// Закрыть модалку клавишей Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && DOM.modal.classList.contains('visible')) {
    Modal.close();
  }
});

// Экран успеха: кнопка "Новый заказ"
DOM.newOrderBtn.addEventListener('click', function() {
  DOM.successScreen.classList.remove('visible');
  renderDishes();
});

// ──────────────────────────────────────────────────
// 8. УТИЛИТЫ
// ──────────────────────────────────────────────────

function pluralItems(n) {
  const t = n % 100;
  const u = n % 10;
  if (t >= 11 && t <= 14) return 'блюд';
  if (u === 1) return 'блюдо';
  if (u >= 2 && u <= 4) return 'блюда';
  return 'блюд';
}

// ──────────────────────────────────────────────────
// 9. ИНИЦИАЛИЗАЦИЯ
// ──────────────────────────────────────────────────

// Номер стола из URL (?table=5)
const tableParam = new URLSearchParams(window.location.search).get('table');
DOM.tableNum.textContent = tableParam || '—';

// Рисуем страницу
renderCategories();
renderDishes();
