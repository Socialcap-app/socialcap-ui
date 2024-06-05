<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ForwardOutline } from 'flowbite-svelte-icons';
	import { type Credential } from '$lib/types/credential';
	import { onMount, tick } from 'svelte';
	export let credential: Credential,
		onMintClick: (credential: Credential) => void,
		isConnected: boolean = false,
		accountId = '';
	let isConnecting = false;
	let isError = false;
	let errorMessage = '';
	async function connectWallet() {
		isConnecting = true;
		try {
			const accounts: any[] = (await (window as any).mina?.requestAccounts()) || [];
			accountId = accounts[0];
			isConnecting = false;
			isConnected = true;
			await tick();
		} catch (err) {
			isError = true;
			isConnecting = false;
			isConnected = false;
			errorMessage = `${err}`;
		}
	}
</script>

<div class="flex items-center space-x-1">
	<Button size="md" color="light" class="p-2 px-4">
		Share <ForwardOutline class="ms-2 h-5 w-5" />
	</Button>
	{#if !isConnected}
		<Button color="blue" class="py-3" on:click={() => connectWallet()}>Connect</Button>
	{:else}
		<Button
			size="md"
			color="primary"
			class="p-2 px-4"
			on:click={async () => {
				onMintClick(credential);
			}}
		>
			Mint
		</Button>
	{/if}
</div>
