<script lang="ts">
	import * as Table from '$lib/ui/table';
	import * as Card from '$lib/ui/card';
	import { Button } from '$lib/ui/button';
	import { Trash2, PlusIcon, Loader2, LogIn, LogOut } from 'lucide-svelte';
	import * as Dialog from '$lib/ui/dialog';
	import { Input } from '$lib/ui/input';
	import { Label } from '$lib/ui/label';
	import type { PageData, SubmitFunction } from './$types';
	import { Textarea } from '$lib/ui/textarea';
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';

	import { Html5Qrcode, type Html5QrcodeResult } from 'html5-qrcode';
	import { onMount } from 'svelte';

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
		const request = await fetch('?employeeUId=12', {
			method: 'POST'
		}).then((r) => r.json().then((x) => x));

		if (request.isSuccess) {
			alert('Employee checked in succesfully');
			goto('?', {
				invalidateAll: true
			});
			return;
		}
		alert(request.message);
	};

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
		<Card.Header class="flex w-full flex-row items-center justify-between">
			<Card.Title>Attendance</Card.Title>
			<div class="flex gap-2">
				<Button>
					<LogOut class="mr-2 h-4 w-4" />
					Check out employee
				</Button>
				<Dialog.Root
					onOpenChange={(d) => {
						if (!d) stop();
					}}
					bind:open={isAddDepartmentModalOpen}
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
						<Table.Head>Checked out at</Table.Head>
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
							<Table.Cell>{a.checkedInAt}</Table.Cell>
							<Table.Cell>{a.status}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</main>
