<script lang="ts">
	import { useCreateCommunity, useGetCommunity } from '$lib/hooks/communities';
	import { onMount } from 'svelte';
	import { Avatar, Accordion, AccordionItem, Tabs, TabItem } from 'flowbite-svelte';
	import { getCurrentUser } from '$lib/store';
	import type { User } from '$lib/types/user';
	import Breadcrumbs from '../../../../lib/components/common/Breadcrumbs.svelte';
	import {
		useGetCredential,
		useGetCredentialMints,
		useGetCredentialOnchainData
	} from '$lib/hooks/credentials';
	import { ErrorOnFetch } from '$lib/components';
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import Time from 'svelte-time/Time.svelte';
	import CommunityBanner from '$lib/components/communities/CommunityBanner.svelte';
	import CredentialActions from './CredentialActions.svelte';
	import TabHeader from '$lib/components/common/TabHeader.svelte';
	import GradientAvatar from '$lib/components/common/GradientAvatar.svelte';
	import { getInitials, buildGradient } from '$lib/components/common/gradient-svg';
	import CredentialOnChainData from './CredentialOnChainData.svelte';
	import MintCard from '$lib/components/credentials/MintCard.svelte';

	export let uid;

	$: isConnected = false;
	let accountId = '';
	$: credential = useGetCredential(uid);
	$: community = useGetCommunity($credential.data?.communityUid!);
	$: mints = useGetCredentialMints(uid);
	$: initials = $credential.data ? getInitials($credential.data?.applicant!) : '??';
	$: dataOnChain = useGetCredentialOnchainData(uid);
	$: bannerImage = $credential.data?.banner || '/images/credentialbg.svg';

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
		{#if $credential.isLoading || $community.isLoading || $dataOnChain.isLoading || $mints.isLoading}
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
							<CredentialActions credential={$credential?.data} {isConnected} {accountId} />
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
					<Tabs
						style="underline"
						contentClass="p-4 bg-transparent rounded-lg dark:bg-gray-800 mt-4"
						defaultClass="flex flex-wrap items-end justify-center space-x-8 rtl:space-x-reverse"
					>
						<TabItem open>
							<TabHeader slot="title" label="Minted Credentials" count={$mints.data?.length} />
							{#if $mints.data}
								<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
									{#each $mints.data as mint}
										<MintCard data={mint} />
									{/each}
								</div>
							{:else}
								<div>
									<p>No minted credential</p>
								</div>
							{/if}
						</TabItem>
						<TabItem>
							<TabHeader slot="title" label="On Chain Data" showCount={false} />
							{#if $dataOnChain.data}
								<div>
									<CredentialOnChainData data={$dataOnChain.data} />
								</div>
							{/if}
						</TabItem>
					</Tabs>
				</div>
			</div>
		{/if}
	</div>
</div>
