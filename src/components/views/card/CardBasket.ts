import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Card, ICard } from "./Card";


export interface ICardBasket extends ICard {
  index: number; // номер позиции в корзине
}

export class CardBasket extends Card<ICardBasket> {
    
  protected indexElement: HTMLElement;
  protected actionEvent = "basket:remove"; // событие для удаления товара из корзины

  constructor(container: HTMLElement, events: IEvents, id: string) {
    super(container, events, id);

    // Элемент для отображения индекса товара
    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", this.container);
  }

  set index(value: number) {
    this.indexElement.textContent = value.toString();
  }
}

