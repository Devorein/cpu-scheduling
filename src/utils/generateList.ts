import { DOMWindow } from 'jsdom';
import { createElement } from './createElement';

export function generateList(window: DOMWindow, listItems: Array<[string, string]>) {
	const styleElement = window.document.createElement('style');
	styleElement.textContent = `
  .list_container-item {
    display: flex;
    margin: 5px 0px;
  }

  .list_container-item-value {
    font-weight: bold;
    margin-left: 10px;
  }
  `;

	const listContainerElement = createElement(
		window,
		'div',
		['list_container'],
		undefined,
		window.document.body
	);

	listItems.forEach(([label, value]) => {
		const aggregateInfoContainerElement = createElement(
			window,
			'div',
			['list_container-item'],
			undefined,
			listContainerElement
		);
		createElement(window, 'p', ['list_container-item-label'], label, aggregateInfoContainerElement);
		createElement(window, 'p', ['list_container-item-value'], value, aggregateInfoContainerElement);
	});
	window.document.head.appendChild(styleElement);
}
