import { ProcessInfoInput } from '../types';

export function sortProcesses<P extends [...ProcessInfoInput, ...number[]]>(processes: Array<P>) {
	return processes.sort(
		(
			[process1Pid, process1ArrivalTime, process1BurstTime],
			[process2Pid, process2ArrivalTime, process2BurstTime]
		) => {
			const arrivalTimeDifference = process1ArrivalTime - process2ArrivalTime;

			if (arrivalTimeDifference === 0) {
				const burstTimeDifference = process1BurstTime - process2BurstTime;
				if (burstTimeDifference === 0) {
					return process1Pid < process2Pid ? -1 : 1;
				}
				return burstTimeDifference;
			}

			return arrivalTimeDifference;
		}
	);
}

export function sortProcessesByBurstTime<P extends [...ProcessInfoInput, ...number[]]>(
	processes: Array<P>
) {
	return processes.sort(
		([process1Pid, , process1BurstTime], [process2Pid, , process2BurstTime]) => {
			const burstTimeDifference = process1BurstTime - process2BurstTime;
			if (burstTimeDifference === 0) {
				return process1Pid < process2Pid ? -1 : 1;
			}
			return burstTimeDifference;
		}
	);
}
