<script lang="ts">
	import { Icon } from '$lib/components';
	import EvidenceField from '$lib/components/plans/EvidenceField.svelte';
	import type { Plan } from '$lib/types';
	import type { Evidence, EvidenceExtra } from '$lib/types/plan';
	import { Button } from 'flowbite-svelte';
	import {
		TrashBinOutline,
		CheckOutline,
		AngleDownOutline,
		AngleUpOutline,
		CirclePlusSolid
	} from 'flowbite-svelte-icons';
	export let plan: Plan, communityPlans: Plan[];
	let selected: number | undefined = undefined;
	const EmptyField: Evidence = {
		sid: '',
		required: false, // a required field
		label: '',
		description: '',
		type: 'text', // text | note | file | remark | radio | links | images // field type
		extras: {
			max: 0, // max number of chars in this field  for Text and Note fields
			allowed: undefined, // allowed file types for File and Image fields
			options: undefined // options for Radio field
		},
		id: '' // used to order fields
	};

	function addField() {
		// let field = JSON.parse(JSON.stringify(EmptyField));
		let field = structuredClone(EmptyField);
		field.id = crypto.randomUUID().replaceAll('-', '');
		plan.evidence = plan.evidence.concat([field]);
		plan.evidence = plan.evidence;
		console.log('item added', plan.evidence);
	}

	function removeField(index: number) {
		plan.evidence.splice(index, 1);
		plan.evidence = plan.evidence;
		console.log('item removed', plan.evidence);
	}
</script>

{#each plan.evidence as item, index (item.id)}
	<div>
		{#if index === selected}
			<div class="mb-2 space-y-4 rounded-md border-2 border-blue-500 p-4">
				<div class="text-end">
					<Button
						color="light"
						on:click={() => {
							selected = undefined;
						}}
					>
						<AngleUpOutline />
					</Button>
				</div>
				<EvidenceField bind:field={plan.evidence[index]} plans={communityPlans.filter(x => x.uid !== plan.uid)} />
				<div class="flex justify-end">
					<Button
						color="light"
						on:click={() => {
							removeField(index);
						}}
					>
						<TrashBinOutline />
					</Button>
				</div>
			</div>
		{:else}
			<div class="border-secondary mb-2 flex justify-between rounded-md border p-4">
				<div class="px-2 pt-3 text-left leading-loose">
					<b>{item.label}</b> ({item.sid}: {item.type})
					<p class="fs-sm lh-base text-secondary">{@html item.description}</p>
				</div>
				<div>
					<Button
						color="light"
						on:click={() => {
							selected = index;
						}}
					>
						<AngleDownOutline />
					</Button>
				</div>
			</div>
		{/if}
	</div>
{/each}

<Button color="blue" class="py-3" on:click={addField}
	><CirclePlusSolid class="me-2 h-5 w-5" /> Add a field</Button
>
