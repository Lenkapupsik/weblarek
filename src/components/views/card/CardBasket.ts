import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";

export interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {

  protected indexElement: HTMLElement;
  protected button: HTMLButtonElement;
  protected id: string;

  constructor(container: HTMLElement, protected events: IEvents, id: string) {
    super(container);

    this.id = id;

    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", this.container);
    this.button = ensureElement<HTMLButtonElement>(".card__button", this.container);

    // Клик только для корзины
    this.button.addEventListener('click', () => {
      this.events.emit('basket:remove', { id: this.id });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}