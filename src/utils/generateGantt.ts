import { DOMWindow } from 'jsdom';
import { GanttChartItem } from '../types';
import { createElement } from './createElement';

export function generateGantt(window: DOMWindow, items: GanttChartItem[]) {
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
  }

  .gantt_chart-chunk-time_end, .gantt_chart-chunk-time_start--not_empty {
    padding: 3px;
    background-color: #ddd;
    margin-bottom: 3px;
  }
  `;
	const ganttChartContainerElement = createElement(window, 'div', ['gantt_chart-container']);

	items.forEach((item, index) => {
		let previous: GanttChartItem | null = null;
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

		const isEmpty = previous && previous.finish === start;

		createElement(
			window,
			'span',
			[
				`gantt_chart-chunk-time_start`,
				isEmpty ? 'gantt_chart-chunk-time_start--empty' : `gantt_chart-chunk-time_start--not_empty`,
			],
			isEmpty ? '' : start.toString(),
			ganttChartChunkTimeContainerElement
		);

		createElement(
			window,
			'span',
			[`gantt_chart-chunk-time_end`],
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
