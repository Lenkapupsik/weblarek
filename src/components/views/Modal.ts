import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {

  protected modalContainer: HTMLElement;
  protected modalContent: HTMLElement;
  protected modalButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container)

    this.modalContainer = container;
    this.modalContent = ensureElement<HTMLElement>('.modal__content', this.container);
    this.modalButton = ensureElement<HTMLButtonElement>('.modal__close', this.container);

    // Закрытие по крестику
    this.modalButton.addEventListener('click', () => this.hide());

    // Закрытие по клику вне контента
    this.modalContainer.addEventListener('click', (e) => {
      if (e.target === this.modalContainer) {
        this.hide();
      }
    });
  }

  show(): void {
    this.modalContainer.classList.add('modal_active');
    document.body.style.overflow = 'hidden'; // блокировка скролла
  }

  hide(): void {
    this.modalContainer.classList.remove('modal_active');
    document.body.style.overflow = ''; // разблокировка скролла
  }

  set content(element: HTMLElement) {
    this.modalContent.replaceChildren(element);
  }
}