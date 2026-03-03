import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export interface IForm {
  valid: boolean;
  errors: string;
}

export abstract class Form<T> extends Component<T & IForm> {

  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorContainer: HTMLElement;
  protected abstract submitEvent: string;

  constructor(container: HTMLElement, protected events: IEvents) {
    super(container);

    // если контейнер сам <form>, используем его
    this.form = container.tagName === 'FORM'
      ? container as HTMLFormElement
      : ensureElement<HTMLFormElement>('form', container);

    this.submitButton = ensureElement<HTMLButtonElement>('button[type="submit"]', this.form);
    this.errorContainer = ensureElement<HTMLElement>('.form__errors', this.form);

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.events.emit(this.submitEvent);
    });

    this.form.addEventListener('input', (event: Event) => {
      const target = event.target as HTMLInputElement;

      this.events.emit(`${this.submitEvent}:change`, {
        field: target.name,
        value: target.value
      });
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorContainer.textContent = value;
  }
}