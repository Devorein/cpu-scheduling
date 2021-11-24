import fs from 'fs';
import { JSDOM } from 'jsdom';
import { IProcessInfo, ProcessInfoInput } from '../types';
import {
	calculateProcessInfo,
	generateGantt,
	generateSchedulingAggregation,
	generateTable,
} from '../utils';

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

export function generateDiagramForFCFS(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	const jsdom = new JSDOM();
	const { window } = jsdom;

	const firstComeFirstServedResult = firstComeFirstServed(processInfosInput);
	const labels: [keyof IProcessInfo, string][] = [
		['pid', 'pid'],
		['arrivalTime', 'arrival time'],
		['burstTime', 'burst time'],
		['startTime', 'start time'],
		['finishTime', 'finish time'],
		['turnaroundTime', 'turnaround time'],
		['waitTime', 'wait time'],
	];

	generateTable(jsdom.window, firstComeFirstServedResult.infos, labels);

	generateSchedulingAggregation(window, firstComeFirstServedResult);

	generateGantt(
		window,
		firstComeFirstServedResult.infos.map((info) => ({
			finish: info.finishTime,
			start: info.startTime,
			label: info.pid,
		}))
	);

	fs.writeFileSync(filePath, window.document.getElementsByTagName('html')[0].innerHTML, 'utf-8');
}
