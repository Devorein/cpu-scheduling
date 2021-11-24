import fs from 'fs';
import { JSDOM } from 'jsdom';
import { IProcessInfo, ProcessInfoInput } from '../types';
import { calculateProcessInfo, createElement, generateGantt, generateTable } from '../utils';

export function firstComeFirstServed(processInfosInput: Array<ProcessInfoInput>) {
	const sortedProcessInfosByArrivalTime = processInfosInput.sort((processInfoA, processInfoB) => {
		const arrivalTimeDifference = processInfoA[1] - processInfoB[1];
		// Sort the process with the lesser pid if there is no difference in arrival time
		if (arrivalTimeDifference === 0) {
			return processInfoA[0] < processInfoB[0] ? -1 : 1;
		}
		return arrivalTimeDifference;
	});
	return calculateProcessInfo(sortedProcessInfosByArrivalTime);
}

export function generateTableForFCFS(processInfosInput: Array<ProcessInfoInput>, filePath: string) {
	const jsdom = new JSDOM();
	const { window } = jsdom;

	const { averageTurnaroundTime, averageWaitTime, infos, totalTurnaroundTime, totalWaitTime } =
		firstComeFirstServed(processInfosInput);
	const labels: [keyof IProcessInfo, string][] = [
		['pid', 'pid'],
		['arrivalTime', 'arrival time'],
		['burstTime', 'burst time'],
		['startTime', 'start time'],
		['finishTime', 'finish time'],
		['turnaroundTime', 'turnaround time'],
		['waitTime', 'wait time'],
	];

	generateTable(jsdom.window, infos, labels);

	const styleElement = window.document.createElement('style');
	styleElement.textContent = `
  .aggregate_info-container {
    display: flex;
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

	generateGantt(
		window,
		infos.map((info) => ({ finish: info.finishTime, start: info.startTime, label: info.pid }))
	);

	fs.writeFileSync(filePath, window.document.getElementsByTagName('html')[0].innerHTML, 'utf-8');
}
