import { DOMWindow } from 'jsdom';
import { createElement } from './createElement';

export function generateList(window: DOMWindow, listItems: Array<[string, string]>) {
	const styleElement = window.document.createElement('style');
	styleElement.textContent = `
  .list_container {
    padding: 5px 0px;
  }

  .list_container-item {
    display: flex;
    justify-content: space-between;
  }

  .list_container-item {
    margin-bottom: 5px;
  }

  .list_container-item-value {
    font-weight: bold;
    background-color: #ddd;
    padding: 5px 10px;
    margin: 0px 0px 0px 5px;
    font-size: 14px;
  }
  
  .list_container-item-label {
    width: 100%;
    background-color: #eee;
    padding: 5px 10px;
    margin: 0px;
    font-size: 14px;
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
