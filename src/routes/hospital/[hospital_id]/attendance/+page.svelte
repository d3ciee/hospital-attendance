<script lang="ts">
	import * as Table from '$lib/ui/table';
	import * as Card from '$lib/ui/card';
	import { Button } from '$lib/ui/button';
	import { LogIn, LogOut } from 'lucide-svelte';
	import * as Dialog from '$lib/ui/dialog';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { Html5Qrcode, type Html5QrcodeResult } from 'html5-qrcode';
	import { Badge } from '$lib/ui/badge';
	import { twMerge } from 'tailwind-merge';

	let scanning = false;

	let html5Qrcode: Html5Qrcode;

	const start = () => {
		html5Qrcode = new Html5Qrcode('reader');
		html5Qrcode.start(
			{ facingMode: 'environment' },
			{
				fps: 10,
				qrbox: { width: 250, height: 250 }
			},
			onScanSuccess,
			() => {}
		);
		scanning = true;
	};

	const stop = async () => {
		await html5Qrcode.stop();
		scanning = false;
	};

	const onScanSuccess = async (decodedText: string, decodedResult: Html5QrcodeResult) => {
		const request = await fetch(`?employeeUId=${decodedText}`, {
			method: 'POST'
		}).then((r) => r.json().then((x) => x));

		if (request.isSuccess) {
			alert('Employee checked in succesfully');
			isCheckInModalOpen = false;
			goto('?', {
				invalidateAll: true
			});

			return;
		}
		alert(request.message);
	};

	export let data: PageData;

	let isAbsentingModalOpen: boolean;

	let loading: boolean = false;
	let error: string = '';

	let isCheckInModalOpen: boolean;
</script>

<main class="w-full p-4">
	<Card.Root class="w-full">
		<Card.Header class="flex w-full flex-row items-center justify-between">
			<Card.Title>Attendance</Card.Title>
			<div class="flex gap-2">
				<!-- <Dialog.Root

					onOpenChange={(d) => {
						if (!d) stop();
					}}
					bind:open={isAbsentingModalOpen}
				>
					<Dialog.Trigger let:builder>
						<Button {...builder}>
							<LogOut class="mr-2 h-4 w-4" />
							Absent employee
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Absent employee</Dialog.Title>
							<Dialog.Description>Scan employee QR CODE to continue.</Dialog.Description>
						</Dialog.Header>
						<Dialog.Content class="flex flex-col items-center justify-center">
							<reader class="mt-6 aspect-video w-96 bg-black" id="reader" />
							{#if scanning}
								<button on:click={stop}>stop</button>
							{:else}
								<button on:click={start}>Allow camera</button>
							{/if}
						</Dialog.Content>
					</Dialog.Content>
				</Dialog.Root> -->

				<Dialog.Root
					onOpenChange={(d) => {
						if (!d) stop();
					}}
					bind:open={isCheckInModalOpen}
				>
					<Dialog.Trigger let:builder>
						<Button {...builder}>
							<LogIn class="mr-2 h-4 w-4" />
							Check in employee
						</Button>
					</Dialog.Trigger>
					<Dialog.Content class="sm:max-w-[425px]">
						<Dialog.Header>
							<Dialog.Title>Check in employee</Dialog.Title>
							<Dialog.Description>Scan employee QR CODE to continue.</Dialog.Description>
						</Dialog.Header>
						<Dialog.Content class="flex flex-col items-center justify-center">
							<reader class="mt-6 aspect-video w-96 bg-black" id="reader" />
							{#if scanning}
								<button on:click={stop}>stop</button>
							{:else}
								<button on:click={start}>Allow camera</button>
							{/if}
						</Dialog.Content>
					</Dialog.Content>
				</Dialog.Root>
			</div>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Caption>Your employees attendance.</Table.Caption>
				<Table.Header>
					<Table.Row>
						<Table.Head>Employee name</Table.Head>
						<Table.Head>Department</Table.Head>
						<Table.Head>Check in at</Table.Head>
						<Table.Head>Check out at</Table.Head>
						<Table.Head>Day</Table.Head>
						<Table.Head>Checked in at</Table.Head>
						<Table.Head>Status</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each data.attendance as a, i (i)}
						<Table.Row>
							<Table.Cell class="font-medium">{a.name}</Table.Cell>
							<Table.Cell>{a.department}</Table.Cell>
							<Table.Cell>{a.checkInAt}</Table.Cell>
							<Table.Cell>{a.checkOutAt}</Table.Cell>
							<Table.Cell>{new Date(a.checkedInAt).toLocaleDateString()}</Table.Cell>
							<Table.Cell>{new Date(a.checkedInAt).toLocaleTimeString()}</Table.Cell>
							<Table.Cell>
								<Badge
									class={twMerge(
										{
											late: 'border-amber-500 !text-amber-500',
											absent: 'border-destructive !text-destructive',
											present: 'border-green-500 !text-green-500',
											absented: 'border-blue-500 !text-blue-500'
										}[a.status] ?? 'border-primary'
									)}
									variant={'outline'}
								>
									{a.status}
								</Badge>
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</main>
