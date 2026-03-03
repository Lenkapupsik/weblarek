import { ensureElement } from "../../../utils/utils";
import { Form, IForm } from "./Form";
import { IEvents } from "../../base/Events";

interface IOrderForm extends IForm {
  address: string;
  payment: string;
}

export class OrderForm extends Form<IOrderForm> {

  protected paymentContainer: HTMLElement;
  protected paymentButtons: NodeListOf<HTMLButtonElement>;
  protected addressInput: HTMLInputElement;

  protected submitEvent = 'order:submit';

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    // Контейнер кнопок оплаты
    this.paymentContainer = ensureElement<HTMLElement>(
      '.order__buttons',
      this.container
    );

    // Кнопки внутри контейнера
    this.paymentButtons =
      this.paymentContainer.querySelectorAll<HTMLButtonElement>('.button');

    // Поле адреса
    this.addressInput = ensureElement<HTMLInputElement>(
      'input[name="address"]',
      this.container
    );

    // Обработчики выбора способа оплаты
    this.paymentButtons.forEach(button => {
      button.addEventListener('click', () => {
        this.events.emit('order:payment-select', {
          payment: button.name
        });
      });
    });
  }

  set payment(value: string) {
    this.paymentButtons.forEach(button => {
      button.classList.toggle(
        'button_alt-active',
        button.name === value
      );
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }
}