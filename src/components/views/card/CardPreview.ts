import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

export interface ICardPreview extends ICard {
  category: string;
  image: string;
  text: string;
  inBasket: boolean;
  available: boolean;
}

export class CardPreview extends Card<CardPreview> {
  
  protected imageCard: HTMLImageElement;
  protected categoryCard: HTMLElement;
  protected textCard: HTMLElement;
  protected buttonCard: HTMLButtonElement;

  protected actionEvent = "card:toggle"; // событие для добавления/удаления товара в корзину

  constructor(container: HTMLElement, events: IEvents, id: string) {
    super(container, events, id);

    this.imageCard = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryCard = ensureElement<HTMLElement>(".card__category", this.container);
    this.textCard = ensureElement<HTMLElement>(".card__text", this.container);
    this.buttonCard = ensureElement<HTMLButtonElement>(".card__button", this.container);
  }

  set category(value: string) {
    const modifier = categoryMap[value as keyof typeof categoryMap];
    this.categoryCard.className = `card__category ${modifier}`;
    this.categoryCard.textContent = value;
  }

  set image(src: string) {
    this.imageCard.src = src;
  }

  set text(value: string) {
    this.textCard.textContent = value;
  }

  set available(value: boolean) {
    this.buttonCard.disabled = !value;

    if (!value) {
      this.buttonCard.textContent = "Недоступно";
    }
  }

  set inBasket(value: boolean) {
    if (this.buttonCard.disabled) {
      return;
    }

    this.buttonCard.textContent = value
      ? "Удалить из корзины"
      : "Купить";
  }

  render(data?: Partial<ICardPreview>): HTMLElement {
    if (!data) return super.render();

    super.render(data as Partial<ICard>); // title и price обновятся

    if (data.category !== undefined) this.category = data.category;
    if (data.image !== undefined) this.image = data.image;
    if (data.text !== undefined) this.text = data.text;
    if (data.available !== undefined) this.available = data.available;
    if (data.inBasket !== undefined) this.inBasket = data.inBasket;

    return this.container;
  }
}

