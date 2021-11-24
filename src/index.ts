import { generateTable } from './generateTable';
import { IProcessInfo, ProcessInfoInput } from './types';

export function calculateProcessInfo(sortedProcesses: Array<ProcessInfoInput>) {
	const processInfos: IProcessInfo[] = [];
	let totalWaitTime = 0;
	let totalTurnaroundTime = 0;

	sortedProcesses.forEach(([pid, arrivalTime, burstTime], processIndex) => {
		if (processIndex === 0) {
			const turnaroundTime: number = burstTime - arrivalTime;
			processInfos.push({
				arrivalTime,
				burstTime,
				finishTime: arrivalTime + burstTime,
				pid,
				startTime: arrivalTime,
				turnaroundTime,
				waitTime: turnaroundTime - burstTime,
			});
		} else {
			const previousProcess = processInfos[processIndex - 1];
			const startTime =
				previousProcess.finishTime < arrivalTime ? arrivalTime : previousProcess.finishTime;
			const finishTime = startTime + burstTime;
			const turnaroundTime = finishTime - arrivalTime;
			processInfos.push({
				arrivalTime,
				burstTime,
				finishTime,
				pid,
				startTime,
				turnaroundTime,
				waitTime: turnaroundTime - burstTime,
			});
		}
		totalWaitTime += processInfos[processInfos.length - 1].waitTime;
		totalTurnaroundTime += processInfos[processInfos.length - 1].turnaroundTime;
	});

	return {
		info: processInfos,
		totalWaitTime,
		totalTurnaroundTime,
		averageWaitTime: totalWaitTime / processInfos.length,
		averageTurnaroundTime: totalTurnaroundTime / processInfos.length,
	};
}

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
	const firstComeFirstServedResult = firstComeFirstServed(processInfosInput);
	const labels: (keyof IProcessInfo)[] = [
		'pid',
		'arrivalTime',
		'burstTime',
		'startTime',
		'finishTime',
		'turnaroundTime',
		'waitTime',
	];

	return generateTable(firstComeFirstServedResult.info, labels, filePath);
}

export * from './generateTable';
