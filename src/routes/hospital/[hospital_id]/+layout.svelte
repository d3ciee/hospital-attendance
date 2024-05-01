<script lang="ts">
	import {
		Building,
		Clock,
		LayoutDashboard,
		MountainIcon,
		SearchIcon,
		Users2
	} from 'lucide-svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { twMerge } from 'tailwind-merge';
	import { Button } from '$lib/ui/button';

	const icons: any = {
		dashboard: LayoutDashboard,
		departments: Building,
		employees: Users2,
		attendance: Clock,
		'employee-attendance': Clock
	};

	export let data: LayoutData;
	const dashboardViews = data.availableViews.map((v) => ({
		...v,
		href: `/hospital/${$page.params.hospital_id}/${v.path}`
	}));

	$: currentView = $page.url.pathname.split('/')[3];
</script>

<div class="flex min-h-screen flex-row">
	<aside
		class="flex h-screen w-64 min-w-64 flex-col items-center bg-primary px-2 py-4 text-white shadow-md"
	>
		<div class="flex w-full items-center gap-2 text-lg font-semibold md:text-base">
			<MountainIcon class="h-6 w-6" />
			Attendance monitor
		</div>
		<nav class="mt-4 flex w-full flex-col items-start">
			{#each dashboardViews as v}
				{@const active = currentView === v.path}
				{@const icon = icons[v.path]}
				<Button
					class="dark w-full items-start justify-start"
					variant={active ? 'secondary' : 'ghost'}
					href={v.href}
				>
					{#if icon}
						<svelte:component this={icon} class="mr-2 h-4 w-4 opacity-80" />
					{/if}
					{v.name}
				</Button>
			{/each}
		</nav>
		<div class="bg-red flex w-full flex-1 items-end gap-4 md:ml-auto md:gap-2 lg:gap-4">co</div>
	</aside>

	<slot />
</div>
