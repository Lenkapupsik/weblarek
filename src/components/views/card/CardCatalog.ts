import { ensureElement } from "../../../utils/utils";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

export interface ICardCatalog extends ICard {
  category: string;
  image: string;
}

export class CardCatalog extends Card<ICardCatalog> {

  protected imageCard: HTMLImageElement;
  protected categoryCard: HTMLElement;
  protected onClick: () => void;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.onClick = onClick;
    this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);

    // Клик только для каталога
    this.container.addEventListener('click', () => {
      this.onClick(); // эмит события preview с ID
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
  
  render(data?: Partial<ICardCatalog>): HTMLElement {
    const container = super.render(data);

    if (data?.category !== undefined) this.category = data.category;
    if (data?.image !== undefined) this.image = data.image;

    return container;
  }
} 