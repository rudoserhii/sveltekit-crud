<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Form from '$lib/components/ui/form';

	import { page } from '$app/stores';

	import {
		superForm,
		type SuperValidated,
		type Infer,
		fileProxy,
		fieldProxy
	} from 'sveltekit-superforms';
	import instructionSchema from './schema';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import StepForm from '../steps/StepForm.svelte';
	import * as Select from '$lib/components/ui/select';

	type Props = {
		edit?: boolean;
		open?: boolean;
		initialData?: any;
	};
	let { open = $bindable(), edit = false, initialData = {} }: Props = $props();

	const form = superForm(
		{
			...initialData,
			assets: (initialData.instruction_assets || []).map((ia: any) => ia.asset_id)
		} as SuperValidated<Infer<typeof instructionSchema>>,
		{
			validators: zodClient(instructionSchema),
			applyAction: true,
			dataType: 'json'
		}
	);
	const { form: formData, enhance } = form;
	const file = fileProxy(form, 'preview_file');

	// steps
	let stepDialogOpen = $state(false);

	//assets
	let assets = $derived($page.data.assets);

	let selectedAsset = $state<number>();
	let selectedAssets = fieldProxy(form, 'assets');
	$selectedAssets = $selectedAssets || [];
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-[600px]">
		<Dialog.Header>
			<Dialog.Title>{edit ? 'Edit Instruction' : 'Add Instruction'}</Dialog.Title>
		</Dialog.Header>

		<form
			id="instruction-form"
			class="mt-8 space-y-2"
			use:enhance
			method="POST"
			action={edit ? `/instructions/${initialData!.id}?/update` : '/instructions'}
			enctype="multipart/form-data"
		>
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

						<p class="text-sm text-foreground/80">
							{($formData.preview_file instanceof File
								? $formData.preview_file?.name
								: $formData.preview_file) || 'File not choosen'}
						</p>
					</div>

					<input type="file" hidden {...attrs} bind:files={$file} accept="image/jpeg, image/png" />
				</Form.Control>
			</Form.Field>

			{#if edit}
				<div class="!mt-4 flex flex-row justify-between">
					<h5 class="text-lg font-bold">Steps</h5>

					<Button
						size="sm"
						on:click={() => {
							stepDialogOpen = true;
						}}>Add a step</Button
					>
				</div>
				<Table.Root>
					<Table.Header>
						<Table.Row class="text-sm">
							<Table.Head>Type</Table.Head>
							<Table.Head>Title</Table.Head>
							<Table.Head>Description</Table.Head>

							<Table.Head></Table.Head>
						</Table.Row>
					</Table.Header>

					<Table.Body>
						{#each $formData.steps || [] as step}
							<Table.Row>
								<Table.Cell>{step.type}</Table.Cell>
								<Table.Cell>{step.title}</Table.Cell>
								<Table.Cell>{step.description}</Table.Cell>

								<Table.Cell align="right">
									<Button variant="secondary" size="sm">Edit</Button>
									<Button variant="destructive" size="sm" on:click={() => {}}>Delete</Button>
								</Table.Cell>
							</Table.Row>{/each}
					</Table.Body>
				</Table.Root>

				<div class="!mt-4 flex flex-col gap-2">
					<h5 class="text-lg font-bold">Assets</h5>

					<div class="flex flex-row items-center gap-8">
						<Select.Root
							selected={selectedAsset as any}
							onSelectedChange={(v) => {
								selectedAsset = v?.value as number;
							}}
						>
							<Select.Trigger>
								<Select.Value placeholder="Select an instruction" />
							</Select.Trigger>
							<Select.Content>
								{#each assets || [] as item}
									<Select.Item value={item.id} label={item?.name} />
								{/each}
							</Select.Content>
						</Select.Root>

						<Button
							size="sm"
							on:click={() => {
								if (selectedAsset !== undefined) {
									$formData.assets = [...($formData.assets || []), selectedAsset];
									selectedAsset = undefined;
								}
							}}>Add an asset</Button
						>
					</div>

					{#each $selectedAssets || [] as asset}
						<div class="flex flex-row items-center justify-between">
							<span>{assets.find((a: any) => a.id === asset)?.name}</span>

							<Button
								size="sm"
								variant="destructive"
								on:click={() => {
									$selectedAssets = ($selectedAssets || []).filter((a: any) => a !== asset);
								}}>Delete</Button
							>
						</div>
					{/each}
				</div>
			{/if}
		</form>

		<Dialog.Footer class="mt-8">
			<Button form="instruction-form" type="submit">Save changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

{#if stepDialogOpen}
	<StepForm bind:open={stepDialogOpen} edit={false} initialData={{ instruction: initialData.id }} />
{/if}
