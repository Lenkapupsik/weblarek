import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

import { IProduct, TPayment, IOrderRequest, IBuyer } from './types';

import { WebLarekApi } from './components/communicate/WebLarekApi';

import { CardCatalog } from './components/views/card/CardCatalog';
import { CardPreview } from './components/views/card/CardPreview';
import { CardBasket } from './components/views/card/CardBasket';

import { BasketView } from './components/views/BasketView';
import { Modal } from './components/views/Modal';
import { Header } from './components/views/Header';
import { Gallery } from './components/views/Gallery';
import { SuccessView } from './components/views/SuccessView';

import { OrderForm } from './components/views/form/OrderForm';
import { ContactsForm } from './components/views/form/ContactsForm';


// Брокер
const events = new EventEmitter();

// API
const api = new Api(API_URL);

// Коммуникация
const webLarekApi = new WebLarekApi(api);

// Модели
const productsModel = new Products(events);
const basketModel = new Basket(events);
const buyerModel = new Buyer(events);

// Представления
const header = new Header(events, document.querySelector('.header')!);
const gallery = new Gallery(events, document.querySelector('.gallery')!);
const modal = new Modal(events, document.querySelector('#modal-container')!);

const basketView = new BasketView(cloneTemplate('#basket'), events);

const successView = new SuccessView(cloneTemplate('#success'), events);

const orderForm = new OrderForm(cloneTemplate('#order'), events);
const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);

const cardPreview = new CardPreview(cloneTemplate('#card-preview'), () => {
  const item = productsModel.getPreviewItem();
  if (!item) return;

  if (basketModel.hasItem(item.id)) {
    basketModel.removeItem(item.id);
  } else {
    basketModel.addItem(item);
  }

  modal.hide();
});

// Загрузка товаров с сервера
webLarekApi.getProducts()
  .then((items) => {
    productsModel.setItems(items);
  })
  .catch(console.error);

// Обновление каталога
events.on('products:set', ({ items }: { items: IProduct[] }) => {
  const cards = items.map(item => {
    const card = new CardCatalog(
      cloneTemplate('#card-catalog'),
      () => events.emit('card:preview', { id: item.id }) // эмит только ID
    );

    return card.render({
      title: item.title,
      price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
      category: item.category,
      image: item.image
    });
  });

  gallery.catalog = cards;
});

// Корзина изменилась
events.on('basket:change', () => {
  const items = basketModel.getItems();

  const cards = items.map((item, index) => {
    const card = new CardBasket(
      cloneTemplate('#card-basket'),
      () => events.emit('basket:remove', { id: item.id })
    );

    return card.render({
      title: item.title,
      price: `${item.price} синапсов`,
      index: index + 1
    });
  });

  // Обновляем представление корзины
  basketView.items = cards;
  basketView.total = basketModel.getTotalPrice();

  // Обновляем счетчик в шапке
  header.counter = basketModel.getItemsCount();

  // Блокируем/разблокируем кнопку оформления
  basketView.disabled = basketModel.getItemsCount() === 0;

  if (items.length === 0) {
    buyerModel.clear();// очищаем модель покупателя
    events.emit('buyer:clear'); // очищаем формы
  }
});

// Открытие превью при клике на карточку каталога
events.on('card:preview', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id);
  if (!item) return;

  // Сохраняем выбранный элемент в модели
  productsModel.setPreviewItem(item);

  // Обновляем карточку новыми данными
  cardPreview.render({
    title: item.title,
    price: item.price !== null ? `${item.price} синапсов` : 'Бесценно',
    category: item.category,
    image: item.image,
    text: item.description,
    inBasket: basketModel.hasItem(id),
    available: !!item.price
  });

  modal.content = cardPreview.render();
  modal.show();
});

// Добавить / удалить товар через карточку просмотра
events.on('card:toggle', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id);
  if (!item) return;

  // Проверяем открыта ли сейчас карточка просмотра
  const isPreviewOpen = modal.content?.querySelector('.card_full') !== null;

  if (basketModel.hasItem(id)) {
    basketModel.removeItem(id);
  } else {
    basketModel.addItem(item);
  }

  if (isPreviewOpen) {
    // Если это модальное окно карточки просмотра — закрываем
    modal.hide();
  }
});

// Удаление товара из корзины
events.on('basket:remove', ({ id }: { id: string }) => {
  basketModel.removeItem(id);
});

// Открыть корзину по клику по иконке
events.on('basket:open', () => {
  modal.content = basketView.render();
  modal.show();
});

// Обработчик кнопки "Оформить"
events.on('order:open', () => {
  modal.content = orderForm.render();
  modal.show();
});

// Выбор способа 
events.on('order:payment-select', ({ payment }: { payment: TPayment }) => {
  buyerModel.setData({ payment });
});

// Изменения в форме заказа (адрес)
events.on('order:submit:change',
  ({ field, value }: { field: string; value: string }) => {
    if (field === 'address') {
      buyerModel.setData({ address: value });
    }
  });

// Изменение в форме заказа (email, телефон) 
events.on('contacts:submit:change',
  ({ field, value }: { field: string; value: string }) => {
    buyerModel.setData({ [field]: value });
  });

// --- Слушаем изменения модели покупателя ---
events.on('buyer:change', (data: IBuyer) => {
  const errors = buyerModel.validate();

  // --- Форма заказа (шаг 1) ---
  orderForm.payment = data.payment ?? '';
  orderForm.address = data.address ?? '';
  const orderErrors = [errors.payment, errors.address].filter(Boolean).join(', ');
  orderForm.errors = orderErrors;
  orderForm.valid = !errors.payment && !errors.address;

  // --- Форма контактов (шаг 2) ---
  contactsForm.email = data.email ?? '';
  contactsForm.phone = data.phone ?? '';
  // На первом рендере шаг 2 не показываем ошибки
  const contactsErrors = Object.keys(data.email || data.phone ? errors : {}).length
    ? [errors.email, errors.phone].filter(Boolean).join(', ')
    : '';
  contactsForm.errors = contactsErrors;
  contactsForm.valid = !errors.email && !errors.phone;
});

// Обработчик кнопки 'Далее'
events.on('order:submit', () => {
  const errors = buyerModel.validate();

  if (errors.payment || errors.address) {
    return;
  }

  modal.content = contactsForm.render();
});

// Обработчик кнопки 'Оплатить'
events.on('contacts:submit', () => {
  const errors = buyerModel.validate();

  if (errors.email || errors.phone) {
    return;
  }

  const buyerData = buyerModel.getData();
  if (!buyerData.payment) return;

  const orderData: IOrderRequest = {
    payment: buyerData.payment,
    email: buyerData.email,
    phone: buyerData.phone,
    address: buyerData.address,
    items: basketModel.getItems().map(item => item.id),
    total: basketModel.getTotalPrice()
  };

  // Отправка заказа на сервер
  webLarekApi.postOrder(orderData)
    .then((response) => {
      const total = response.total;

      basketModel.clear();
      buyerModel.clear();

      successView.total = total;

      modal.content = successView.render();
      modal.show();
    })
    .catch(console.error);
});

//Обработчик очистки данных о покупателе и вида оплаты из форм 
events.on('buyer:clear', () => {
  orderForm.address = '';
  orderForm.payment = '';
  orderForm.errors = '';
  orderForm.valid = false;

  contactsForm.email = '';
  contactsForm.phone = '';
  contactsForm.errors = '';
  contactsForm.valid = false;
});

// Обработчик кнопки "За новыми покупками!"
events.on('success:close', () => {
  modal.hide();
});