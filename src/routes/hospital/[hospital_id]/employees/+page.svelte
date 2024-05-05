<script lang="ts">
	import * as Table from '$lib/ui/table';
	import * as Card from '$lib/ui/card';
	import { Button } from '$lib/ui/button';
	import { Trash2, PlusIcon, Loader2, QrCode } from 'lucide-svelte';
	import * as Dialog from '$lib/ui/dialog';
	import { Input } from '$lib/ui/input';
	import { Label } from '$lib/ui/label';
	import type { PageData, SubmitFunction } from './$types';

	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import QRCode from 'qrcode';
	import * as Select from '$lib/ui/select';
	import { onMount } from 'svelte';

	export let data: PageData;

	$: canv = undefined as any;
	let qrCode: QRCode;

	let loading: boolean = false;
	let error: string = '';

	let isAddEmployeeModalOpen: boolean;
	let isDeleteEmployeeModalOpen: boolean;

	onMount(async () => {
		qrCode = await QRCode.toCanvas(canv, 'sample');
	});

	$: qrUrl = '';

	const onSubmit: SubmitFunction = async () => {
		error = '';
		loading = true;
		return async ({ result }) => {
			console.log(result);
			switch (result.type) {
				case 'redirect':
					await location.reload();
					// await goto('?', {
					// 	invalidateAll: true
					// });
					isAddEmployeeModalOpen = false;
					isDeleteEmployeeModalOpen = false;
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
		<Card.Header class="flex w-full flex-row items-center justify-between">
			<Card.Title>Employees</Card.Title>
			<Dialog.Root bind:open={isAddEmployeeModalOpen}>
				<Dialog.Trigger let:builder>
					<Button {...builder}>
						<PlusIcon class="mr-2 h-4 w-4" />
						Add employee
					</Button>
				</Dialog.Trigger>
				<Dialog.Content class="sm:max-w-[425px]">
					<Dialog.Header>
						<Dialog.Title>Add employee</Dialog.Title>
						<Dialog.Description>Enter the employees details to continue.</Dialog.Description>
					</Dialog.Header>
					<form use:enhance={onSubmit} method="post" action="?/create">
						<div class="grid gap-4 py-4">
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="name">ID</Label>
								<Input id="id" name="id" value="EM-" class="col-span-3" required />
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="username">Username</Label>
								<Input
									id="username"
									name="username"
									placeholder="johndoe"
									class="col-span-3"
									required
								/>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="firstName">First name</Label>
								<Input
									id="firstName"
									name="firstName"
									placeholder="John"
									class="col-span-3"
									required
								/>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="lastName">Last name</Label>
								<Input
									id="lastName"
									name="lastName"
									placeholder="doe"
									class="col-span-3"
									required
								/>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="email">Email</Label>
								<Input
									id="email"
									name="email"
									type="email"
									placeholder="johndoe@gmail.com"
									class="col-span-3"
									required
								/>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="hospitalDepartmentUId">Department</Label>
								<Select.Root>
									<Select.Trigger class="col-span-3">
										<Select.Value placeholder="Select a department" />
									</Select.Trigger>
									<Select.Content>
										<Select.Group>
											<Select.Label>Department</Select.Label>
											{#each data.departments as d}
												<Select.Item value={d.uuid} label={d.name}>{d.name}</Select.Item>
											{/each}
										</Select.Group>
									</Select.Content>
									<Select.Input name="hospitalDepartmentUId" />
								</Select.Root>
							</div>
							<div class="grid grid-cols-4 items-center gap-4">
								<Label for="password">Password</Label>
								<Input
									placeholder="********"
									id="password"
									name="password"
									type="password"
									class="col-span-3"
									required
								/>
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
				<Table.Caption>A list of your employees.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head class="w-[100px]">ID</Table.Head>
						<Table.Head>Name</Table.Head>
						<Table.Head>Email</Table.Head>
						<Table.Head>Department</Table.Head>
						<!-- <Table.Head>Status</Table.Head> -->
						<Table.Head>Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.employees as d, i (i)}
						<Table.Row>
							<Table.Cell class="font-medium">{d.id}</Table.Cell>
							<Table.Cell>{d.name}</Table.Cell>
							<Table.Cell>{d.email}</Table.Cell>
							<Table.Cell>{d.department}</Table.Cell>
							<!-- <Table.Cell>
								<Badge
									class={twMerge(
										{
											late: 'border-amber-500 !text-amber-500',
											absent: 'border-destructive !text-destructive',
											present: 'border-green-500 !text-green-500',
											'on-leave': 'border-blue-500 !text-blue-500'
										}[d.status] ?? 'border-primary'
									)}
									variant={'outline'}
								>
									{d.status}
								</Badge>
							</Table.Cell> -->

							<Table.Cell class="flex gap-2">
								<Dialog.Root>
									<Dialog.Trigger let:builder>
										<Button size="icon" {...builder} variant="destructive">
											<Trash2 class="h-4 w-4" />
										</Button>
									</Dialog.Trigger>
									<Dialog.Content class="space-y-4">
										<Dialog.Header>
											<Dialog.Title>Are you sure absolutely sure?</Dialog.Title>
											<Dialog.Description>
												This action cannot be undone. This will permanently delete the employee and
												their attendance records from our servers.
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
														on:click={() => (isDeleteEmployeeModalOpen = false)}
														variant="outline">No, go back</Button
													>
												</form>
											</Dialog.Footer>
										</Dialog.Header>
									</Dialog.Content>
								</Dialog.Root>

								<Dialog.Root>
									<Dialog.Trigger let:builder>
										<Button
											on:click={() => {
												QRCode.toDataURL(
													d.uuid,
													{ errorCorrectionLevel: 'H' },
													function (err, url) {
														if (err) return err;
														qrUrl = url;
													}
												);
											}}
											size="icon"
											{...builder}
											variant="outline"
										>
											<QrCode class="h-4 w-4" />
										</Button>
									</Dialog.Trigger>
									<Dialog.Content class="space-y-4">
										<Dialog.Header>
											<Dialog.Title>Employee QR Code</Dialog.Title>
											<div class="flex w-full items-center justify-center pt-6">
												<img src={qrUrl} class="h-96 w-96 bg-secondary" alt="" />
											</div>
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

<!-- src="https://api.qrserver.com/v1/create-qr-code/?data={d.uuid}&size=384x384" -->
