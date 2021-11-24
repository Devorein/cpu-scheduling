import { DOMWindow } from 'jsdom';

export function createElement(
	window: DOMWindow,
	elementType: keyof HTMLElementTagNameMap,
	classNames: string[],
	textContent?: string,
	parentElement?: Element
): HTMLElement {
	const element = window.document.createElement(elementType);
	classNames.forEach((className) => {
		element.classList.add(className);
	});

	if (textContent) {
		element.textContent = textContent;
	}

	if (parentElement) {
		parentElement.appendChild(element);
	}

	return element;
}
