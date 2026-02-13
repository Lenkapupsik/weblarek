import './scss/styles.scss';

import { Products } from './components/models/Products';
import { Basket } from './components/models/Basket';
import { Buyer } from './components/models/Buyer';
import { apiProducts } from './utils/data';
import { Api } from './components/base/Api';
import { WebLarekApi } from './components/communicate/WebLarekApi';
import { API_URL } from './utils/constants';

// Products
const productsModel = new Products();

// 1. Сохраняем массив товаров
productsModel.setItems(apiProducts.items);
console.log('Массив товаров в каталоге:', productsModel.getItems());

// 2. Получаем товар по id
const firstProductId = apiProducts.items[0].id;
console.log('Товар по id:', productsModel.getItemById(firstProductId));

// 3. Сохраняем товар для подробного отображения
productsModel.setPreviewItem(apiProducts.items[0]);
console.log('Выбранный товар:', productsModel.getPreviewItem());

// Basket
const basketModel = new Basket();

// 1. Добавляем товары в корзину
basketModel.addItem(apiProducts.items[0]);
basketModel.addItem(apiProducts.items[1]);
console.log('Корзина после добавления товаров:', basketModel.getItems());

// 2. Получаем массив товаров в корзине
console.log('Текущие товары в корзине:', basketModel.getItems());

// 3. Получаем количество товаров
console.log('Количество товаров в корзине:', basketModel.getItemsCount());

// 4. Получаем общую стоимость товаров
console.log('Общая стоимость корзины:', basketModel.getTotalPrice());

// 5. Проверка наличия товара в корзине по id
console.log(`Товар с id ${firstProductId} есть в корзине:`, basketModel.hasItem(firstProductId));

// 6. Удаление товара из корзины
basketModel.removeItem(firstProductId);
console.log('Корзина после удаления товара:', basketModel.getItems());

// 7. Очистка корзины
basketModel.clear();
console.log('Корзина после очистки:', basketModel.getItems());

// Buyer
const buyerModel = new Buyer();

// 1. Сохраняем данные покупателя
buyerModel.setData({ email: 'kirill67-44@yandex.ru' });
buyerModel.setData({ phone: '+79005544400' });
buyerModel.setData({ address: '143004, Москва, ул. Пушкинская, д. 4, стр. 1, кв. 44' });
console.log('Данные покупателя:', buyerModel.getData());

// 2. Валидация данных покупателя
console.log('Ошибки в данных покупателя (валидация):', buyerModel.validate());

// 3. Очистка данных покупателя
buyerModel.clear();
console.log('Данные покупателя после очистки:', buyerModel.getData());

// WebLarekApi
const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

webLarekApi.getProducts()
  .then((items) => {
    productsModel.setItems(items);
    console.log('Каталог товаров с сервера:', productsModel.getItems());
  })
  .catch((err) => {
    console.error('Ошибка загрузки каталога:', err);
  });



