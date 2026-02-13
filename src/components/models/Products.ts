import { IProduct } from '../../types';

export class Products {
  protected items: IProduct[] = [];
  protected previewItem: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this.items = items;
  }

  getItems(): IProduct[] {
    return this.items;
  }

  getItemById(id: string): IProduct | undefined {
    return this.items.find(item => item.id === id);
  }

  setPreviewItem(item: IProduct): void {
    this.previewItem = item;
  }

  getPreviewItem(): IProduct | null {
    return this.previewItem;
  }
}
