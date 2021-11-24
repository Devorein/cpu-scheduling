export interface IProcessInfo {
	pid: string;
	arrivalTime: number;
	burstTime: number;
	startTime: number;
	finishTime: number;
	turnaroundTime: number;
	waitTime: number;
}

export type ProcessInfoInput = [string, number, number];
