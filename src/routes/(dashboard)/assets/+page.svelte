<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import AssetForm from './AssetForm.svelte';

	let { data } = $props();

	let dialogOpen = $state(false);
</script>

<div class="flex flex-1 flex-row justify-between">
	<h1 class="text-2xl">Assets</h1>

	<Button on:click={() => (dialogOpen = true)}>Add Assets</Button>
</div>

{#if dialogOpen}
	<AssetForm bind:open={dialogOpen} />
{/if}
