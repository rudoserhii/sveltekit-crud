<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import StepForm from './StepForm.svelte';
	import * as Table from '$lib/components/ui/table';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';

	let { form, data } = $props();

	let steps = $state(data.steps);
	let selectedStep = $state<(typeof steps)[0]>();

	$effect(() => {
		steps = data.steps;
	});

	let dialogOpen = $state(false);

	$effect(() => {
		if (form?.form.valid) {
			dialogOpen = false;
		}
	});

	async function handleDelete(id: number) {
		const response = await fetch(`/api/steps/${id}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			steps = steps.filter((i) => i.id !== id);
		}
	}

	// Sorting and filtering
	let filterBy = $state<string>('title');
	let filter = $state<string>('');
	let orderBy = $state<string>('id');
	let order = $state<'desc' | 'asc'>('desc');

	const processedSteps = $derived(
		steps
			.filter((i) => ((i[filterBy as keyof typeof i] || '') as string).includes(filter))
			.sort((a, b) => {
				const aValue = (a[orderBy as keyof typeof a] || '').toString().toLowerCase();
				const bValue = (b[orderBy as keyof typeof b] || '').toString().toLowerCase();
				if (aValue < bValue) {
					return order === 'asc' ? -1 : 1;
				}
				if (aValue > bValue) {
					return order === 'asc' ? 1 : -1;
				}
				return 0;
			})
	);
</script>

<div class="flex flex-1 flex-row justify-between">
	<h1 class="text-2xl">Steps</h1>

	<Button
		on:click={() => {
			selectedStep = undefined;
			dialogOpen = true;
		}}>Add Steps</Button
	>
</div>

<TableFilter
	bind:filter
	bind:filterBy
	filterByItems={['title', 'description']}
	bind:order
	bind:orderBy
	orderByItems={['title', 'description', 'id']}
/>

<div class="mt-4">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Title</Table.Head>
				<Table.Head>Description</Table.Head>
				<Table.Cell>Type</Table.Cell>
				<Table.Head>Preview</Table.Head>
				<Table.Head>Created By</Table.Head>
				<Table.Head>Updated By</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each processedSteps as step}
				<Table.Row>
					<Table.Cell>{step.title}</Table.Cell>
					<Table.Cell>{step.description}</Table.Cell>
					<Table.Cell>{step.type}</Table.Cell>
					<Table.Cell>
						{#if step.attached_file}
							<img
								src={step.attached_file}
								class="h-12 w-12 rounded-full border object-cover"
								alt="step Preview"
							/>
						{/if}
					</Table.Cell>
					<Table.Cell>{step.created_by.name}</Table.Cell>
					<Table.Cell>{step.updated_by.name}</Table.Cell>
					<Table.Cell align="right">
						<Button
							variant="secondary"
							on:click={() => {
								selectedStep = step;
								dialogOpen = true;
							}}>Edit</Button
						>
						<Button variant="destructive" on:click={() => handleDelete(step.id)}>Delete</Button>
					</Table.Cell>
				</Table.Row>{/each}
		</Table.Body>
	</Table.Root>
</div>

{#if dialogOpen}
	<StepForm bind:open={dialogOpen} edit={!!selectedStep} initialData={selectedStep} />
{/if}
