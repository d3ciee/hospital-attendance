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
					//@ts-ignore
					document.getElementById(result.data?.errors[0]?.field!)?.focus();
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
	<form method="post" use:enhance={onSubmit} class="space-y-4">
		<div class="space-y-2">
			<div class="space-y-2 text-left">
				<h1 class="text-2xl font-bold">Login</h1>
				<p class="text-muted-foreground">Enter your credentials to login to the system.</p>
			</div>
			<div class="grid grid-cols-2 gap-4">
				<div class="space-y-2">
					<Label for="username">Username</Label>
					<Input name="username" id="username" type="username" placeholder="john" required />
				</div>
				<div class="space-y-2">
					<Label for="hospitalId">Hospital ID</Label>
					<Input
						minlength={3}
						maxlength={20}
						name="hospitalId"
						id="hospitalId"
						placeholder="hospitalId"
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
			<Button disabled={loading} class="w-full" type="submit">
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4" />
				{/if}
				Login</Button
			>
		</div>
	</form>
</div>
