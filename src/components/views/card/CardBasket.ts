import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";

export interface ICardBasket extends ICard {
  index: number;
}

export class CardBasket extends Card<ICardBasket> {

  protected indexElement: HTMLElement;
  protected button: HTMLButtonElement;
  protected onClick: () => void;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.onClick = onClick;
    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", this.container);
    this.button = ensureElement<HTMLButtonElement>(".card__button", this.container);

    // Клик только для корзины
    this.button.addEventListener('click', () => {
      this.onClick();     
    });
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}