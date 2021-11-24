import { calculateProcessInfo } from '../../src/utils';

it(`Should calculate process info`, () => {
	expect(
		calculateProcessInfo([
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
				arrivalTime: 7,
				burstTime: 3,
				finishTime: 16,
				pid: 'P2',
				startTime: 13,
				turnaroundTime: 9,
				waitTime: 6,
			},
			{
				arrivalTime: 3,
				burstTime: 4,
				finishTime: 20,
				pid: 'P3',
				startTime: 16,
				turnaroundTime: 17,
				waitTime: 13,
			},
		],
		totalWaitTime: 26,
		totalTurnaroundTime: 46,
		averageWaitTime: 6.5,
		averageTurnaroundTime: 11.5,
	});
});
