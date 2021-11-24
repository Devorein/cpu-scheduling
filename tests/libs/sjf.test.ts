import { shortestJobFirst } from '../../src/libs/sjf';

it(`Should work`, () => {
	expect(
		shortestJobFirst([
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
				arrivalTime: 7,
				burstTime: 3,
				finishTime: 11,
				pid: 'P2',
				startTime: 8,
				turnaroundTime: 4,
				waitTime: 1,
			},
			{
				arrivalTime: 3,
				burstTime: 4,
				finishTime: 15,
				pid: 'P3',
				startTime: 11,
				turnaroundTime: 12,
				waitTime: 8,
			},
			{
				arrivalTime: 1,
				burstTime: 5,
				finishTime: 20,
				pid: 'P1',
				startTime: 15,
				turnaroundTime: 19,
				waitTime: 14,
			},
		],
		totalWaitTime: 23,
		totalTurnaroundTime: 43,
		averageWaitTime: 5.75,
		averageTurnaroundTime: 10.75,
	});
});
