import fs from 'fs';
import { JSDOM } from 'jsdom';
import { GanttChartItem, IAlgorithmResult, IProcessInfo, ProcessInfoInput } from '../types';
import {
	findProcessByBurstTime,
	generateGantt,
	generateList,
	generateTable,
	sortProcesses,
} from '../utils';

export function shortestRemainingTimeFirst(processInfosInput: Array<ProcessInfoInput>) {
	// [pid, arrival, initial burst time, remaining burst time, is complete, finish time, start time]
	const sortedProcesses: [string, number, number, number, number, number, number][] = sortProcesses<
		[string, number, number, number, number, number, number]
	>(JSON.parse(JSON.stringify(processInfosInput)));
	// Add [remaining burst time, is complete, finish time] to all processes
	sortedProcesses.forEach((sortedProcess) => {
		sortedProcess.push(...[sortedProcess[2], 0, 0, -1]);
	});

	let currentTIme = sortedProcesses[0][1];
	const processSequence: string[] = [];
	while (true) {
		const readyQueue: typeof sortedProcesses = [];
		const normalQueue: typeof sortedProcesses = [];

		for (let index = 0; index < sortedProcesses.length; index += 1) {
			const sortedProcess = sortedProcesses[index];
			const [, processArrivalTime, , , isProcessComplete] = sortedProcess;
			// If the arrival time of the process is less than or equal the current time and the process hasn't been completed
			if (processArrivalTime <= currentTIme && !isProcessComplete) {
				readyQueue.push(sortedProcess);
			} else if (!isProcessComplete) {
				normalQueue.push(sortedProcess);
			}
		}

		if (readyQueue.length === 0 && normalQueue.length === 0) {
			break;
		}

		if (readyQueue.length !== 0) {
			const [processSortedByBurstTime, processSortedByBurstTimeIndex] = findProcessByBurstTime<
				[...ProcessInfoInput, number, number, number, number]
			>(readyQueue, 3);
			if (readyQueue[processSortedByBurstTimeIndex][6] === -1) {
				readyQueue[processSortedByBurstTimeIndex][6] = currentTIme;
			}
			currentTIme += 1;
			processSequence.push(processSortedByBurstTime[0]);
			readyQueue[processSortedByBurstTimeIndex][3] -= 1;
			if (readyQueue[processSortedByBurstTimeIndex][3] === 0) {
				readyQueue[processSortedByBurstTimeIndex][4] = 1;
				readyQueue[processSortedByBurstTimeIndex][5] = currentTIme;
			}
		} else {
			if (currentTIme < normalQueue[0][1]) {
				currentTIme = normalQueue[0][1];
			}
			if (normalQueue[0][6] === -1) {
				normalQueue[0][6] = currentTIme;
			}
			currentTIme += 1;
			processSequence.push(normalQueue[0][0]);
			normalQueue[0][3] -= 1;
			if (normalQueue[0][3] === 0) {
				normalQueue[0][4] = 1;
				normalQueue[0][5] = currentTIme;
			}
		}
	}

	const processInfos: IProcessInfo[] = [];
	let totalTurnaroundTime = 0,
		totalWaitTime = 0,
		totalResponseTime = 0;
	sortedProcesses.forEach(([pid, arrivalTime, burstTime, , , finishTime, startTime]) => {
		const responseTime = startTime - arrivalTime;
		const turnaroundTime = finishTime - arrivalTime;
		const waitTime = turnaroundTime - burstTime;
		totalResponseTime += responseTime;
		totalWaitTime += waitTime;
		totalTurnaroundTime += turnaroundTime;
		processInfos.push({
			pid,
			arrivalTime,
			burstTime,
			finishTime,
			responseTime,
			startTime,
			turnaroundTime,
			waitTime,
		});
	});

	return {
		processSequence,
		algorithmResult: {
			infos: processInfos,
			averageResponseTime: totalResponseTime / processInfosInput.length,
			averageTurnaroundTime: totalTurnaroundTime / processInfosInput.length,
			averageWaitTime: totalWaitTime / processInfosInput.length,
			totalResponseTime,
			totalTurnaroundTime,
			totalWaitTime,
		} as IAlgorithmResult,
	};
}

export function generatedDiagramForSrtf(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	const jsdom = new JSDOM();
	const { window } = jsdom;

	const { processSequence, algorithmResult } = shortestRemainingTimeFirst(processInfosInput);

	const labels: [keyof IProcessInfo, string][] = [
		['pid', 'pid'],
		['arrivalTime', 'arrival time'],
		['burstTime', 'burst time'],
		['startTime', 'start time'],
		['finishTime', 'finish time'],
		['responseTime', 'response time'],
		['turnaroundTime', 'turnaround time'],
		['waitTime', 'wait time'],
	];

	generateTable(jsdom.window, algorithmResult.infos, labels);

	generateList(window, [
		['Total response time', algorithmResult.totalTurnaroundTime.toString()],
		['Average response time', algorithmResult.totalWaitTime.toString()],
		['Total turnaround time', algorithmResult.totalTurnaroundTime.toString()],
		['Average turnaround time', algorithmResult.averageTurnaroundTime.toString()],
		['Total wait time', algorithmResult.totalWaitTime.toString()],
		['Average wait time', algorithmResult.averageWaitTime.toString()],
	]);

	const ganttChartItems: GanttChartItem[] = [];
	const firstArrivalTime = algorithmResult.infos[0].arrivalTime;
	let previousProcessPid: string | null = null;

	for (let index = 0; index < processSequence.length; index += 1) {
		const pid = processSequence[index];
		if (previousProcessPid !== pid) {
			const newStart =
				ganttChartItems.length === 0
					? firstArrivalTime
					: ganttChartItems[ganttChartItems.length - 1]?.finish;
			ganttChartItems.push({
				finish: newStart + 1,
				start: newStart,
				label: pid,
			});
			previousProcessPid = pid;
		} else {
			ganttChartItems[ganttChartItems.length - 1].finish += 1;
		}
	}

	generateGantt(window, ganttChartItems);

	fs.writeFileSync(filePath, window.document.getElementsByTagName('html')[0].innerHTML, 'utf-8');
}
