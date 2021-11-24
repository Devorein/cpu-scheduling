import { shortestJobFirst } from '../../src/libs/sjf';

it(`Should work`, () => {
	expect(
		shortestJobFirst([
			['P2', 1, 5],
			['P3', 8, 8],
			['P1', 0, 6],
			['P4', 6, 9],
			['P5', 3, 1],
		])
	).toStrictEqual({
		infos: [
			{
				arrivalTime: 0,
				burstTime: 6,
				finishTime: 6,
				pid: 'P1',
				startTime: 0,
				turnaroundTime: 6,
				waitTime: 0,
			},
			{
				arrivalTime: 3,
				burstTime: 1,
				finishTime: 7,
				pid: 'P5',
				startTime: 6,
				turnaroundTime: 4,
				waitTime: 3,
			},
			{
				arrivalTime: 1,
				burstTime: 5,
				finishTime: 12,
				pid: 'P2',
				startTime: 7,
				turnaroundTime: 11,
				waitTime: 6,
			},
			{
				arrivalTime: 8,
				burstTime: 8,
				finishTime: 20,
				pid: 'P3',
				startTime: 12,
				turnaroundTime: 12,
				waitTime: 4,
			},
			{
				arrivalTime: 6,
				burstTime: 9,
				finishTime: 29,
				pid: 'P4',
				startTime: 20,
				turnaroundTime: 23,
				waitTime: 14,
			},
		],
		totalWaitTime: 27,
		totalTurnaroundTime: 56,
		averageWaitTime: 5.4,
		averageTurnaroundTime: 11.2,
	});
});
