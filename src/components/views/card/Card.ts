import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface ICard {
  title: string;
  price: string;
}

export abstract class Card<T extends ICard> extends Component<T> {

  protected titleCard: HTMLElement;
  protected priceCard: HTMLElement;
  protected id: string;
  protected abstract actionEvent: string;

  constructor(container: HTMLElement, protected events: IEvents, id: string) {
    super(container);

    this.id = id;

    // Общие элементы для всех карточек
    this.titleCard = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceCard = ensureElement<HTMLElement>('.card__price', this.container);

    this.bindAction();
  }

  private bindAction() {
    // Если контейнер сам является кнопкой (например, CardCatalog)
    if (this.container.tagName === 'BUTTON') {
      this.container.addEventListener('click', () => {
        this.events.emit(this.actionEvent, { id: this.id });
      });
      return;
    }

    // Если есть кнопка внутри карточки (например, CardPreview, CardBasket)
    const button = this.container.querySelector<HTMLButtonElement>('.card__button');
    if (button) {
      button.addEventListener('click', () => {
        this.events.emit(this.actionEvent, { id: this.id });
      });
    }
  }

  set title(value: string) {
    this.titleCard.textContent = value;
  }

  set price(value: string) {
    this.priceCard.textContent = value;
  }
}



