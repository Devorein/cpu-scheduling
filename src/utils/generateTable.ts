import { DOMWindow } from 'jsdom';
import { createElement } from './createElement';

export function generateTable<D extends Record<string, any>>(
	window: DOMWindow,
	rows: D[],
	cols: [keyof D, string][]
) {
	const { document } = window;

	const tableElement = document.createElement('table');
	const tableHeadElement = document.createElement('thead');
	const tableHeadRowElement = document.createElement('tr');
	const tableBodyElement = document.createElement('tbody');

	cols.forEach((col) => {
		createElement(window, 'th', [], col[1].toString(), tableHeadRowElement);
	});

	rows.forEach((row) => {
		const tableBodyRowElement = document.createElement('tr');
		cols.forEach((col) => {
			createElement(window, 'td', [], row[col[0]].toString(), tableBodyRowElement);
		});

		tableBodyElement.appendChild(tableBodyRowElement);
	});

	const styleElement = document.createElement('style');
	styleElement.textContent = `
  table {
    width: 100%;
  }
  
  th {
    padding: 10px;
    background: #ddd;
    text-transform: capitalize;
  }

  td {
    padding: 5px;
    text-align: center;
    background: #eee;
  }

  body {
    font-family: Helvetica;
  }
  `;

	tableHeadElement.appendChild(tableHeadRowElement);
	tableElement.appendChild(tableHeadElement);
	tableElement.appendChild(tableBodyElement);
	document.body.appendChild(tableElement);
	document.head.appendChild(styleElement);
}
