import { DOMWindow } from 'jsdom';
import { createElement } from './createElement';

export function generateSchedulingAggregation(
	window: DOMWindow,
	aggregations: {
		averageTurnaroundTime: number;
		averageWaitTime: number;
		totalTurnaroundTime: number;
		totalWaitTime: number;
	}
) {
	const { averageTurnaroundTime, averageWaitTime, totalTurnaroundTime, totalWaitTime } =
		aggregations;

	const styleElement = window.document.createElement('style');
	styleElement.textContent = `
  .aggregate_info-container {
    display: flex;
    margin: 5px 0px;
  }

  .aggregate_info-value {
    font-weight: bold;
    margin-left: 10px;
  }
  `;

	[
		['Total turnaround time', totalTurnaroundTime.toString()],
		['Total wait time', totalWaitTime.toString()],
		['Average turnaround time', averageTurnaroundTime.toString()],
		['Average wait time', averageWaitTime.toString()],
	].forEach(([label, value]) => {
		const aggregateInfoContainerElement = window.document.createElement('div');
		aggregateInfoContainerElement.classList.add('aggregate_info-container');

		createElement(window, 'p', ['aggregate_info-label'], label, aggregateInfoContainerElement);
		createElement(window, 'p', ['aggregate_info-value'], value, aggregateInfoContainerElement);

		window.document.body.appendChild(aggregateInfoContainerElement);
	});
	window.document.head.appendChild(styleElement);
}
