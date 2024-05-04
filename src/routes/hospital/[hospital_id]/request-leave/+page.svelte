<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/ui/button';
	import { Input } from '$lib/ui/input';
	import { Label } from '$lib/ui/label';

	import * as Select from '$lib/ui/select';
	import { Textarea } from '$lib/ui/textarea';
	import { CircleOff, Loader2, NotebookPen } from 'lucide-svelte';

	import type { PageData, SubmitFunction } from './$types';

	export let data: PageData;

	let error: string = '';
	let loading: boolean = false;

	const onSubmit: SubmitFunction = async (e) => {
		error = '';
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'redirect':
					await goto('?', {
						invalidateAll: true
					});
					break;
				case 'failure':
					error = result.data?.errors[0].message!;
					break;
				case 'error':
					error = 'An error has occured.';
					break;
			}
			loading = false;
		};
	};
</script>

{#if data.leaveRequest}
	<div class="mt-12 flex h-full w-full flex-col items-center justify-center">
		<div class="flex h-min max-w-96 flex-col items-center justify-center text-center">
			<div class="relative mb-6 flex h-36 w-36 items-center justify-center opacity-75">
				<NotebookPen class="z-40 h-20 w-20 opacity-100" />
			</div>
			<h1 class="text-xl font-bold tracking-tight">Waiting on pending leave request</h1>
			<p class="text-muted-foreground">
				There is a pending leave request. Wait for that one to expire or get accepted/rejected to
				submit another
			</p>
		</div>
	</div>
{:else}
	<div class="mx-auto flex max-w-2xl flex-col justify-center space-y-6 p-4">
		<div class="space-y-2">
			<h1 class="text-3xl font-bold">Leave Request</h1>
			<p class="text-gray-500 dark:text-gray-400">Submit your leave request below.</p>
		</div>
		<form use:enhance={onSubmit} method="post" class="space-y-4">
			<div class="grid grid-cols-2 gap-4">
				<div class="w-full space-y-2">
					<Label for="date-range">Date Range</Label>
					<div class="flex w-full items-center gap-2">
						<Input
							class="flex-1"
							id="date-range"
							name="startDate"
							placeholder="Start date"
							type="date"
						/>
						<span>-</span>
						<Input class="flex-1" name="endDate" placeholder="End date" type="date" />
					</div>
				</div>
			</div>
			<div class="space-y-2">
				<Label for="leave-type">Leave Type</Label>
				<Select.Root>
					<Select.Trigger>
						<Select.Value placeholder="Select leave type" />
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="vacation">Vacation</Select.Item>
						<Select.Item value="sick">Sick</Select.Item>
						<Select.Item value="personal">Personal</Select.Item>
						<Select.Item value="other">Other</Select.Item>
					</Select.Content>
					<Select.Input name="type" />
				</Select.Root>
			</div>
			<div class="space-y-2">
				<Label for="details">Additional Details</Label>
				<Textarea
					class="min-h-[100px]"
					id="details"
					name="additionalDetails"
					placeholder="Enter any additional details"
				/>
			</div>
			<Label class="text-destructive">
				{error}
			</Label>
			<Button disabled={loading} class="w-full" type="submit">
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4" />
				{/if}
				Submit Request</Button
			>
		</form>
	</div>
{/if}
