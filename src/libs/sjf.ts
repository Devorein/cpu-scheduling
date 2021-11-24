import fs from 'fs';
import { JSDOM } from 'jsdom';
import { IProcessInfo, ProcessInfoInput } from '../types';
import {
	calculateProcessInfo,
	generateGantt,
	generateSchedulingAggregation,
	generateTable,
} from '../utils';

export function shortestJobFirst(processInfosInput: Array<ProcessInfoInput>) {
	const sortedProcessInfosByBurstTime = processInfosInput.sort((processInfoA, processInfoB) => {
		const arrivalTimeDifference = processInfoA[2] - processInfoB[2];
		return arrivalTimeDifference;
	});
	return calculateProcessInfo(sortedProcessInfosByBurstTime);
}

export function generateDiagramForSjf(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	const jsdom = new JSDOM();
	const { window } = jsdom;

	const shortestJobFirstResult = shortestJobFirst(processInfosInput);
	const labels: [keyof IProcessInfo, string][] = [
		['pid', 'pid'],
		['arrivalTime', 'arrival time'],
		['burstTime', 'burst time'],
		['startTime', 'start time'],
		['finishTime', 'finish time'],
		['turnaroundTime', 'turnaround time'],
		['waitTime', 'wait time'],
	];

	generateTable(jsdom.window, shortestJobFirstResult.infos, labels);

	generateSchedulingAggregation(window, shortestJobFirstResult);

	generateGantt(
		window,
		shortestJobFirstResult.infos.map((info) => ({
			finish: info.finishTime,
			start: info.startTime,
			label: info.pid,
		}))
	);

	fs.writeFileSync(filePath, window.document.getElementsByTagName('html')[0].innerHTML, 'utf-8');
}
