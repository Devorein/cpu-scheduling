import { DOMWindow } from 'jsdom';

export function generateGantt(
	window: DOMWindow,
	items: {
		label: string;
		start: number;
		finish: number;
	}[]
) {
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
    padding: 5px;
    font-weight: bold;
    border: 2px solid #aaa;
    border-radius: 2px;
    background: #eee;
  }

  .gantt_chart-chunk-time {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
  }
  `;
	const ganttChartContainerElement = window.document.createElement('div');
	ganttChartContainerElement.classList.add('gantt_chart-container');

	items.forEach((item) => {
		const { label, start, finish } = item;
		const widthPercentage = ((finish - start) / totalTime) * 100;
		const ganttChartChunkElement = window.document.createElement('div');
		ganttChartChunkElement.classList.add('gantt_chart-chunk');
		ganttChartChunkElement.style.width = `${widthPercentage}%`;
		const ganttChartChunkLabelElement = window.document.createElement('div');
		ganttChartChunkLabelElement.textContent = label;
		ganttChartChunkLabelElement.classList.add('gantt_chart-chunk-label');

		const ganttChartChunkTimeContainerElement = window.document.createElement('div');
		ganttChartChunkTimeContainerElement.classList.add(`gantt_chart-chunk-time`);

		const ganttChartChunkStartTimeContainerElement = window.document.createElement('span');
		ganttChartChunkStartTimeContainerElement.classList.add(
			`gantt_chart-chunk-time_start`,
			`gantt_chart-chunk-time`
		);
		ganttChartChunkStartTimeContainerElement.textContent = start.toString();

		const ganttChartChunkEndTimeContainerElement = window.document.createElement('span');
		ganttChartChunkEndTimeContainerElement.classList.add(
			`gantt_chart-chunk-time_end`,
			`gantt_chart-chunk-time`
		);
		ganttChartChunkEndTimeContainerElement.textContent = finish.toString();

		ganttChartChunkTimeContainerElement.appendChild(ganttChartChunkStartTimeContainerElement);
		ganttChartChunkTimeContainerElement.appendChild(ganttChartChunkEndTimeContainerElement);

		ganttChartChunkElement.appendChild(ganttChartChunkTimeContainerElement);
		ganttChartChunkElement.appendChild(ganttChartChunkLabelElement);
		ganttChartContainerElement.appendChild(ganttChartChunkElement);
	});
	window.document.head.appendChild(styleElement);
	window.document.body.appendChild(ganttChartContainerElement);
}
