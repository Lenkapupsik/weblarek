import { IBuyer } from '../../types';
import { EventEmitter } from '../base/Events';

export class Buyer {
  protected payment: IBuyer['payment'] | null = null;
  protected email = '';
  protected phone = '';
  protected address = '';

  constructor(protected events: EventEmitter) { }

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this.payment = data.payment;
    if (data.email !== undefined) this.email = data.email;
    if (data.phone !== undefined) this.phone = data.phone;
    if (data.address !== undefined) this.address = data.address;

  this.events.emit('buyer:change', this.getData());
  }
  
  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = '';
    this.phone = '';
    this.address = '';

    this.events.emit('buyer:clear', {
      data: this.getData(),
      errors: this.validate()
    });
  }

  validate(): Partial<Record<keyof IBuyer, string>> {
    const errors: Partial<Record<keyof IBuyer, string>> = {};

    if (!this.payment) errors.payment = 'Не выбран вид оплаты';
    if (!this.email) errors.email = 'Укажите адрес электронной почты';
    if (!this.phone) errors.phone = 'Укажите номер телефона';
    if (!this.address) errors.address = 'Укажите адрес';

    return errors;
  }
}
