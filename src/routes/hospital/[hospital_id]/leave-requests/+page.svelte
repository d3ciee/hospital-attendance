<script lang="ts">
	import * as Table from '$lib/ui/table';
	import * as Card from '$lib/ui/card';
	import { Button } from '$lib/ui/button';
	import { Trash2, PlusIcon, Loader2, QrCode, ThumbsUp, ThumbsDown } from 'lucide-svelte';
	import * as Dialog from '$lib/ui/dialog';
	import { Input } from '$lib/ui/input';
	import { Label } from '$lib/ui/label';
	import type { PageData, SubmitFunction } from './$types';

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/ui/select';
	import { Badge } from '$lib/ui/badge';
	import { twMerge } from 'tailwind-merge';

	export let data: PageData;

	let loading: boolean = false;
	let error: string = '';

	let isAddEmployeeModalOpen: boolean;
	let isDeleteEmployeeModalOpen: boolean;
	const onSubmit: SubmitFunction = async () => {
		error = '';
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'redirect':
					alert('Successfully completed action');
					await goto('?', {
						invalidateAll: true
					});
					break;
				case 'failure':
					error = result.data?.errors[0].message!;
					alert(error);
					break;
				case 'error':
					error = 'An error has occured.';
					alert(error);
					break;
			}
			loading = false;
		};
	};
</script>

<main class="w-full p-4">
	<Card.Root class="w-full">
		<Card.Header class="flex w-full flex-row items-center justify-between">
			<Card.Title>Leave requests</Card.Title>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Caption>A list of the pending requests.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">Name</Table.Head>
						<Table.Head>Type</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head>Details</Table.Head>
						<!-- <Table.Head>Status</Table.Head> -->
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.leaveRequests as l, i (i)}
						<Table.Row>
							<Table.Cell class="font-medium"
								>{l.employee.firstName + ' ' + l.employee.lastName}</Table.Cell
							>
							<Table.Cell>{l.type}</Table.Cell>
							<Table.Cell>{l.status}</Table.Cell>
							<Table.Cell>{l.additionalDetails}</Table.Cell>
							<Table.Cell>{l.startDate}</Table.Cell>
							<Table.Cell>{l.endDate}</Table.Cell>

							<Table.Cell class="flex gap-2">
								<form use:enhance={onSubmit} action="?/accept" method="post">
									<input type="hidden" name="employeeUId" value={l.employee.uuid} />
									<Button type="submit" size="icon" variant="outline">
										<ThumbsUp class="h-4 w-4" />
									</Button>
								</form>

								<form use:enhance={onSubmit} action="?/reject" method="post">
									<input type="hidden" name="employeeUId" value={l.employee.uuid} />
									<Button size="icon" variant="outline">
										<ThumbsDown class="h-4 w-4" />
									</Button>
								</form>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</main>
