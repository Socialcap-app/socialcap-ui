<script lang="ts">
	import { Label, Input, Textarea, Button, Modal, Checkbox, Helper, Radio } from 'flowbite-svelte';
	import { isValid, hasMessage } from './validations';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';
	import MultiChecksField from './MultiChecksField.svelte';
	import Tags from 'svelte-tags-input';
	import Markdown from 'svelte-exmarkdown';
	import Datepicker from '../common/Datepicker.svelte';
	import NotaryForm from './NotaryForm.svelte';
	import CompositeForm from './CompositeForm.svelte';
	import type { Plan, Credential } from '$lib/types';

	export let field: any, index: number, data: any, errors: any, touched: any, communityPlans: Plan[], myCredentials: Credential[];
	const plugins = [gfmPlugin()];
	let previewOn = false;

	/** Resize textareas **/

	function initialTextareaSize(value: any) {
		let lines = (value || '').split('\n');
		// console.log("initialTextareaSize", lines, lines.length);
		return lines.length || 2;
	}

	function resizeTextarea(inner: any) {
		inner.style.height = 'auto';
		inner.style.height = 4 + inner.scrollHeight + 'px';
		// console.log("resizeTextarea height=", inner, inner.style.height);
	}
</script>

{#if data[index]}
	<div class="no-border mb-6 px-0">
		{#if field.label}
			<Label for={field.name} class="flex justify-between pb-1 text-sm font-bold text-gray-900">
				<span> {field.label}</span>{#if field.required}<span class="text-orange-400">Required</span
					>{/if}
			</Label>
		{/if}

		{#if field.type === 'text'}
			<Input
				notype="text"
				id={field.sid}
				name={field.sid}
				bind:value={data[index].value}
				size="lg"
			/>
			{#if $errors[field.sid] && $touched[field.sid]}
				<div class="text-sm text-red-500">{$errors[field.sid]}</div>
			{/if}
		{/if}

		<!-- {#if field.type === "note"}
    <textarea 
      id={field.sid} 
      name={field.sid} 
      required={field.required}
      class="border-gray-400 text-lg block rounded-md leading-relaxed w-full"
      on:input={(e) => { validateField(e); resizeTextarea(field.inner); }}
      bind:value={buffer}
      />
      <!-- bind:inner={field.inner} 
        rows={initialTextareaSize(buffer)}
        bind:value={data[index].value}
      invalid={!isValid(field, data[index].value)}
      feedback={hasMessage(field, data[index].value)} 
  {/if} -->

		{#if field.type === 'note'}
			<Textarea
				size="lg"
				id={field.sid}
				name={field.sid}
				bind:value={data[index].value}
				class="border-gray-400 py-8 text-xl"
				rows={initialTextareaSize(data[index].value)}
				bind:inner={field.inner}
			/>
			{#if $errors[field.sid] && $touched[field.sid]}
				<div class="text-sm text-red-500">{$errors[field.sid]}</div>
			{/if}
		{/if}

		{#if field.type === 'radio'}
			<div class="ms-4">
				{#each field.extras.options.split(',') as option, i}
					<Radio
						id={`rd-${option}-${i}`}
						value={option}
						name={field.sid}
						bind:group={data[index].value}
						class="mt-1 px-2 py-1">{option}</Radio
					>
				{/each}
			</div>
			{#if $errors[field.sid] && $touched[field.sid]}
				<div class="text-sm text-red-500">
					<div class="text-sm text-red-500">{$errors[field.sid]}</div>
				</div>
			{/if}
		{/if}

		{#if field.type === 'checks'}
			<div class="ms-4">
				<MultiChecksField {field} bind:value={data[index].value} class="mt-1 px-2 py-1" />
			</div>
			{#if $errors[field.sid] && $touched[field.sid]}
				<div class="text-sm text-red-500">
					<div class="text-sm text-red-500">{$errors[field.sid]}</div>
				</div>
			{/if}
		{/if}

		{#if field.type === 'links'}
			<Tags
				addKeys={[13, 9]}
				id={field.sid}
				name={field.sid}
				allowPaste={true}
				bind:tags={data[index].value}
				class="rounded-1 text-break word-wrap mb-1  px-2 py-1"
			/>
			{#if $errors[field.sid] && $touched[field.sid]}
				<div class="text-sm text-red-500">
					<div class="text-sm text-red-500">{$errors[field.sid]}</div>
				</div>
			{/if}
		{/if}

		{#if field.type === 'files'}
			<Tags
				addKeys={[13, 9]}
				id={field.sid}
				name={field.sid}
				allowPaste={true}
				bind:tags={data[index].value}
				class="rounded-1 mb-1 px-2 py-1"
			/>
			{#if $errors[field.sid] && $touched[field.sid]}
				<div class="text-sm text-red-500">
					<div class="text-sm text-red-500">{$errors[field.sid]}</div>
				</div>
			{/if}
		{/if}

		{#if field.type === 'images'}
			<Tags
				addKeys={[13, 9]}
				id={field.sid}
				name={field.sid}
				allowPaste={true}
				bind:tags={data[index].value}
				class="rounded-1 mb-1 px-2"
			/>
			{#if $errors[field.sid] && $touched[field.sid]}
				<div class="text-sm text-red-500">
					<div class="text-sm text-red-500">{$errors[field.sid]}</div>
				</div>
			{/if}
		{/if}

		{#if field.type === 'notary'}
			<div
				class="block -full rounded-lg border-gray-300 bg-gray-100 p-4 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right"
			>
				<NotaryForm
					notaryType={field.extras.notaryType}
					notaryConfig={field.extras.notaryConfig}
					bind:value={data[index].value}
				/>
				{#if $errors[field.sid]}
					<div class="text-sm text-red-500">{$errors[field.sid]}</div>
				{/if}
			</div>
		{/if}

		{#if field.type==='composite'}
			<div
				class="block -full rounded-lg border-gray-300 bg-gray-100 p-4 text-gray-900 disabled:cursor-not-allowed disabled:opacity-50 rtl:text-right"
			>
				<CompositeForm
					{communityPlans}
					{myCredentials}
					aggregatedCredential={field.extras.aggregatedCredential}
					bind:value={data[index].value}
				/>
				{#if $errors[field.sid]}
					<div class="text-sm text-red-500">{$errors[field.sid]}</div>
				{/if}
			</div>
		{/if}

		{#if field.description && field.type !== 'remark'}
			<span class="text-sm text-gray-500">
				{@html field.description}
			</span>
		{/if}

		{#if field.type === 'remark'}
			<p class="leading-relaxed text-gray-600">
				<Markdown md={field.description} {plugins} />
			</p>
		{/if}
	</div>
{/if}
