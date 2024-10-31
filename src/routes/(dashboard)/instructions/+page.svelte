<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import InstructionForm from './InstructionForm.svelte';
	import * as Table from '$lib/components/ui/table';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';

	let { data, form } = $props();

	let instructions = $state(data.instructions);

	let selectedInstruction = $state<(typeof instructions)[0]>();

	$effect(() => {
		instructions = data.instructions;
	});

	let dialogOpen = $state(false);

	$effect(() => {
		if (form?.form.valid) {
			dialogOpen = false;
		}
	});

	async function handleDelete(id: number) {
		const response = await fetch(`/api/instructions/${id}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			instructions = instructions.filter((i) => i.id !== id);
		}
	}

	// Sorting and filtering
	let filterBy = $state<string>('title');
	let filter = $state<string>('');
	let orderBy = $state<string>('id');
	let order = $state<'desc' | 'asc'>('desc');

	const processedInstructions = $derived(
		instructions
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
	<h1 class="text-2xl">Instructions</h1>

	<Button
		on:click={() => {
			selectedInstruction = undefined;
			dialogOpen = true;
		}}>Add instruction</Button
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
				<Table.Head>Preview</Table.Head>
				<Table.Head>Created By</Table.Head>
				<Table.Head>Updated By</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each processedInstructions as instruction}
				<Table.Row>
					<Table.Cell>{instruction.title}</Table.Cell>
					<Table.Cell>{instruction.description}</Table.Cell>
					<Table.Cell>
						<img
							src={instruction.preview_file}
							class="h-12 w-12 rounded-full border object-cover"
							alt="Instruction Preview"
						/>
					</Table.Cell>
					<Table.Cell>{instruction.created_by.name}</Table.Cell>
					<Table.Cell>{instruction.updated_by.name}</Table.Cell>
					<Table.Cell align="right">
						<Button
							variant="secondary"
							on:click={() => {
								selectedInstruction = instruction;
								dialogOpen = true;
							}}>Edit</Button
						>
						<Button variant="destructive" on:click={() => handleDelete(instruction.id)}
							>Delete</Button
						>
					</Table.Cell>
				</Table.Row>{/each}
		</Table.Body>
	</Table.Root>
</div>

{#if dialogOpen}
	<InstructionForm
		bind:open={dialogOpen}
		edit={!!selectedInstruction}
		initialData={selectedInstruction}
	/>
{/if}
