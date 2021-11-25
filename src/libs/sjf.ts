import { ProcessInfoInput } from '../types';
import { calculateProcessInfo, generateDiagram } from '../utils';

export function findFirstProcessToBeExecuted(processInfosInput: Array<ProcessInfoInput>) {
	let firstProcess: ProcessInfoInput = processInfosInput[0],
		firstProcessIndex = 0;
	for (let index = 1; index < processInfosInput.length; index += 1) {
		// Comparing the arrival time
		if (processInfosInput[index][1] < firstProcess[1]) {
			firstProcess = processInfosInput[index];
			firstProcessIndex = index;
		} else if (processInfosInput[index][1] === firstProcess[1]) {
			// Comparing the burst time
			if (processInfosInput[index][2] < firstProcess[2]) {
				firstProcess = processInfosInput[index];
				firstProcessIndex = index;
			} else if (processInfosInput[index][2] === firstProcess[2]) {
				// Comparing the process id
				firstProcess =
					processInfosInput[index][0] < firstProcess[0] ? processInfosInput[index] : firstProcess;
				firstProcessIndex = index;
			}
		}
	}

	return [firstProcess, firstProcessIndex] as const;
}

export function shortestJobFirst(processInfosInput: Array<ProcessInfoInput>) {
	const copiedProcessInfosInput: Array<ProcessInfoInput> = JSON.parse(
		JSON.stringify(processInfosInput)
	);

	const [firstProcess, firstProcessIndex] = findFirstProcessToBeExecuted(processInfosInput);

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

		let nextProcess: [string, number, number, number] = processesWithinPreviousBurstTime[0];

		for (let index = 1; index < processesWithinPreviousBurstTime.length; index += 1) {
			if (processesWithinPreviousBurstTime[index][2] < nextProcess[2]) {
				nextProcess = processesWithinPreviousBurstTime[index];
			} else if (processesWithinPreviousBurstTime[index][2] === nextProcess[2]) {
				if (processesWithinPreviousBurstTime[index][0] < nextProcess[0]) {
					nextProcess = processesWithinPreviousBurstTime[index];
				}
			}
		}

		copiedProcessInfosInput.splice(nextProcess[3], 1);
		processQueue.push([nextProcess[0], nextProcess[1], nextProcess[2]]);
	}

	return calculateProcessInfo(processQueue);
}

export function shortestJobFirstPreEmptive(processInfosInput: Array<ProcessInfoInput>) {
	const copiedProcessInfosInput: Array<ProcessInfoInput> = JSON.parse(
		JSON.stringify(processInfosInput)
	);

	const [firstProcess, firstProcessIndex] = findFirstProcessToBeExecuted(processInfosInput);
}

export function generateDiagramForSjf(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	generateDiagram(shortestJobFirst(processInfosInput), filePath);
}
