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

export interface IAlgorithmResult {
	infos: IProcessInfo[];
	totalWaitTime: number;
	totalTurnaroundTime: number;
	averageWaitTime: number;
	averageTurnaroundTime: number;
}
