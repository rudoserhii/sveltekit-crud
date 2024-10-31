<script lang="ts">
	import { Input } from './input';
	import * as Select from '$lib/components/ui/select';
	import _ from 'lodash';

	type Props = {
		filterBy: string;
		filterByItems: string[];
		filter: string;

		orderBy: string;
		orderByItems: string[];
		order: 'asc' | 'desc';
	};

	let {
		filterBy = $bindable(),
		filterByItems,
		filter = $bindable(),
		orderBy = $bindable(),
		orderByItems,
		order = $bindable()
	}: Props = $props();
</script>

<div class="flex flex-row">
	<Select.Root
		selected={{ label: _.startCase(filterBy), value: filterBy }}
		onSelectedChange={(v) => {
			if (v) {
				filterBy = v.value;
			}
		}}
	>
		<Select.Trigger>
			<Select.Value placeholder="Filter By" />
		</Select.Trigger>
		<Select.Content>
			{#each filterByItems as filter}
				<Select.Item value={filter} label={_.startCase(filter)} />
			{/each}
		</Select.Content>
	</Select.Root>
	<Input bind:value={filter} placeholder="Filter" />

	<Select.Root
		selected={{ label: _.startCase(orderBy), value: orderBy }}
		onSelectedChange={(v) => {
			if (v) {
				orderBy = v.value;
			}
		}}
	>
		<Select.Trigger>
			<Select.Value placeholder="Order By" />
		</Select.Trigger>
		<Select.Content>
			{#each orderByItems as item}
				<Select.Item value={item} label={_.startCase(item)} />
			{/each}
		</Select.Content>
	</Select.Root>

	<Select.Root
		selected={{ label: _.startCase(order), value: order }}
		onSelectedChange={(v) => {
			if (v) {
				order = v.value;
			}
		}}
	>
		<Select.Trigger>
			<Select.Value placeholder="Filter By" />
		</Select.Trigger>
		<Select.Content>
			{#each ['asc', 'desc'] as order}
				<Select.Item value={order} label={_.startCase(order)} />
			{/each}
		</Select.Content>
	</Select.Root>
</div>
