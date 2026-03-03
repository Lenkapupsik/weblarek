export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = 'card' | 'cash';

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

// Ответ сервера с товарами
export interface IProductsResponse {
  total: number; //количество карточек товаров в массиве
  items: IProduct[];
}

// Данные заказа для отправки на сервер
export interface IOrderRequest {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
  items: string[]; // массив id товаров
  total: number;
}

//  Ответ с сервера при сохранении заказа
export interface IOrderResponse {
  id: string;
  total: number;
}






