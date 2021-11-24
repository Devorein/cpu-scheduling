import { ProcessInfoInput } from '../types';
import { calculateProcessInfo, generateDiagram } from '../utils';

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

export function generateDiagramForFcfs(
	processInfosInput: Array<ProcessInfoInput>,
	filePath: string
) {
	generateDiagram(firstComeFirstServed(processInfosInput), filePath);
}
