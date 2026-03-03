import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';

import { Api } from './components/base/Api';
import { EventEmitter } from './components/base/Events';

import { API_URL } from './utils/constants';
import { cloneTemplate } from './utils/utils';

import { IProduct, TPayment, IOrderRequest } from './types';

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

const orderForm = new OrderForm(cloneTemplate('#order'), events);

const contactsForm = new ContactsForm(cloneTemplate('#contacts'), events);

// Загрузка товаров с сервера
webLarekApi.getProducts()
  .then((items) => {
    productsModel.setItems(items);
  })
  .catch(console.error);

// Обновление каталога
events.on('products:set', ({ items }: { items: IProduct[] }) => {
  const cards = items.map(item => {
    return new CardCatalog(
      cloneTemplate('#card-catalog'),
      events,
      item.id
    ).render({
      title: item.title,
      price: item.price ? `${item.price} синапсов` : 'Бесценно',
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
    return new CardBasket(
      cloneTemplate('#card-basket'),
      events,
      item.id
    ).render({
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
});
// Синхронизация с обновлением корзины после перезагрузки страницы
events.emit('basket:change');

// Открыть карточку просмотра
events.on('card:preview', ({ id }: { id: string }) => {
  const item = productsModel.getItemById(id);
  if (!item) return;

  const preview = new CardPreview(
    cloneTemplate('#card-preview'),
    events,
    item.id
  ).render({
    title: item.title,
    price: item.price ? `${item.price} синапсов` : 'Бесценно',
    category: item.category,
    image: item.image,
    text: item.description,
    inBasket: basketModel.hasItem(id),
    available: !!item.price
  });

  modal.content = preview;
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

// Выбор способа оплаты
events.on('order:payment-select', ({ payment }: { payment: TPayment }) => {
  buyerModel.setData({ payment });
  orderForm.payment = payment;

  const errors = buyerModel.validateOrderStep();
  orderForm.errors = Object.values(errors).join(', ');
  orderForm.valid = Object.keys(errors).length === 0;
});

// Изменения в форме заказа (адрес)
events.on('order:submit:change',
  ({ field, value }: { field: string; value: string }) => {
    if (field === 'address') {
      buyerModel.setData({ address: value });
    }

    const errors = buyerModel.validateOrderStep();

    orderForm.errors = Object.values(errors).join(', ');
    orderForm.valid = Object.keys(errors).length === 0;
  });

// Обработчик кнопки 'Далее'
events.on('order:submit', () => {
  const errors = buyerModel.validateOrderStep();

  if (Object.keys(errors).length > 0) {
    orderForm.errors = Object.values(errors).join(', ');
    orderForm.valid = false;
    return;
  }

  modal.content = contactsForm.render();
});

// Изменение в форме заказа (email, телефон) 
events.on('contacts:submit:change',
  ({ field, value }: { field: string; value: string }) => {
    buyerModel.setData({ [field]: value });

    const errors = buyerModel.validateContactsStep();

    contactsForm.errors = Object.values(errors).join(', ');
    contactsForm.valid = Object.keys(errors).length === 0;
  });

// Обработчик кнопки 'Оплатить', отправка заказа на сервер
events.on('contacts:submit', () => {
  const errors = buyerModel.validateContactsStep();

  if (Object.keys(errors).length > 0) {
    contactsForm.errors = Object.values(errors).join(', ');
    contactsForm.valid = false;
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

  webLarekApi.postOrder(orderData)
    .then(() => {
      const total = basketModel.getTotalPrice();

      // Очистка корзины и форм после оплаты
      basketModel.clear();
      buyerModel.clear();

      const successView = new SuccessView(
        cloneTemplate('#success'),
        events
      );

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















