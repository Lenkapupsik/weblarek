import { IProduct } from '../../types';
import { EventEmitter } from '../base/Events';
import { CDN_URL } from '../../utils/constants';


export class Products {
  protected items: IProduct[] = [];
  protected previewItem: IProduct | null = null;

  constructor(protected events: EventEmitter) { }


  setItems(items: IProduct[]): void {
    this.items = items.map(item => ({
      ...item,
      image: `${CDN_URL}/${item.image.replace(/^\//, '').replace(/\.svg$/, '.png')}`
    }));

    this.events.emit('products:set', { items: this.items });
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setPreviewItem(item: IProduct): void {
    this.previewItem = item;
    this.events.emit('products:preview', { item });
  }

  getPreviewItem(): IProduct | null {
    return this.previewItem;
  }
}