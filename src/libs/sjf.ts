import { ProcessInfoInput } from '../types';
import { calculateProcessInfo, generateDiagram } from '../utils';

export function shortestJobFirst(processInfosInput: Array<ProcessInfoInput>) {
	const sortedProcessInfosByBurstTime = processInfosInput.sort((processInfoA, processInfoB) => {
		const arrivalTimeDifference = processInfoA[2] - processInfoB[2];
		return arrivalTimeDifference;
	});
	return calculateProcessInfo(sortedProcessInfosByBurstTime);
}

export function generateDiagramForSjf(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	generateDiagram(shortestJobFirst(processInfosInput), filePath);
}
