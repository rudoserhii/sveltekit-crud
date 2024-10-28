<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Input from '$lib/components/ui/input/input.svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';

	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import instructionSchema from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';

	let { open = $bindable(), edit = false } = $props();

	const form = superForm({} as SuperValidated<Infer<typeof instructionSchema>>, {
		validators: zodClient(instructionSchema)
	});
	const { form: formData, enhance } = form;
</script>

<Dialog.Root bind:open={open}>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{edit ? 'Edit Instruction' : 'Add Instruction'}</Dialog.Title>
		</Dialog.Header>

		<form class="mt-8 space-y-2" use:enhance method="POST">
			<Form.Field {form} name="title">
				<Form.Control let:attrs>
					<Form.Label>Title</Form.Label>
					<Input type="text" {...attrs} bind:value={$formData.title} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="description">
				<Form.Control let:attrs>
					<Form.Label>Description</Form.Label>
					<Input type="text" {...attrs} bind:value={$formData.description} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="duration">
				<Form.Control let:attrs>
					<Form.Label>Duration</Form.Label>
					<Input type="number" {...attrs} bind:value={$formData.duration} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="preview_file">
				<Form.Control let:attrs>
					<div class="flex flex-row items-center gap-2">
						<Form.Label class={buttonVariants({ variant: 'outline' })}
							>Choose Preview File</Form.Label
						>

						<p>{$formData.preview_file || 'File not choosen'}</p>
					</div>

					<input type="file" hidden {...attrs} bind:value={$formData.preview_file} />
				</Form.Control>
			</Form.Field>
		</form>
		<Dialog.Footer>
			<Button type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
