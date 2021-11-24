import { firstComeFirstServed } from '../../src/libs/fcfs';

it(`Should work`, () => {
	expect(
		firstComeFirstServed([
			['P0', 0, 8],
			['P1', 1, 5],
			['P2', 7, 3],
			['P3', 3, 4],
		])
	).toStrictEqual({
		infos: [
			{
				arrivalTime: 0,
				burstTime: 8,
				finishTime: 8,
				pid: 'P0',
				startTime: 0,
				turnaroundTime: 8,
				waitTime: 0,
			},
			{
				arrivalTime: 1,
				burstTime: 5,
				finishTime: 13,
				pid: 'P1',
				startTime: 8,
				turnaroundTime: 12,
				waitTime: 7,
			},
			{
				arrivalTime: 3,
				burstTime: 4,
				finishTime: 17,
				pid: 'P3',
				startTime: 13,
				turnaroundTime: 14,
				waitTime: 10,
			},
			{
				arrivalTime: 7,
				burstTime: 3,
				finishTime: 20,
				pid: 'P2',
				startTime: 17,
				turnaroundTime: 13,
				waitTime: 10,
			},
		],
		totalWaitTime: 27,
		totalTurnaroundTime: 47,
		averageWaitTime: 6.75,
		averageTurnaroundTime: 11.75,
	});
});
