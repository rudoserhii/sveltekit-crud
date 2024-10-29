<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import StepForm from './StepForm.svelte';

	let { form, } = $props();

	let dialogOpen = $state(false);

	$effect(() => {
		if (form?.form.valid) {
			dialogOpen = false;
		}
	});
</script>

<div class="flex flex-1 flex-row justify-between">
	<h1 class="text-2xl">Steps</h1>

	<Button on:click={() => (dialogOpen = true)}>Add Steps</Button>
</div>

{#if dialogOpen}
	<StepForm bind:open={dialogOpen} />
{/if}
