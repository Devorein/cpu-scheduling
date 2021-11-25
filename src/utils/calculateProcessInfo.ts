import { IAlgorithmResult, IProcessInfo, ProcessInfoInput } from '../types';

export function calculateProcessInfo(sortedProcesses: Array<ProcessInfoInput>): IAlgorithmResult {
	const processInfos: IProcessInfo[] = [];
	let totalWaitTime = 0;
	let totalTurnaroundTime = 0;
	let totalResponseTime = 0;

	sortedProcesses.forEach(([pid, arrivalTime, burstTime], processIndex) => {
		if (processIndex === 0) {
			const turnaroundTime: number = burstTime - arrivalTime;
			processInfos.push({
				pid,
				arrivalTime,
				burstTime,
				startTime: arrivalTime,
				finishTime: arrivalTime + burstTime,
				turnaroundTime,
				waitTime: turnaroundTime - burstTime,
				responseTime: 0,
			});
		} else {
			const previousProcess = processInfos[processIndex - 1];
			const startTime =
				previousProcess.finishTime < arrivalTime ? arrivalTime : previousProcess.finishTime;
			const finishTime = startTime + burstTime;
			const turnaroundTime = finishTime - arrivalTime;
			const waitTime = turnaroundTime - burstTime;
			processInfos.push({
				pid,
				arrivalTime,
				burstTime,
				startTime,
				finishTime,
				turnaroundTime,
				waitTime,
				responseTime: startTime - arrivalTime,
			});
		}
		totalWaitTime += processInfos[processInfos.length - 1].waitTime;
		totalTurnaroundTime += processInfos[processInfos.length - 1].turnaroundTime;
		totalResponseTime += processInfos[processInfos.length - 1].responseTime;
	});

	return {
		infos: processInfos,
		totalWaitTime,
		totalTurnaroundTime,
		averageWaitTime: totalWaitTime / processInfos.length,
		averageTurnaroundTime: totalTurnaroundTime / processInfos.length,
		totalResponseTime,
		averageResponseTime: totalResponseTime / processInfos.length,
	};
}
