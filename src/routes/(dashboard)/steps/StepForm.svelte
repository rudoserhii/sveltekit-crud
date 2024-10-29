<script lang="ts">
	import { page } from '$app/stores';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';
	import * as Select from '$lib/components/ui/select';

	import { superForm, type SuperValidated, type Infer, fileProxy } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import stepSchema, { type StepSchema } from './schema';

	let { open = $bindable(), edit = false, initialData = {} } = $props();
	let instructions = $derived($page.data.instructions);

	const form = superForm(initialData as SuperValidated<Infer<StepSchema>>, {
		validators: zodClient(stepSchema),
		applyAction: true,
		dataType: 'json'
	});

	const { form: formData, enhance } = form;
	const file = fileProxy(form, 'attached_file');
	let selectedType = $derived(
		$formData.type
			? {
					label: $formData.type,
					value: $formData.type
				}
			: undefined
	);
	let selectedInstruction = $derived(
		$formData.instruction
			? {
					label: instructions.find((i) => i.id === $formData.instruction).title,
					value: $formData.instruction
				}
			: undefined
	);

	const STEP_ITEMS = [
		{
			label: 'Image',
			value: 'image'
		},
		{
			label: 'Video',
			value: 'video'
		},
		{
			label: 'PDF',
			value: 'pdf'
		},
		{
			label: 'Text',
			value: 'text'
		}
	];
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{edit ? 'Edit Step' : 'Add Step'}</Dialog.Title>
		</Dialog.Header>

		<form
			id="step-form"
			class="mt-8 space-y-2"
			use:enhance
			method="POST"
			action="/steps"
			enctype="multipart/form-data"
		>
			<Form.Field {form} name="instruction">
				<Form.Control let:attrs>
					<Form.Label>Instruction</Form.Label>
					<Select.Root
						selected={selectedInstruction}
						onSelectedChange={(v) => {
							v && ($formData.instruction = v.value);
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="Select an instruction" />
						</Select.Trigger>
						<Select.Content>
							{#each instructions as item}
								<Select.Item value={item.id} label={item.title} />
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.type} name={attrs.name} />
				</Form.Control>

				<Form.Control let:attrs>
					<Form.Label>Type</Form.Label>
					<Select.Root
						selected={selectedType}
						onSelectedChange={(v) => {
							v && ($formData.type = v.value);
						}}
					>
						<Select.Trigger {...attrs}>
							<Select.Value placeholder="Select a type of a step" />
						</Select.Trigger>
						<Select.Content>
							{#each STEP_ITEMS as item}
								<Select.Item value={item.value} label={item.label} />
							{/each}
						</Select.Content>
					</Select.Root>
					<input hidden bind:value={$formData.type} name={attrs.name} />
				</Form.Control>
			</Form.Field>

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

			<Form.Field {form} name="step_nr">
				<Form.Control let:attrs>
					<Form.Label>Step number</Form.Label>
					<Input type="number" {...attrs} bind:value={$formData.step_nr} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="attached_file">
				<Form.Control let:attrs>
					<div class="flex flex-row items-center gap-2">
						<Form.Label class={buttonVariants({ variant: 'outline' })}>Attach File</Form.Label>

						<p class="text-sm text-foreground/80">
							{($formData.attached_file instanceof File
								? $formData.attached_file?.name
								: $formData.attached_file) || 'File not choosen'}
						</p>
					</div>

					<input type="file" hidden {...attrs} bind:files={$file} />
				</Form.Control>
			</Form.Field>
		</form>

		<Dialog.Footer>
			<Button form="step-form" type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
