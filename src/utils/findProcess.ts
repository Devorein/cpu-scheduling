import { ProcessInfoInput } from '../types';

export function findProcessByArrivalTime(processInfosInput: Array<ProcessInfoInput>) {
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

export function findProcessByBurstTime<P extends [...ProcessInfoInput, number?, number?, number?]>(
	processInfosInput: Array<P>
) {
	let firstProcess: P = processInfosInput[0],
		firstProcessIndex = 0;
	for (let index = 1; index < processInfosInput.length; index += 1) {
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

	return [firstProcess, firstProcessIndex] as const;
}

export function findProcessByPid<P extends [...ProcessInfoInput, number?, number?, number?]>(
	processes: Array<P>,
	pid: string
) {
	for (let index = 0; index < processes.length; index += 1) {
		const process = processes[index];
		if (process[0] === pid) {
			return process;
		}
	}
	return null;
}
