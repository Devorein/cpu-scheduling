import fs from 'fs';
import { JSDOM } from 'jsdom';
import { IAlgorithmResult, IProcessInfo } from '../types';
import { generateGantt } from './generateGantt';
import { generateSchedulingAggregation } from './generateSchedulingAggregation';
import { generateTable } from './generateTable';

export function generateDiagram(algorithmResult: IAlgorithmResult, filePath: string) {
	const jsdom = new JSDOM();
	const { window } = jsdom;

	const labels: [keyof IProcessInfo, string][] = [
		['pid', 'pid'],
		['arrivalTime', 'arrival time'],
		['burstTime', 'burst time'],
		['startTime', 'start time'],
		['finishTime', 'finish time'],
		['turnaroundTime', 'turnaround time'],
		['waitTime', 'wait time'],
	];

	generateTable(jsdom.window, algorithmResult.infos, labels);

	generateSchedulingAggregation(window, algorithmResult);

	generateGantt(
		window,
		algorithmResult.infos.map((info) => ({
			finish: info.finishTime,
			start: info.startTime,
			label: info.pid,
		}))
	);

	fs.writeFileSync(filePath, window.document.getElementsByTagName('html')[0].innerHTML, 'utf-8');
}
