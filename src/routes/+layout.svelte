<script lang="ts">
	import '../app.css';

	import { onMount, setContext } from 'svelte';
	import { goto } from '$app/navigation';

	let { children, data } = $props();

	let auth = $state(data);

	setContext('auth', auth);

	$effect(() => {
		if (!auth.token) {
			goto('/login');
		}
	});
</script>

<div class="container">
	{@render children()}
</div>
