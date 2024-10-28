<script lang="ts">
	import { page } from '$app/stores';

	const { children } = $props();

	const routes = [
		{ label: 'Instructions', path: '/instructions' },
		{ label: 'Steps', path: '/steps' },
		{ label: 'Assets', path: '/assets' }
	];

	const currentRoute = $derived($page.url.pathname);
</script>

<header>
	<nav class="mt-2 border-b py-2">
		<ul class="flex flex-row">
			{#each routes as route}
				<li class="rounded-md p-2">
					<a
						class="text-foreground{currentRoute === route.path
							? ''
							: '/60'} font-bold transition-colors hover:text-foreground/80"
						href={route.path}
					>
						{route.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<div class="mt-6 flex flex-1 flex-col">
	{@render children()}
</div>
