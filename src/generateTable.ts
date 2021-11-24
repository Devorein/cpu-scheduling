import fs from 'fs';
import { JSDOM } from 'jsdom';

export function generateTable<D extends Record<string, any>>(
	rows: D[],
	cols: (keyof D)[],
	filePath: string
) {
	const dom = new JSDOM();
	const { document } = dom.window;

	const tableElement = document.createElement('table');
	const tableHeadElement = document.createElement('thead');
	const tableHeadRowElement = document.createElement('tr');
	const tableBodyElement = document.createElement('tbody');

	cols.forEach((col) => {
		const tableHeadCellElement = document.createElement('th');
		tableHeadCellElement.textContent = col.toString();
		tableHeadRowElement.appendChild(tableHeadCellElement);
	});

	rows.forEach((row) => {
		const tableBodyRowElement = document.createElement('tr');
		cols.forEach((col) => {
			const tableBodyCellElement = document.createElement('td');
			tableBodyCellElement.textContent = row[col].toString();
			tableBodyRowElement.appendChild(tableBodyCellElement);
		});

		tableBodyElement.appendChild(tableBodyRowElement);
	});

	const styleElement = document.createElement('style');
	styleElement.textContent = `
  th {
    padding: 5px;
    background: #ddd;
    text-transform: capitalize;
  }

  td {
    padding: 5px;
    text-align: center;
    background: #eee;
  }
  `;

	tableHeadElement.appendChild(tableHeadRowElement);
	tableElement.appendChild(tableHeadElement);
	tableElement.appendChild(tableBodyElement);
	document.body.appendChild(tableElement);
	document.head.appendChild(styleElement);

	fs.writeFileSync(filePath, document.getElementsByTagName('html')[0].innerHTML, 'utf-8');
}
