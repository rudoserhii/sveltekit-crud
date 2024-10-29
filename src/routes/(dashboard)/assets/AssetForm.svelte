<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Input from '$lib/components/ui/input/input.svelte';

	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';

	import {
		superForm,
		type SuperValidated,
		type Infer,
		filesProxy,
		fieldProxy
	} from 'sveltekit-superforms';
	import assetSchema from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';

	import _ from 'lodash';

	type Props = {
		edit?: boolean;
		open?: boolean;
		initialData?: any;
	};
	let { open = $bindable(), edit = false, initialData = {} }: Props = $props();

	const form = superForm(
		{ ...initialData, old_files: initialData.asset_file as string[] } as SuperValidated<
			Infer<typeof assetSchema>
		>,
		{
			validators: zodClient(assetSchema),
			applyAction: true,
			dataType: 'json'
		}
	);
	const { form: formData, enhance } = form;

	const files = filesProxy(form, 'new_files');
	const oldFiles = fieldProxy(form, 'old_files');

	$files = $files || [];
	$oldFiles = $oldFiles || [];
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{edit ? 'Edit asset' : 'Add asset'}</Dialog.Title>
		</Dialog.Header>

		<form
			id="asset-form"
			class="mt-8 space-y-2"
			use:enhance
			method="POST"
			action={edit ? `/assets/${initialData!.id}?/update` : '/assets'}
			enctype="multipart/form-data"
		>
			<Form.Field {form} name="name">
				<Form.Control let:attrs>
					<Form.Label>Name</Form.Label>
					<Input type="text" {...attrs} bind:value={$formData.name} />
				</Form.Control>
			</Form.Field>

			<Form.Field {form} name="new_files">
				<Form.Control let:attrs>
					<div class="flex flex-row items-center gap-2">
						<Form.Label class={buttonVariants({ variant: 'outline' })}>Add asset file</Form.Label>
					</div>

					<input type="file" hidden {...attrs} bind:files={$files} multiple={true} />
				</Form.Control>
			</Form.Field>

			<ul>
				{#each $formData.new_files || [] as asset}
					<li class="flex flex-row items-center justify-between text-sm text-foreground/80">
						<span>{asset instanceof File ? asset?.name : asset}</span>
						<Button
							variant="outline"
							size="sm"
							onclick={() => {
								$formData.new_files = ($formData.new_files || []).filter((file) => file !== asset);
							}}>Remove</Button
						>
					</li>
				{/each}

				{#each $formData.old_files || [] as asset}
					<li class="flex flex-row items-center justify-between text-sm text-foreground/80">
						<span>{asset}</span>
						<Button
							variant="outline"
							size="sm"
							onclick={() => {
								$formData.old_files = ($formData.old_files || []).filter((file) => file !== asset);
							}}>Remove</Button
						>
					</li>
				{/each}
			</ul>
		</form>

		<Dialog.Footer>
			<Button form="asset-form" type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
