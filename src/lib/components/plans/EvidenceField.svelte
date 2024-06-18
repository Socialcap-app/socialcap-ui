<script>
	import { Select, Input, Textarea, Label, Helper } from 'flowbite-svelte';
	export { className as class };
	let className;

	export let field = {
		sid: '',
		required: false, // a required field
		label: '',
		description: '',
		type: '', // text | note | file | remark // field type
		extras: {
			max: 0, //max number of chars in this field
			allowed: null // allowed File types
		}
	};
</script>

<div>
	<div class="row">
		<div class="col-6">
			<Label for="type" class="text-base"
				><span>Field type</span>
				<Select
					label="Type"
					items={[
						{ value: 'text', name: 'Simple text input' },
						{ value: 'note', name: 'Text note input' },
						{ value: 'radio', name: 'Radio buttons input' },
						{ value: 'checks', name: 'Check buttons input' },
						{ value: 'links', name: 'Links input' },
						{ value: 'files', name: 'File links input' },
						{ value: 'images', name: 'Image links input' },
						{ value: 'remark', name: 'Readonly remarks' }
					]}
					bind:value={field.type}
				/>
			</Label>
		</div>
		{#if field.type !== 'remark'}
			<div class="col-6">
				<Label for="sid" class="text-base"
					><span>Id</span>
					<Input type="text" invalid={!field.sid.trim()} value={field.sid} />
					<Helper class="mt-2 text-sm text-gray-500">We need an ID for this field</Helper>
				</Label>
			</div>
		{/if}
	</div>

	{#if field.type !== 'remark'}
		<Label for="label" class="text-base"
			><span>Label</span>
			<Input
				type="text"
				invalid={!field.label.trim()}
				value={field.label}
			/>
			<Helper class="mt-2 text-sm text-gray-500">We need a Label for this field</Helper>
		</Label>
	{/if}
	<Label for="description" class="text-base"
		><span>Description or content</span>
		<Textarea
			invalid={!field.description.trim()}
			value={field.description}
		/>
		<Helper class="mt-2 text-sm text-gray-500">We need a description for this field</Helper>
	</Label>

	<div class="row text-start">
		{#if field.type !== 'remark'}
			<Label for="required" class="text-base"
				><span>Is Required?</span>
				<Select
					label="Required"
					items={[
						{ value: true, name: 'Yes' },
						{ value: false, name: 'No' }
					]}
					value={field.required}
				/>
			</Label>
		{/if}

		{#if field.type === 'text' || field.type === 'note'}
			<Label for="extras.max" class="text-base"
				><span>Max text size</span>
				<Input
					type="number"
					invalid={!field.extras.max < 0}
					value={field.extras.max}
				/>
				<Helper class="mt-2 text-sm text-gray-500">Which is the max allowed text size</Helper>
			</Label>
		{/if}

		{#if field.type === 'radio'}
			<Label for="extras.options" class="text-base"
				><span>Options</span>
				<Textarea
					invalid={!field.extras.options}
					feedback="Add the options separated by comas"
					value={field.extras.options}
				/>
				<Helper class="mt-2 text-sm text-gray-500">Add the options separated by commas</Helper>
			</Label>
		{/if}

		{#if field.type === 'checks'}
			<Label for="sid" class="text-base"
				><span>Options</span>
				<Textarea invalid={!field.extras.options} value={field.extras.options} />
				<Helper class="mt-2 text-sm text-gray-500">Add the options separated by commas</Helper>
			</Label>
		{/if}

		{#if field.type === 'links'}
			<Label for="extras.max" class="text-base"
				><span>Max items</span>
				<Input type="number" invalid={!field.extras.max < 0} value={field.extras.max} />
				<Helper class="mt-2 text-sm text-gray-500">Which is the max allowed text size</Helper>
			</Label>
		{/if}

		{#if field.type === 'files' || field.type === 'images'}
			<div class="flex flex-col items-end justify-between space-y-2">
				<Label for="extras.max" class="text-base"
					><span>Max items</span>
					<Input
						label="Max items"
						type="number"
						invalid={!field.extras.max < 0}
						value={field.extras.max}
					/>
					<Helper class="mt-2 text-sm text-gray-500">Which is the max allowed text size</Helper>
				</Label>
				<Label for="extras.allowed" class="text-base"
					><span>Allowed types</span>
					<Input type="text" value={field.extras.allowed} />
					<Helper class="mt-2 text-sm text-gray-500"
						>{'Allowed ' +
							field.type +
							"types as a set of comma separated values, ex: 'svg,png,gif'"}</Helper
					>
				</Label>
			</div>
		{/if}
	</div>
</div>
