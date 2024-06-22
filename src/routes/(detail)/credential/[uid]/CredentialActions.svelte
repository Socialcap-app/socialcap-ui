<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import { ForwardOutline } from 'flowbite-svelte-icons';
	import { type Credential } from '$lib/types/credential';
	import { onMount, tick } from 'svelte';
	import { getCurrentBlockchain, getCurrentUser } from '$lib/store';
	import { simpleMintNFT } from '$lib/transactions/mint';
	import { NATSClient } from '$lib/nats';
	import { getFileImage } from '$lib/transactions/tools';
	import { makeString } from 'zkcloudworker';
	export let credential: Credential,
		isConnected: boolean = false,
		accountId = '';
	let isConnecting = false;
	let minting = false;
	let isError = false;
	let errorMessage = '';
	let usr = getCurrentUser();
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
	async function mintCredential(credential: Credential) {
		if (!isConnected) throw Error('Need a wallet to pay');
		minting = true;
		const chainId = getCurrentBlockchain().chainId;
		console.log('mintCredential', credential, 'on', chainId, 'for owner', accountId);

		let name = credential.type + '-' + credential.community;
		name = name.slice(0, 24) + makeString(5); // max 30 chars
		const image = await getFileImage(credential);
		const collection = 'socialcap';
		const description = credential.description!;
		const price = 0;
		const keys = [{ key: '', value: '', isPublic: false }];
		console.log('Name:', name, name.length);
		console.log(name, collection, description);
		const tx = await simpleMintNFT({
			name,
			image,
			collection,
			description,
			price,
			keys,
			developer: 'DFST',
			repo: 'web-mint-example'
		});
		console.log('finished minting');
		minting = false;

		NATSClient.notify('personal', {
			memo: `Mint transaction success`,
			subject: usr?.uid || '',
			type: "transaction",
			metadata: JSON.stringify({net: getCurrentBlockchain().chainId, hash: tx?.hash, type: "zk-tx" })
		}); 

		NATSClient.notify('personal', {
			memo: `<p>🎉 Your credential has been successfully minted as an NFT!</p>
    				<a href="https://testnet.minanft.io/${name}" target="_blank">View your NFT</a>`,
			subject: usr?.uid || '',
			type: "message"
		});
	
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
				mintCredential(credential);
			}}
		>
			{#if minting}
				Minting...
			{:else}
				Mint
			{/if}
		</Button>
	{/if}
</div>
