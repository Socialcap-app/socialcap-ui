<script lang="ts">
	import { onMount } from 'svelte';
	import { MetaTag } from '$lib/components';
	import CredentialDetail from './CredentialDetail.svelte';

	export let data: any;
	$: refreshOn = data.uid; 
</script>

<MetaTag path="credential" title="Socialcap" subtitle={`Credential`} description="" />

<div class="p-4">
	{#key refreshOn}
		<CredentialDetail uid={data.uid} />
	{/key}
</div>
