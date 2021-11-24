import { ProcessInfoInput } from '../types';
import { calculateProcessInfo, generateDiagram } from '../utils';

export function shortestJobFirst(processInfosInput: Array<ProcessInfoInput>) {
	const copiedProcessInfosInput: Array<ProcessInfoInput> = JSON.parse(
		JSON.stringify(processInfosInput)
	);

	let firstProcess: ProcessInfoInput = copiedProcessInfosInput[0],
		firstProcessIndex = 0;
	for (let index = 1; index < copiedProcessInfosInput.length; index += 1) {
		// Comparing the arrival time
		if (copiedProcessInfosInput[index][1] < firstProcess[1]) {
			firstProcess = copiedProcessInfosInput[index];
			firstProcessIndex = index;
		} else if (copiedProcessInfosInput[index][1] === firstProcess[1]) {
			// Comparing the burst time
			if (copiedProcessInfosInput[index][2] < firstProcess[2]) {
				firstProcess = copiedProcessInfosInput[index];
				firstProcessIndex = index;
			} else if (copiedProcessInfosInput[index][2] === firstProcess[2]) {
				// Comparing the process id
				firstProcess =
					copiedProcessInfosInput[index][0] < firstProcess[0]
						? copiedProcessInfosInput[index]
						: firstProcess;
				firstProcessIndex = index;
			}
		}
	}

	copiedProcessInfosInput.splice(firstProcessIndex, 1);

	const processQueue: ProcessInfoInput[] = [firstProcess];

	while (copiedProcessInfosInput.length !== 0) {
		const previousProcess: ProcessInfoInput = processQueue[processQueue.length - 1];

		const processesWithinPreviousBurstTime: [string, number, number, number][] = [];
		// Filtering the processes whose arrival time is within the burst time of the last process in queue
		copiedProcessInfosInput.forEach((copiedProcessInfoInput, index) => {
			if (copiedProcessInfoInput[1] <= previousProcess[2]) {
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

export function generateDiagramForSjf(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	generateDiagram(shortestJobFirst(processInfosInput), filePath);
}
