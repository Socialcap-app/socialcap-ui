<script lang="ts">
	import Markdown from 'svelte-exmarkdown';
	import { gfmPlugin } from 'svelte-exmarkdown/gfm';

	export let field;

	const plugins = [gfmPlugin()];
</script>

<div class="fs-md m-0 p-0 text-start wrap-text">
	{#if field.type === 'text' || field.type === 'note'}
		<Markdown md={(field.value || '').replaceAll('\n', '  \n')} {plugins} />
	{/if}

	{#if field.type === 'radio'}
		{field.value || ''}
	{/if}

	{#if field.type === 'checks'}
		{#each field.value || [] as check}
			<p class="lh-sm fs-md">
				<span>{check}</span>
			</p>
		{/each}
	{/if}

	{#if field.type === 'links'}
		{#each field.value || [] as link}
			<p class="lh-sm fs-md text-break word-wrap text-blue-700">
				<a href={link}>{link} </a>
			</p>
		{/each}
	{/if}

	{#if field.type === 'files'}
		{#each field.value || [] as link}
			<p class="lh-sm fs-md text-break word-wrap">
				<a href={link} target="_blank" class="text-blue-700">
					{link}
				</a>
			</p>
		{/each}
	{/if}

	{#if field.type === 'images'}
		{#each field.value || [] as link, index}
			<p class="lh-base">
				<img alt={'image-' + index} src={link} class="img-fluid" />
			</p>
		{/each}
	{/if}
</div>

<style>
	.wrap-text {
		overflow-wrap: break-word; /* Same as word-wrap for most browsers */
	}
</style>