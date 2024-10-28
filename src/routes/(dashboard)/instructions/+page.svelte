<script>
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import InstructionForm from './InstructionForm.svelte';

	let dialogOpen = $state(false);
</script>

<div class="flex flex-1 flex-row justify-between">
	<h1 class="text-2xl">Instructions</h1>

	<Button on:click={() => (dialogOpen = true)}>Add Instruction</Button>

	<InstructionForm bind:open={dialogOpen} />
</div>
