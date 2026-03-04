import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasketView {
  items: HTMLElement[];
  total: number;
  disabled: boolean;
}

export class BasketView extends Component<IBasketView> {

  protected basketList: HTMLElement;
  protected totalPrice: HTMLElement;
  protected basketButton: HTMLButtonElement;
  protected emptyText: HTMLElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.basketList = ensureElement<HTMLElement>('.basket__list', this.container);
    this.totalPrice = ensureElement<HTMLElement>('.basket__price', this.container);
    this.basketButton = ensureElement<HTMLButtonElement>('.basket__button', this.container);

    this.emptyText = document.createElement('p');
    this.emptyText.textContent = 'Корзина пуста';

    // Начальное состояние корзины
    this.basketButton.disabled = true;
    this.basketList.replaceChildren(this.emptyText);
    this.total = 0;

    this.basketButton.addEventListener('click', () => {
      this.events.emit('order:open');
    });
  }

  set items(items: HTMLElement[]) {
    if (items.length === 0) {
      this.basketList.replaceChildren(this.emptyText);
      this.basketButton.disabled = true;
    } else {
      this.basketList.replaceChildren(...items);
      this.basketButton.disabled = false;
    }
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }

  // / Блокировка кнопки 
  set disabled(value: boolean) {
    this.basketButton.disabled = value;
  }
}