<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import Input from '$lib/components/ui/input/input.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import { formSchema } from './schema';
	import { getContext, setContext } from 'svelte';
	import { goto } from '$app/navigation';

	const auth = getContext<{ token: string }>('auth');
	const { data } = $props();

	$effect(() => {
		if (data.token) {
			auth.token = data.token;
			setContext('auth', auth);
			goto('/instructions');
		}
	});

	const form = superForm(
		{ username: '' },
		{
			validators: zodClient(formSchema)
		}
	);

	const { form: formData, enhance } = form;
</script>

<div class="mt-24 flex flex-1 flex-col items-center">
	<h1 class="text-3xl">Login</h1>

	<form class="mt-8 w-96" use:enhance method="POST">
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input {...attrs} bind:value={$formData.username} />
			</Form.Control>
		</Form.Field>

		<Form.Button class="mt-4 w-full">Login</Form.Button>
	</form>
</div>
