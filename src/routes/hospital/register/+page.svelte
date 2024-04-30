<script lang="ts">
	import { Input } from '$lib/ui/input';
	import { Label } from '$lib/ui/label';
	import { Textarea } from '$lib/ui/textarea';
	import { Button } from '$lib/ui/button';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from './$types';
	import { goto } from '$app/navigation';
	import { Loader2 } from 'lucide-svelte';

	let error: string = '';
	let loading: boolean = false;

	const onSubmit: SubmitFunction = async ({}) => {
		loading = true;
		return ({ result }) => {
			switch (result.type) {
				case 'redirect':
					return goto(result.location);
				case 'failure':
					error = result.data?.errors[0].message!;
					document.getElementById(result.data?.errors[0].field!)?.focus();
					break;
				case 'error':
					error = 'An error occurred. Please try again later.';
					break;
			}
			loading = false;
		};
	};
</script>

<div class="mx-auto max-w-md space-y-6 py-12">
	<div class="space-y-2 text-left">
		<h1 class="text-2xl font-bold">Hospital Registration</h1>
		<p class="text-muted-foreground">
			Fill out the form to register a new hospital with the system.
		</p>
	</div>
	<form method="post" use:enhance={onSubmit} class="space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<div class="space-y-2">
				<Label for="name">Name</Label>
				<Input min="3" max="64" name="name" id="name" placeholder="Mater Dei" required />
			</div>
			<div class="space-y-2">
				<Label for="registrationId">Registration ID</Label>

				<Input
					minlength={3}
					maxlength={32}
					id="registrationId"
					name="registrationId"
					placeholder="HSP12QE124"
					required
				/>
			</div>
		</div>
		<div class="space-y-2">
			<Label for="address">Address</Label>
			<Textarea
				minlength={3}
				maxlength={128}
				name="address"
				id="address"
				placeholder="123 Main St, Anytown Zimbabwe"
				required
			/>
		</div>

		<div class="space-y-2">
			<div class="space-y-2 text-left">
				<h1 class="text-2xl font-bold">Admin</h1>
				<p class="text-muted-foreground">
					Fill out the form to add a hospital admin that will manage the hospital and its employees.
				</p>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="email">Email</Label>
					<Input name="email" id="email" type="email" placeholder="john@doe.com" required />
				</div>
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input
						minlength={3}
						maxlength={20}
						name="username"
						id="username"
						placeholder="johndoe"
						required
					/>
				</div>
			</div>
			<div class="space-y-2">
				<Label for="password">Password</Label>
				<Input
					minlength={8}
					maxlength={64}
					id="password"
					name="password"
					placeholder="********"
					required
					type="password"
				/>
			</div>
		</div>
		<Label class="text-destructive">
			{error}
		</Label>
		<div class="pt-6">
			<Button class="w-full" type="submit">
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4" />
				{/if}
				Register</Button
			>
		</div>
	</form>
</div>
