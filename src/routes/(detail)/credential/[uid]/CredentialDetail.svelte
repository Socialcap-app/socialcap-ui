<script lang="ts">
	import { useCreateCommunity, useGetCommunity } from '$lib/hooks/communities';
	import { onMount } from 'svelte';
	import { Avatar, Accordion, AccordionItem } from 'flowbite-svelte';
	import { getCurrentUser } from '$lib/store';
	import type { User } from '$lib/types/user';
	import Breadcrumbs from '../../../../lib/components/common/Breadcrumbs.svelte';
	import { useGetCredential, useGetCredentialOnchainData } from '$lib/hooks/credentials';
	import { ErrorOnFetch } from '$lib/components';
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import Time from 'svelte-time/Time.svelte';
	import CommunityBanner from '$lib/components/communities/CommunityBanner.svelte';
	import CredentialActions from './CredentialActions.svelte';
	import TabHeader from '$lib/components/common/TabHeader.svelte';
	import GradientAvatar from '$lib/components/common/GradientAvatar.svelte';
	import { getInitials, buildGradient } from '$lib/components/common/gradient-svg';
	import CredentialOnChainData from './CredentialOnChainData.svelte';
	import {
		MinaNFT,
		MinaNFTNameService,
		MINANFT_NAME_SERVICE_V2,
		makeString,
		api,
		RollupNFT,
		FileData,
		fetchMinaAccount,
		NameContractV2,
		MintParams,
		wallet,
		VERIFICATION_KEY_V2
	} from 'minanft';
	import { type Credential } from '$lib/types';
	import { PublicKey, PrivateKey, Signature, Field, UInt64, Mina, AccountUpdate } from 'o1js';
	import { getCurrentBlockchain } from '$lib/store';
	import { pinFile } from '$lib/ipfs';
	import { calculateSHA512 } from '$lib/sha512';
	import { serializeTransaction } from '$lib/transactions/tools';
	import { sendTransaction, signMintTransaction } from '$lib/transactions/mintNft';
	import { serializeFields } from 'zkcloudworker';

	export let uid;

	$: isConnected = false;
	let accountId = '';
	$: credential = useGetCredential(uid);
	$: community = useGetCommunity($credential.data?.communityUid!);
	$: initials = $credential.data ? getInitials($credential.data?.applicant!) : '??';
	$: dataOnChain = useGetCredentialOnchainData(uid);
	$: bannerImage = $credential.data?.banner || '/images/credentialbg.svg';
	const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;
	const MINANFT_JWT = import.meta.env.VITE_MINANFT_JWT;
	const MINAFT_DEPLOYER = import.meta.env.VITE_MINAFT_DEPLOYER;

	async function getFileImage(credential: Credential) {
		if (!credential.image) throw new Error('No image provided');
		const response = await fetch(credential.image);
		const fileName = credential.claimId;

		// Check if the response is OK
		if (!response.ok) {
			throw new Error(`Failed to fetch image from ${credential.image}: ${response.statusText}`);
		}

		// Step 2: Convert the response to a Blob
		const blob = await response.blob();

		// Step 3: Create a File object from the Blob
		return new File([blob], fileName, { type: blob.type });
	}

	async function generateNftImage(credential: Credential, file: File, name: string) {
		const chain = getCurrentBlockchain().chainId;
		return pinFile({
			file: file,
			keyvalues: {
				name,
				owner: accountId,
				contractAddress: 'B62qm5wKfuQxJaFtaA5PYrYebri9kniwhefpiMdmn4dm4R6DjquxNFT',
				chain
			}
		});
	}

	async function mintCredential(credential: Credential) {
		if (!isConnected) throw Error('Need a wallet to pay');

		const chainId = getCurrentBlockchain().chainId;
		const explorerAccountUrl = getCurrentBlockchain().explorerAccountUrl;
		console.log('mintCredential', credential, 'on', chainId, 'for owner', accountId);
		MinaNFT.minaInit(chainId);
		const contractAddress = MINANFT_NAME_SERVICE_V2;
		const name = credential.claimId + makeString(10);
		console.log('Name:', name, credential.claimId);
		const nftPrivateKey = PrivateKey.random();
		const address = nftPrivateKey.toPublicKey();

		const sender = PublicKey.fromBase58(accountId);

		// Register name
		const minanft = new api(MINANFT_JWT);
		const reserved = await minanft.reserveName({
			name,
			publicKey: accountId,
			chain: chainId,
			contract: contractAddress,
			version: 'v2'
		});
		console.log('Reserved:', reserved);

		if (
			reserved === undefined ||
			reserved.isReserved !== true ||
			reserved.signature === undefined ||
			reserved.signature === '' ||
			reserved.price === undefined ||
			(reserved.price as any)?.price === undefined
		) {
			console.error('Name is not reserved');
			return {
				success: false,
				error: 'Name is not reserved',
				reason: reserved.reason
			};
		}

		const nft = new RollupNFT({
			name,
			address,
			external_url: explorerAccountUrl + address.toBase58()
		});

		if (credential.description && credential.description !== '') {
			nft.updateText({ key: `description`, text: credential.description });
		}
		if (credential.type && credential.type !== '') {
			nft.update({ key: `collection`, value: credential.type });
		}

		console.time('calculated sha3_512');
		const image = await getFileImage(credential);
		const sha3_512 = await calculateSHA512(image);
		const ipfs = await generateNftImage(credential, image, name);

		console.log('ipfs', ipfs);
		console.log('reserved.signature', reserved.signature);
		const signature = Signature.fromBase58(reserved.signature);
		if (signature === undefined) {
			console.error('Signature is undefined');
			return;
		}

		const imageData = new FileData({
			fileRoot: Field(0),
			height: 0,
			filename: image.name.substring(0, 30),
			size: image.size,
			mimeType: image.type.substring(0, 30),
			sha3_512,
			storage: `i:${ipfs}`
		});
		nft.updateFileData({ key: `image`, type: 'image', data: imageData });

		const commitPromise = nft.prepareCommitData({ pinataJWT: PINATA_JWT });

		const zkAppAddress = PublicKey.fromBase58(MINANFT_NAME_SERVICE_V2);
		const zkApp = new NameContractV2(zkAppAddress);
		const fee = Number((await MinaNFT.fee()).toBigInt());
		const memo = 'mint';
		await fetchMinaAccount({ publicKey: sender });
		await fetchMinaAccount({ publicKey: zkAppAddress });
		console.time('prepared commit data');
		await commitPromise;
		console.timeEnd('prepared commit data');
		console.time('prepared tx');

		if (nft.storage === undefined) throw new Error('Storage is undefined');
		if (nft.metadataRoot === undefined) throw new Error('Metadata is undefined');
		const json = JSON.stringify(
			nft.toJSON({
				includePrivateData: true
			}),
			null,
			2
		);
		console.log('json', json);
		const mintParams: MintParams = {
			name: MinaNFT.stringToField(nft.name!),
			address,
			price: UInt64.from(BigInt(0 * 1e9)),
			fee: UInt64.from(BigInt((reserved.price as any)?.price * 1_000_000_000)),
			feeMaster: wallet,
			verificationKey: VERIFICATION_KEY_V2,
			signature,
			metadataParams: {
				metadata: nft.metadataRoot,
				storage: nft.storage!
			}
		};

		// const tx = await Mina.transaction({ sender, fee, memo }, async () => {
		// 	AccountUpdate.fundNewAccount(sender!);
		// 	await zkApp.mint(mintParams);
		// });

		const serializedTxn = await signMintTransaction({
			sender,
			mintParams,
			fee,
			memo,
			claimUid: credential.claimUid
		});
		console.log('serializedTxn: ', serializedTxn);

		// console.log('signing tx');
		// tx.sign([nftPrivateKey]);
		// console.log('serialized tx');
		// const serializedTransaction = serializeTransaction(tx);
		// const transaction = tx.toJSON();
		// console.log('Transaction', tx.toPretty());
		const payload = {
			serializedTxn,
			onlySign: true,
			feePayer: {
				fee: fee,
				memo: memo
			}
		};
		console.timeEnd('prepared tx');
		console.timeEnd('ready to sign');
		const txResult = await (window as any).mina?.sendTransaction(payload);
		console.log('Transaction result', txResult);
		console.time('sent transaction');
		const signedData = txResult?.signedData;
		if (signedData === undefined) {
			console.log('No signed data');
			return undefined;
		}

		const sentTx = await sendTransaction({
			serializedTransaction: serializedTxn,
			signedData,
			mintParams: serializeFields(MintParams.toFields(mintParams)),
			contractAddress
		});
		console.timeEnd('sent transaction');
		console.log('Sent transaction', sentTx);
	}
	function isWalletAvailable() {
		return typeof (window as any).mina !== 'undefined';
	}

	async function isWalletConnected() {
		console.log('checking if wallet is connected');
		if (isWalletAvailable()) {
			const accounts: any[] = (await (window as any).mina?.getAccounts()) || [];
			console.log('accounts', accounts);
			if (accounts.length) {
				accountId = accounts[0];
				return true;
			}
		}
		return false;
	}

	onMount(async () => {
		isConnected = await isWalletConnected();
		console.log('isConnected', isConnected);
	});
