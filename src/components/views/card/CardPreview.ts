import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

export interface ICardPreview extends ICard {
  category: string;
  image: string;
  text: string;
  inBasket: boolean;
  available: boolean;
}

export class CardPreview extends Card<ICardPreview> {

  protected imageCard: HTMLImageElement;
  protected categoryCard: HTMLElement;
  protected textCard: HTMLElement;
  protected buttonCard: HTMLButtonElement;
  protected onAction: () => void;

  constructor(container: HTMLElement, onAction: () => void) {
    super(container);

    this.onAction = onAction;

    this.imageCard = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryCard = ensureElement<HTMLElement>(".card__category", this.container);
    this.textCard = ensureElement<HTMLElement>(".card__text", this.container);
    this.buttonCard = ensureElement<HTMLButtonElement>(".card__button", this.container);

    // Клик для карточки просмотра
    this.buttonCard.addEventListener('click', () => {
      this.onAction();
    });
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
    if (this.buttonCard.disabled) return;

    this.buttonCard.textContent = value
      ? "Удалить из корзины"
      : "Купить";
  }

  render(data?: Partial<ICardPreview>): HTMLElement {
    super.render(data);

    if (data?.category) this.category = data.category;
    if (data?.image) this.image = data.image;
    if (data?.text) this.text = data.text;
    if (data?.available !== undefined) this.available = data.available;
    if (data?.inBasket !== undefined) this.inBasket = data.inBasket;

    return this.container;
  }
}