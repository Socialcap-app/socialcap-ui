<script lang="ts">
	import { type Credential, type CredentialMint } from '$lib/types/credential';
	import { Card } from 'flowbite-svelte';
	import Time from 'svelte-time';

	import { onMount } from 'svelte';
	import ProtocolAvatar from './ProtocolAvatar.svelte';

	export let data: CredentialMint;
	let clazz = '';
	export { clazz as class };

	onMount(async () => {});
</script>

<Card href={data.marketplaceUrl} target="_blank" padding="md" size="md" class={`${clazz || ''}`}>
	<div class="relative flex items-end justify-center">
		<div
			class="absolute -bottom-4 flex items-center gap-2 rounded-full border-2 border-gray-200 bg-gray-50 p-1"
		>
			<ProtocolAvatar size="xs" name={data.protocol}	 />
		</div>

		<div class="absolute right-2 top-2">
			<a
				data-sveltekit-preload-data="false"
				class="rounded-lg border-0 bg-gray-50 px-2 py-1 text-xs text-black"
				href={`${data.explorerUrl}/${data.txnHash}`}
				target="_blank"
			>
				Explore Txn
			</a>
		</div>
	</div>

	<div class="pb-4 ps-4 mt-2 pt-4">
		<h5 class="mb-2 mt-2 text-lg font-bold text-gray-900 dark:text-white">
			{data.name || ''}
		</h5>
	</div>
	<div class="px-4 pb-4">
		<div class="ms-0 mt-4 flex flex-col space-y-2 rtl:space-x-reverse">
			<div class="grid grid-cols-2 gap-1">
				<p class="text-weight-600 text-xs font-bold text-gray-500">Minted by</p>
				<p class="text-xs">{data.protocol}</p>
			</div>

			<div class="grid grid-cols-2 gap-1">
				<p class="text-weight-600 text-xs font-bold text-gray-500">Minted date</p>
				<span class="text-xs">
					<Time format="MMM DD, YYYY" timestamp={data.mintedUTC} />
				</span>
			</div>
		</div>
	</div></Card
>
