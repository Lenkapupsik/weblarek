import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";
import { categoryMap } from "../../../utils/constants";

export interface ICardCatalog extends ICard {
  category: string;
  image: string;
}

export class CardCatalog extends Card<ICardCatalog> {
  
  protected imageCard: HTMLImageElement;
  protected categoryCard: HTMLElement;
  protected actionEvent = 'card:preview'; // событие для просмотра карточки

  constructor(container: HTMLElement, events: IEvents, id: string) {
    super(container, events, id);

    this.imageCard = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryCard = ensureElement<HTMLElement>('.card__category', this.container);
  }

  set category(value: string) {
    const modifier = categoryMap[value as keyof typeof categoryMap];
    this.categoryCard.className = `card__category ${modifier}`;
    this.categoryCard.textContent = value;
  }

  set image(src: string) {
    this.imageCard.src = src;
  }
}