</script>

<div class="p-4">
	<Breadcrumbs label={$credential.data?.type || '?'} />

	<div>
		{#if $credential.isLoading || $community.isLoading || $dataOnChain.isLoading}
			<span>Loading...</span>
		{:else if $credential.isError}
			<ErrorOnFetch description="My community" error={$credential.error} />
		{:else}
			<div class="w-full max-w-screen-lg">
				<div class="relative flex items-end justify-center">
					<!-- <CommunityBanner image={$credential.data?.banner} /> -->
					<img
						src={bannerImage}
						class="fill h-auto w-full"
						alt="Credential Banner"
						crossorigin=""
					/>
					<div
						class="absolute -bottom-4 flex items-center gap-2 rounded-full border-2 border-gray-200 bg-gray-50 p-1"
					>
						<div class="w-12">
							<GradientAvatar {initials} gradient={buildGradient(initials)} />
						</div>
						<div class="max-w-64 truncate px-2 text-xs text-black dark:text-white">
							{$credential.data?.applicant}
						</div>
					</div>
				</div>

				<div class="space-y-3 px-4 pb-4 pt-3">
					<div class="flex items-center justify-between">
						<div>
							<h6 class="mb-2 mt-2 text-3xl font-bold text-gray-900 dark:text-white">
								{$credential.data?.type}
							</h6>
							<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
								{$credential.data?.description}
							</p>
						</div>
					</div>
					{#if $credential.data}
						<div class="flex items-center justify-end">
							<CredentialActions
								credential={$credential?.data}
								onMintClick={mintCredential}
								{isConnected}
								{accountId}
							/>
						</div>
					{/if}
					<div class="px-4 pb-4 pt-2">
						<div class="ms-0 mt-4 flex items-center justify-between rtl:space-x-reverse">
							<div class="flex items-center justify-between gap-2">
								<div>
									<Avatar src={$community.data?.image} crossorigin="" size="xs" />
								</div>
								<div class="grid grid-cols-1 gap-1">
									<p class="text-weight-600 text-xs font-bold text-gray-500">Issued by</p>
									<p class="text-xs">{$community.data?.name}</p>
								</div>
							</div>

							<div class="grid grid-cols-1 gap-1">
								<p class="text-weight-600 text-xs font-bold text-gray-500">Issued</p>
								<p class="text-xs">
									{#if $credential.data?.issuedUTC}
										<Time format="MMM DD, YYYY" timestamp={$credential.data?.issuedUTC} />
									{:else}-{/if}
								</p>
							</div>
							<div class="grid grid-cols-1 gap-1 text-left">
								<p class="text-weight-600 text-xs font-bold text-gray-500">Expires</p>
								<p class="text-xs">
									{#if $credential.data?.expiresUTC}
										<Time format="MMM DD, YYYY" timestamp={$credential.data?.expiresUTC} />
									{:else}-{/if}
								</p>
							</div>
						</div>
					</div>

					{#if $dataOnChain.data}
						<Accordion flush>
							<AccordionItem>
								<span slot="header">On Chain Data</span>
								<CredentialOnChainData data={$dataOnChain.data} />
							</AccordionItem>
						</Accordion>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>
