import { ProcessInfoInput } from '../types';
import { findProcessByBurstTime, sortProcesses } from '../utils';

export function shortestRemainingTimeFirst(processInfosInput: Array<ProcessInfoInput>) {
	// [pid, arrival, initial burst time, remaining burst time, is complete, finish time]
	const sortedProcesses: [string, number, number, number, number, number][] = sortProcesses(
		JSON.parse(JSON.stringify(processInfosInput))
	);
	sortedProcesses.forEach((sortedProcess) => {
		sortedProcess.push(...[sortedProcess[2], 0, 0]);
	});

	let startTime = sortedProcesses[0][1];
	const processSequence: string[] = [];
	while (true) {
		const readyQueue: typeof sortedProcesses = [];
		const normalQueue: typeof sortedProcesses = [];

		for (let index = 0; index < sortedProcesses.length; index += 1) {
			const sortedProcess = sortedProcesses[index];
			const [, processArrivalTime, , , isProcessComplete] = sortedProcess;
			// If the arrival time of the process is less than or equal the current time and the process hasn't been completed
			if (processArrivalTime <= startTime && !isProcessComplete) {
				readyQueue.push(sortedProcess);
			} else if (!isProcessComplete) {
				normalQueue.push(sortedProcess);
			}
		}

		if (readyQueue.length === 0 && normalQueue.length === 0) {
			break;
		}

		if (readyQueue.length !== 0) {
			const [processSortedByBurstTime, processSortedByBurstTimeIndex] =
				findProcessByBurstTime<[...ProcessInfoInput, number, number, number]>(readyQueue);
			startTime += 1;
			processSequence.push(processSortedByBurstTime[0]);
			readyQueue[processSortedByBurstTimeIndex][3] -= 1;
			if (readyQueue[processSortedByBurstTimeIndex][3] === 0) {
				readyQueue[processSortedByBurstTimeIndex][4] = 1;
				readyQueue[processSortedByBurstTimeIndex][5] = startTime;
			}
		} else {
			if (startTime < normalQueue[0][1]) {
				startTime = normalQueue[0][1];
			}
			startTime += 1;
			processSequence.push(normalQueue[0][0]);
			normalQueue[0][3] -= 1;
			if (normalQueue[0][3] === 0) {
				normalQueue[0][4] = 1;
				normalQueue[0][5] = startTime;
			}
		}
	}

	return processSequence;
}
