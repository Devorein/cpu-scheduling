import { DOMWindow } from 'jsdom';
import { createElement } from './createElement';

interface Item {
	label: string;
	start: number;
	finish: number;
}

export function generateGantt(window: DOMWindow, items: Item[]) {
	const totalTime = items[items.length - 1].finish;
	const styleElement = window.document.createElement('style');
	styleElement.textContent = `
  .gantt_chart-container{
    width: 100%;
    display: flex;
  }

  .gantt_chart-chunk{
    margin: 0px 2px;
  }

  .gantt_chart-chunk-label {
    padding: 10px;
    font-weight: bold;
    border-radius: 2px;
    background: #eee;
  }

  .gantt_chart-chunk-time {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
  }
  `;
	const ganttChartContainerElement = createElement(window, 'div', ['gantt_chart-container']);

	items.forEach((item, index) => {
		let previous: Item | null = null;
		if (index !== 0) {
			previous = items[index - 1];
		}

		const { label, start, finish } = item;
		const widthPercentage = ((finish - start) / totalTime) * 100;

		const ganttChartChunkElement = createElement(window, 'div', ['gantt_chart-chunk']);
		ganttChartChunkElement.style.width = `${widthPercentage}%`;

		const ganttChartChunkLabelElement = createElement(
			window,
			'div',
			['gantt_chart-chunk-label'],
			label
		);

		const ganttChartChunkTimeContainerElement = createElement(window, 'div', [
			`gantt_chart-chunk-time`,
		]);

		createElement(
			window,
			'span',
			[`gantt_chart-chunk-time_start`, `gantt_chart-chunk-time`],
			previous && previous.finish === start ? '' : start.toString(),
			ganttChartChunkTimeContainerElement
		);

		createElement(
			window,
			'span',
			[`gantt_chart-chunk-time_end`, `gantt_chart-chunk-time`],
			finish.toString(),
			ganttChartChunkTimeContainerElement
		);

		ganttChartChunkElement.appendChild(ganttChartChunkTimeContainerElement);
		ganttChartChunkElement.appendChild(ganttChartChunkLabelElement);
		ganttChartContainerElement.appendChild(ganttChartChunkElement);
	});
	window.document.head.appendChild(styleElement);
	window.document.body.appendChild(ganttChartContainerElement);
}
