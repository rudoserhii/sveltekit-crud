<script>
	import { Button } from '$lib/components/ui/button';
	import InstructionForm from './InstructionForm.svelte';
	import * as Table from '$lib/components/ui/table';

	let { data } = $props();

	let dialogOpen = $state(false);
</script>

<div class="flex flex-1 flex-row justify-between">
	<h1 class="text-2xl">Instructions</h1>

	<Button on:click={() => (dialogOpen = true)}>Add Instruction</Button>
</div>

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
			{#each data.instructions as instruction}
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
						<Button variant="secondary">Edit</Button>
						<Button variant="destructive">Delete</Button>
					</Table.Cell>
				</Table.Row>{/each}
		</Table.Body>
	</Table.Root>
</div>

<InstructionForm bind:open={dialogOpen} />
