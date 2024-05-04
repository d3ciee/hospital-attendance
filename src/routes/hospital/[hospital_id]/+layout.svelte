<script lang="ts">
	import {
		Building,
		Clock,
		LayoutDashboard,
		MountainIcon,
		Notebook,
		NotebookPenIcon,
		SearchIcon,
		Users2
	} from 'lucide-svelte';
	import type { LayoutData } from './$types';
	import { page } from '$app/stores';
	import { twMerge } from 'tailwind-merge';
	import { Button } from '$lib/ui/button';
	import * as DropdownMenu from '$lib/ui/dropdown-menu';
	import * as Avatar from '$lib/ui/avatar';

	const icons: any = {
		dashboard: LayoutDashboard,
		departments: Building,
		employees: Users2,
		attendance: Clock,
		'employee-attendance': Clock,
		'leave-requests': NotebookPenIcon,
		'request-leave': NotebookPenIcon,
		'my-attendance': Clock
	};

	export let data: LayoutData;
	const dashboardViews = data.availableViews.map((v) => ({
		...v,
		href: `/hospital/${$page.params.hospital_id}/${v.path}`
	}));

	$: currentView = $page.url.pathname.split('/')[3];
</script>

<div class="flex h-full flex-row">
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
		<div class="bg-red flex w-full flex-1 items-end gap-4 md:ml-auto md:gap-2 lg:gap-4">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger asChild let:builder>
					<Button
						variant="secondary"
						builders={[builder]}
						class="relative h-min w-full gap-2 rounded-full p-1 pl-4"
					>
						<div class="flex flex-1 flex-col text-left opacity-90">
							<span> {data.employee?.email} </span>
						</div>
						<Avatar.Root class="dark h-6 w-6">
							<Avatar.Image src="/avatars/01.png" alt="@shadcn" />
							<Avatar.Fallback class="bg-slate-700 text-xs">
								{data.employee?.email.slice(0, 2).toUpperCase()}
							</Avatar.Fallback>
						</Avatar.Root>
					</Button>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-56" align="end">
					<DropdownMenu.Label class="font-normal">
						<div class="flex flex-col space-y-1">
							<p class="text-sm font-medium leading-none">
								{data.employee?.email}
							</p>
							<p class="text-xs capitalize leading-none text-muted-foreground">
								{data.employee?.role}
							</p>
						</div>
					</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<DropdownMenu.Item data-sveltekit-preload-data="off" href="/hospital/logout"
							>Log out</DropdownMenu.Item
						>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</aside>
	<div class="h-full w-full">
		<slot />
	</div>
</div>
