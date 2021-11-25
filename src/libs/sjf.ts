import { ProcessInfoInput } from '../types';
import {
	calculateProcessInfo,
	findProcessByArrivalTime,
	findProcessByBurstTime,
	generateDiagram,
} from '../utils';

export function shortestJobFirst(processInfosInput: Array<ProcessInfoInput>) {
	const copiedProcessInfosInput: Array<ProcessInfoInput> = JSON.parse(
		JSON.stringify(processInfosInput)
	);

	const [firstProcess, firstProcessIndex] = findProcessByArrivalTime(processInfosInput);

	copiedProcessInfosInput.splice(firstProcessIndex, 1);

	const processQueue: ProcessInfoInput[] = [firstProcess];

	while (copiedProcessInfosInput.length !== 0) {
		const processesWithinPreviousBurstTime: [string, number, number, number][] = [];
		// Filtering the processes whose arrival time is within the burst time all the processes in the queue
		copiedProcessInfosInput.forEach((copiedProcessInfoInput, index) => {
			if (
				copiedProcessInfoInput[1] <=
				processQueue.reduce(
					(currentBurstTime, currentProcessInfo) => currentBurstTime + currentProcessInfo[2],
					0
				)
			) {
				processesWithinPreviousBurstTime.push([...copiedProcessInfoInput, index]);
			}
		});

		const [nextProcess] = findProcessByBurstTime<[string, number, number, number]>(
			processesWithinPreviousBurstTime
		);
		copiedProcessInfosInput.splice(nextProcess[3], 1);
		processQueue.push([nextProcess[0], nextProcess[1], nextProcess[2]]);
	}

	return calculateProcessInfo(processQueue);
}

export function generateDiagramForSjf(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	generateDiagram(shortestJobFirst(processInfosInput), filePath);
}
