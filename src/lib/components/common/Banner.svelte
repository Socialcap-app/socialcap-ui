<script lang="ts">
	import { Img } from 'flowbite-svelte';
	import { pinFile } from '$lib/ipfs';
	import { createEventDispatcher } from 'svelte';
	import EditCover from './EditCover.svelte';
	const defaultImage = '/images/community-banner.svg';
	export let image: string = '';
	export let inside = 'page';
	export let isAdmin: boolean = false;
	const dispatch = createEventDispatcher();

	async function editCover(ev: any) {
		const file = ev.target.files[0];
		const ipfsHash = await pinFile({ file, keyvalues: {} });

		const IPFS_GATEWAY = import.meta.env.VITE_IPFS_GATEWAY;
		const fileUrl = `${IPFS_GATEWAY}${ipfsHash}`;

		dispatch('updateimage', { image: fileUrl });
	}
	/*
  Image sizes to make the banner look right:
  
  Full image: 2048x512 px, Aspect ratio: 0.25
  
  In page (all): 960x240 px => "w-full h-60"
  In card (mobile): 960x240 px => "w-full h-60"
  In card (desktop): 337x114 px => "w-full h-28"
  */
</script>

{#if inside === 'page'}
	<div class="relative mb-4 rounded-t-lg bg-white">
		<Img
			src={image || defaultImage}
			crossorigin={(image || '').includes('socialcap.') ? null : ''}
			class="--shadow-xl max-h-60 w-full rounded-t-lg"
		/>
		{#if isAdmin}
			<EditCover onChangeCover={editCover} />
		{/if}
	</div>
{/if}

{#if inside === 'card'}
	<div class="relative mb-0 rounded-t-lg bg-white">
		<Img
			src={image || defaultImage}
			crossorigin={(image || '').includes('socialcap.') ? null : ''}
			class="--shadow-xl max-h-48 rounded-t-lg lg:max-h-64"
		/>
		{#if isAdmin}
			<EditCover onChangeCover={editCover} />
		{/if}
	</div>
{/if}
