import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';

export class Basket {
  protected items: IProduct[] = [];
  constructor(protected events: EventEmitter) {}

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit('basket:change', { action: 'add', item });
  }

  removeItem(id: string): void {
    const removedItem = this.items.find(i => i.id === id);
    this.items = this.items.filter(item => item.id !== id);
    this.events.emit('basket:change', { action: 'remove', item: removedItem });
  }

  clear(): void {
    this.items = [];
    this.events.emit('basket:change');
  }

  getTotalPrice(): number {
    return this.items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  }

  getItemsCount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some(item => item.id === id);
  }
}
