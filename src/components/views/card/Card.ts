import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICard {
  title: string;
  price: string;
}

export abstract class Card<T extends ICard> extends Component<T> {

  protected titleCard: HTMLElement;
  protected priceCard: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    // Общие элементы для всех карточек
    this.titleCard = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceCard = ensureElement<HTMLElement>('.card__price', this.container);
  }

  set title(value: string) {
    this.titleCard.textContent = value;
  }

  set price(value: string) {
    this.priceCard.textContent = value;
  }
}