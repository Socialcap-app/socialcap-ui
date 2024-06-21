<script lang="ts">
	import { Select, Input, Textarea, Label, Helper, Checkbox, Tooltip } from 'flowbite-svelte';
	import { EvidenceTypeOptions, type Evidence } from '$lib/types/plan';
	import { InfoCircleOutline } from 'flowbite-svelte-icons';
	export { className as class };
	let className;

	export let field: Evidence;
</script>

<div>
	<div class="mb-6">
		<Label for="type" class="text-base"
			><span>Field type</span>
			<Select label="Type" items={EvidenceTypeOptions} bind:value={field.type} />
		</Label>
	</div>
	{#if field.type !== 'remark'}
		<div class="flex space-x-6">
			<Label for="sid" class="w-full text-base"
				><span>ID</span>
				<Input type="text" invalid={!field.sid.trim()} bind:value={field.sid} />
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper> -->
			</Label>

			<Label for="label" class="w-full text-base"
				><span>Label</span>
				<Input type="text" invalid={!field.label.trim()} bind:value={field.label} />
				<!-- <Helper class="mt-2 text-sm text-gray-500">We need a Label for this field</Helper> -->
			</Label>
		</div>
	{/if}

	<div class="mb-6">
		<Label for="description" class="text-base"
			><span>Description or content</span>
			<Textarea invalid={!field.description.trim()} bind:value={field.description} />
			<!-- <Helper class="mt-2 text-sm text-gray-500">We need a description for this field</Helper> -->
		</Label>
	</div>
	<div class="flex items-center justify-between space-x-6">
		{#if field.type === 'text' || field.type === 'note'}
			<Label for="extras.max" class="text-base"
				><span class="flex items-center"
					>Max text size <InfoCircleOutline />
					<Tooltip>Which is the max allowed text size</Tooltip></span
				>
				<Input type="number" invalid={field.extras.max < 0} bind:value={field.extras.max} />
			</Label>
		{/if}

		{#if field.type === 'radio'}
			<Label for="extras.options" class="text-base">
				<span class="flex items-center"
					>Options <InfoCircleOutline />
					<Tooltip>Add the options separated by commas</Tooltip>
				</span>
				<Textarea invalid={!field.extras.options} bind:value={field.extras.options} />
			</Label>
		{/if}

		{#if field.type === 'checks'}
			<Label for="sid" class="text-base">
				<span class="flex items-center"
					>Options <InfoCircleOutline />
					<Tooltip>Add the options separated by commas</Tooltip>
				</span>
				<Textarea invalid={!field.extras.options} bind:value={field.extras.options} />
			</Label>
		{/if}

		{#if field.type === 'links'}
			<Label for="extras.max" class="text-base">
				<span class="flex items-center"
					>Max Items <InfoCircleOutline />
					<Tooltip>Which is the max items allowed</Tooltip>
				</span>
				<Input type="number" invalid={field.extras.max < 0} bind:value={field.extras.max} />
			</Label>
		{/if}

		{#if field.type === 'files' || field.type === 'images'}
			<Label for="extras.max" class="text-base"
				><span class="flex items-center"
					>Max Items <InfoCircleOutline />
					<Tooltip>Which is the max items allowed</Tooltip>
				</span>
				<Input
					label="Max items"
					type="number"
					invalid={field.extras.max < 0}
					bind:value={field.extras.max}
				/>
			</Label>
			<Label for="extras.allowed" class="text-base"
				><span class="flex items-center"
					>Allowed Types <InfoCircleOutline />
					<Tooltip
						>{'Allowed ' +
							field.type +
							" types as a set of comma separated values, ex: 'svg,png,gif'"}</Tooltip
					>
				</span>
				<Input type="text" bind:value={field.extras.allowed} />
			</Label>
		{/if}
		{#if field.type !== 'remark'}
			<Checkbox bind:checked={field.required}>Required</Checkbox>
		{/if}
	</div>
</div>
