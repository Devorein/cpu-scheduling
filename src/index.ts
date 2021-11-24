interface IProcessInfo {
	pid: string;
	arrivalTime: number;
	burstTime: number;
	startTime: number;
	finishTime: number;
	turnaroundTime: number;
	waitTime: number;
}

function firstComeFirstServed(processInfosInput: Array<[string, number, number]>) {
	const sortedProcessInfosByArrivalTime = processInfosInput.sort((processInfoA, processInfoB) => {
		const arrivalTimeDifference = processInfoA[1] - processInfoB[1];
		// Sort the process with the lesser pid if there is no difference in arrival time
		if (arrivalTimeDifference === 0) {
			return processInfoA[0] < processInfoB[0] ? -1 : 1;
		}
		return arrivalTimeDifference;
	});

	const processInfos: IProcessInfo[] = [];
	let totalWaitTime = 0;
	let totalTurnaroundTime = 0;

	sortedProcessInfosByArrivalTime.forEach(([pid, arrivalTime, burstTime], processIndex) => {
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
			const startTime = previousProcess.finishTime;
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

console.log(
	firstComeFirstServed([
		['P1', 4, 5],
		['P3', 0, 3],
		['P4', 6, 2],
		['P2', 6, 4],
		['P5', 5, 4],
	])
);
