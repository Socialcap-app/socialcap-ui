<script lang="ts">
	import { Icon } from '$lib/components';
	import EvidenceField from '$lib/components/plans/EvidenceField.svelte';
	import type { Plan } from '$lib/types';
	import { Button } from 'flowbite-svelte';

	export let plan: Plan;
    console.log("evidence", plan.evidence);
	let items = plan.evidence || [];
    let selected = 0;
    
	const EmptyField = {
		sid: '',
		required: false, // a required field
		label: '',
		description: '',
		type: 'text', // text | note | file | remark | radio | links | images // field type
		extras: {
			max: 0, // max number of chars in this field  for Text and Note fields
			allowed: null, // allowed file types for File and Image fields
			options: null // options for Radio field
		},
		id: '' // used to order fields
	};

	function addField() {
		let field = JSON.parse(JSON.stringify(EmptyField));
		field.id = crypto.randomUUID().replaceAll('-', '');
		items = [].concat(items).concat([field]);
	}

	function removeField(index) {
		items.splice(index, 1);
		items = [].concat(items);
	}
</script>

<div>
	<section>
		{#each items as item, index (item.id)}
			<div>
				{#if index === selected}
					<div class="border-3 border-warning rounded-2 mb-2 border p-4">
						<div class="text-end">
							<Button
								color="light"
								on:click={() => {
									selected = null;
								}}
							>
								<Icon name="x" />
							</Button>
						</div>
						<EvidenceField bind:field={items[index]} />
						<div class="d-flex justify-content-between">
							<Button
								outline
								color="secondary"
								on:click={() => {
									removeField(index);
								}}
							>
								<Icon name="trash-fill" /> &nbsp; Remove it
							</Button>
							<Button
								outline
								color="secondary"
								on:click={() => {
									selected = null;
								}}
							>
								<Icon name="check-lg" />
							</Button>
						</div>
					</div>
				{:else}
					<div
						class="border-secondary rounded-2 d-flex justify-content-between align-items-center mx-2 mb-2 border px-3"
					>
						<div class="lh-lg px-2 pt-3 text-start">
							<b>{item.label}</b> ({item.sid}: {item.type})
							<p class="fs-sm lh-base text-secondary">{@html item.description}</p>
						</div>
						<div class="fs-4">
							<Button
								color="light"
								on:click={() => {
									selected = index;
								}}
							>
								<Icon name="chevron-expand" />
							</Button>
						</div>
					</div>
				{/if}
			</div>
		{/each}
	</section>

	<div class="ps-2">
		<Button on:click={addField} outline size="md" class="px-3 py-2" color="secondary">
			<b>+</b> Add an evidence field
		</Button>
	</div>
</div>
