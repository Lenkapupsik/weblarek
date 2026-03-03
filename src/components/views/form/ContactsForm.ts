import { ensureElement } from "../../../utils/utils";
import { Form, IForm } from "./Form";
import { IEvents } from "../../base/Events";

interface IContactsForm extends IForm {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsForm> {

  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  protected submitEvent = 'contacts:submit';

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>('input[name="email"]', this.container);
    this.phoneInput = ensureElement<HTMLInputElement>('input[name="phone"]', this.container);
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}