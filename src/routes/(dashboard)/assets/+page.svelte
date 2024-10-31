<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AssetForm from './AssetForm.svelte';
	import * as Table from '$lib/components/ui/table';
	import TableFilter from '$lib/components/ui/TableFilter.svelte';

	let { data, form } = $props();

	let assets = $state(data.assets);
	$effect(() => {
		assets = data.assets;
	});
	let selectedAsset = $state<(typeof assets)[0]>();

	let dialogOpen = $state(false);

	$effect(() => {
		if (form?.form.valid) {
			dialogOpen = false;
		}
	});

	async function handleDelete(id: number) {
		const response = await fetch(`/api/assets/${id}`, {
			method: 'DELETE'
		});
		if (response.ok) {
			assets = assets.filter((i) => i.id !== id);
		}
	}

	// Sorting and filtering
	let filterBy = $state<string>('asset');
	let filter = $state<string>('');
	let orderBy = $state<string>('id');
	let order = $state<'desc' | 'asc'>('desc');

	const processedAssets = $derived(
		assets
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
	<h1 class="text-2xl">Assets</h1>

	<Button
		on:click={() => {
			selectedAsset = undefined;
			dialogOpen = true;
		}}>Add Assets</Button
	>
</div>

<TableFilter
	bind:filter
	bind:filterBy
	filterByItems={['name']}
	bind:order
	bind:orderBy
	orderByItems={['name', 'id']}
/>

<div class="mt-4">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Name</Table.Head>
				<Table.Head>File count</Table.Head>
				<Table.Head>Created By</Table.Head>
				<Table.Head>Updated By</Table.Head>
				<Table.Head></Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each processedAssets as asset}
				<Table.Row>
					<Table.Cell>{asset.name}</Table.Cell>
					<Table.Cell>{(asset.asset_file as string[]).length || 0}</Table.Cell>

					<Table.Cell>{asset.created_by.name}</Table.Cell>
					<Table.Cell>{asset.updated_by.name}</Table.Cell>
					<Table.Cell align="right">
						<Button
							variant="secondary"
							on:click={() => {
								selectedAsset = asset;
								dialogOpen = true;
							}}>Edit</Button
						>
						<Button variant="destructive" on:click={() => handleDelete(asset.id)}>Delete</Button>
					</Table.Cell>
				</Table.Row>{/each}
		</Table.Body>
	</Table.Root>
</div>

{#if dialogOpen}
	<AssetForm bind:open={dialogOpen} edit={!!selectedAsset} initialData={selectedAsset} />
{/if}
