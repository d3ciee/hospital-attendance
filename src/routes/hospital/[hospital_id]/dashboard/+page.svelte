<script lang="ts">
	import { Badge } from '$lib/ui/badge';
	import * as Card from '$lib/ui/card';
	import type { PageData } from './$types';

	import { Line } from 'svelte-chartjs';

	export let data: PageData;

	const datam: any = {
		labels: data.countsArray.map((x) => ''),
		datasets: [
			{
				label: 'Attendance',
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(184, 185, 210, .3)',
				borderColor: 'rgb(35, 26, 136)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgb(35, 26, 136)',
				pointBackgroundColor: 'rgb(255, 255, 255)',
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: 'rgba(220, 220, 220, 1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: data.countsArray
			}
		]
	};

	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(Title, Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);
</script>

<main class="grid flex-1 grid-cols-1 gap-6 p-6 md:p-10">
	<div class="grid gap-6">
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Total employees</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">{data.sums.total}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">On time</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{data.sums.present}
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Late arrivals</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{data.sums.late}
					</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">Absent</Card.Title>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">
						{data.sums.total - (data.sums.late + data.sums.present)}
					</div>
				</Card.Content>
			</Card.Root>
		</div>
		<div class="grid gap-6">
			<Card.Root>
				<Card.Header>
					<Card.Title>Attendance Overview</Card.Title>
				</Card.Header>
				<Card.Content>
					<Line
						data={datam}
						class="aspect-[16/9] h-3/4"
						options={{
							responsive: true,
							plugins: {
								legend: {
									display: false
								},
								title: {
									display: false
								}
							}
						}}
					/>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</main>
