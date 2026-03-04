import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface ISuccessView {
  total: number;
}

export class SuccessView extends Component<ISuccessView> {

  protected description: HTMLElement;
  protected successButton: HTMLButtonElement;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    this.description = ensureElement<HTMLElement>(
      '.order-success__description',
      this.container
    );

    this.successButton = ensureElement<HTMLButtonElement>(
      '.order-success__close',
      this.container
    );

    this.successButton.addEventListener('click', () => {
      this.events.emit('success:close');
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}