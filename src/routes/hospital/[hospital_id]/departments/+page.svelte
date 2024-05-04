<script lang="ts">
	import * as Table from '$lib/ui/table';
	import * as Card from '$lib/ui/card';
	import { Button } from '$lib/ui/button';
	import { Trash2, PlusIcon, Loader2, Info } from 'lucide-svelte';
	import * as Dialog from '$lib/ui/dialog';
	import { Input } from '$lib/ui/input';
	import { Label } from '$lib/ui/label';
	import type { PageData, SubmitFunction } from './$types';
	import { Textarea } from '$lib/ui/textarea';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { Description } from 'formsnap';

	export let data: PageData;
	let loading: boolean = false;
	let error: string = '';

	let isAddDepartmentModalOpen: boolean;
	let isDeleteDepartmentModalOpen: boolean;
	const onSubmit: SubmitFunction = async () => {
		error = '';
		loading = true;
		return async ({ result }) => {
			switch (result.type) {
				case 'redirect':
					await goto('?', {
						invalidateAll: true
					});
					isAddDepartmentModalOpen = false;
					isDeleteDepartmentModalOpen = false;
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

<main class="w-full p-4">
	<Card.Root class="w-full">
		<Card.Header class="flex w-full flex-row items-start justify-between">
			<div class="flex flex-col gap-2 pr-10">
				<Card.Title>Departments</Card.Title>
				<Card.Description class="flex">
					NB: Special departments including DP-ADMIN-x and DP-HR-x give users extra permissions
				</Card.Description>
			</div>

			<Dialog.Root bind:open={isAddDepartmentModalOpen}>
				<Dialog.Trigger let:builder>
					<Button {...builder}>
						<PlusIcon class="mr-2 h-4 w-4" />
						Add department
					</Button>
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Add department</Dialog.Title>
						<Dialog.Description>Enter the departments details to continue.</Dialog.Description>
					</Dialog.Header>

					<form use:enhance={onSubmit} method="post" action="?/create">
						<div class="grid gap-4 py-4">
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name">ID</Label>
								<Input id="id" name="id" value="DP-" class="col-span-3" required />
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name">Name</Label>
								<Input
									id="name"
									name="name"
									placeholder="Cleaning department"
									class="col-span-3"
									required
								/>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="description">Description</Label>
								<Textarea id="description" name="description" class="col-span-3" required />
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="checkInAt">Check in at</Label>
								<Input id="checkInAt" name="checkInAt" type="time" class="col-span-3" required />
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="checkInAt">Check in at</Label>
								<Input id="checkOutAt" name="checkOutAt" type="time" class="col-span-3" required />
							</div>
						</div>
						<Label class="text-destructive">
							{error}
						</Label>
						<Dialog.Footer>
							<Button disabled={loading} type="submit">
								{#if loading}
									<Loader2 class="mr-2 h-4 w-4 animate-spin duration-150" />
								{/if}
								Save changes</Button
							>
						</Dialog.Footer>
					</form>
				</Dialog.Content>
			</Dialog.Root>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Caption>A list of your departments.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">ID</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Description</Table.Head>
						<Table.Head>Check in at</Table.Head>
						<Table.Head>Check out at</Table.Head>
						<Table.Head>#Members</Table.Head>
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.departments as d, i (i)}
						<Table.Row>
							<Table.Cell class="font-medium">{d.id}</Table.Cell>
							<Table.Cell>{d.name}</Table.Cell>
							<Table.Cell>{d.description}</Table.Cell>
							<Table.Cell>{d.checkInAt}</Table.Cell>
							<Table.Cell>{d.checkOutAt}</Table.Cell>
							<Table.Cell>{d.members}</Table.Cell>
							<Table.Cell class="flex gap-2">
								<Dialog.Root>
									<Dialog.Trigger disabled={d.id === 'DP-ADMIN-1'} let:builder>
										<Button
											disabled={d.id === 'DP-ADMIN-1'}
											size="icon"
											{...builder}
											variant="destructive"
										>
											<Trash2 class="h-4 w-4" />
										</Button>
									</Dialog.Trigger>
									<Dialog.Content class="space-y-4">
										<Dialog.Header>
											<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
											<Dialog.Description>
												This action cannot be undone. This will permanently delete the department
												and its employees from our servers.
											</Dialog.Description>
											<Dialog.Footer class="pt-4">
												<Label>{error}</Label>
												<form use:enhance={onSubmit} method="post" action="?/delete">
													<input type="hidden" name="departmentUId" value={d.uuid} />
													<Button type="submit" disabled={loading} variant="destructive">
														{#if loading}
															<Loader2 class="mr-2 h-4 w-4 animate-spin duration-150" />
														{/if}
														Yes, Im sure</Button
													>
													<Button
														type="button"
														on:click={() => (isDeleteDepartmentModalOpen = false)}
														variant="outline">No, go back</Button
													>
												</form>
											</Dialog.Footer>
										</Dialog.Header>
									</Dialog.Content>
								</Dialog.Root>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</main>
