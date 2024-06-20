<script lang="ts">
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import { type Credential } from '$lib/types/credential';
	import { Card, Badge, Avatar, Button, Img } from 'flowbite-svelte';
	import Time from 'svelte-time';
	import { useGetCommunity } from '$lib/hooks/communities';
	import ErrorOnFetch from '../common/ErrorOnFetch.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { User } from '$lib/types';
	import { getCurrentUser } from '$lib/store';
	import { avatarPath } from '$lib/variables';
	import { goto } from '$app/navigation';
	import CredentialOnchainDataModal from './CredentialOnchainDataModal.svelte';
	import { getCredentialOnchainData } from '$lib/api/credentials-api';

	import GradientAvatar from '$lib/components/common/GradientAvatar.svelte';
	import { getInitials, buildGradient } from '$lib/components/common/gradient-svg';
	export let data: Credential,
		joined: boolean = false,
		isClaimable: boolean = false;

	const community = useGetCommunity(data.communityUid);
	let profile: User | null = getCurrentUser();
	let modalOpened = false;
	let onchainData: any = null;

	let clazz = '';
	export { clazz as class };

	$: isIssued = !isClaimable;
	// Date values and labels depend on isClaimable
	$: fromDateLabel = isClaimable ? 'Starts' : 'Issued';
	$: toDateLabel = isClaimable ? 'Ends' : 'Expires';
	$: fromDate = isClaimable ? data.startsUTC : data.issuedUTC;
	$: toDate = isClaimable ? data.endsUTC : data.expiresUTC;
	$: bannerImage = data?.banner || '/images/credentialbg.svg';
	$: avatarImage = isClaimable
		? data?.image || '/images/credentialbg.svg'
		: profile?.image || data.image || '/images/profile-2.png';
	$: avatarLabel = isClaimable ? data?.community || 'No name' : data.applicant || 'No name';
	$: issuedByImage = isIssued ? $community.data?.image || '/images/credentialbg.svg' : '';
	$: initials = getInitials(avatarLabel);

	function gotoLink(uid: string) {
		return `/credential/${uid}`;
	}

	onMount(async () => {
		profile = getCurrentUser();
		console.log('community Image', $community.data?.image);
	});

	async function showOnchainData(ev: any) {
		console.log('show', data);
		onchainData = await getCredentialOnchainData({ claimUid: data.uid });
		modalOpened = true;
	}
</script>

<CredentialOnchainDataModal bind:open={modalOpened} {onchainData} />

{#if $community.isLoading}
	<span>Loading...</span>
{:else if $community.isError}
	<ErrorOnFetch description="Credential" error={$community.error} />
{:else}
	<Card padding="md" size="md" class={`${clazz || ''}`} href={isIssued ? `/credential/${data.uid}` : `/claim/new?mp=${data.uid}` }>
		<div class="relative flex items-end justify-center">
			<img src={bannerImage} class="fill h-auto w-full" alt="Credential Banner" crossorigin="" />

			<div
				class="absolute -bottom-4 flex items-center gap-2 rounded-full border-2 border-gray-200 bg-gray-50 p-1"
			>
				<!-- <Avatar size="xs" src={avatarImage} crossorigin="" tabindex="0" /> -->
				<GradientAvatar {initials} gradient={buildGradient(initials)} />

				<div class="max-w-64 truncate px-2 text-xs text-black dark:text-white">{avatarLabel}</div>
			</div>
			{#if isIssued}
			<div class="absolute right-2 top-2">
				<button
					data-sveltekit-preload-data="false"
					class="rounded-lg border-0 bg-gray-50 px-2 py-1 text-xs text-black"
					on:click|preventDefault={(ev) => showOnchainData(ev)}
				>
					MINA Txns
				</button>
			</div>
			{/if}
		</div>

		<div class="pb-4 ps-4 pt-4">
			{#if isIssued}
				<h6 class="mb-2 mt-2 text-xl font-bold text-gray-900 dark:text-white">
					{data.type || data.name}
				</h6>
			{/if}
			{#if isClaimable}
				<div class="flex items-center justify-between">
					<h6 class="mb-2 mt-2 text-xl font-bold text-gray-900 dark:text-white">
						{data.type}
					</h6>
					<div class="min-w-20">
						{#if (data?.available || 0) > 0}
							<Badge rounded large color="green" class="bg-green-200"
								>{`${data.available} left`}</Badge
							>
						{:else}
							<Badge rounded large color="red">{`All claimed!`}</Badge>
						{/if}
					</div>
				</div>
			{/if}

			<p class="mb-2 text-sm text-gray-600 dark:text-gray-400">
				{data.description}
			</p>
		</div>
		<div class="px-4 pb-4 pt-2">
			<div class="ms-0 mt-4 flex items-center justify-between rtl:space-x-reverse">
				{#if isIssued}
					<div class="flex items-center justify-between gap-2">
						<div>
							<Avatar src={issuedByImage} crossorigin="" size="xs" />
						</div>
						<div class="grid grid-cols-1 gap-1">
							<p class="text-weight-600 text-xs font-bold text-gray-500">Issued by</p>
							<p class="text-xs">{data.community}</p>
						</div>
					</div>
				{/if}

				<div class="grid grid-cols-1 gap-1">
					<p class="text-weight-600 text-xs font-bold text-gray-500">{fromDateLabel}</p>
					<p class="text-xs">
						{#if fromDate}
							<Time format="MMM DD, YYYY" timestamp={fromDate} />
						{:else}-{/if}
					</p>
				</div>
				<div class="grid grid-cols-1 gap-1 text-left">
					<p class="text-weight-600 text-xs font-bold text-gray-500">{toDateLabel}</p>
					<p class="text-xs">
						{#if toDate}
							<Time format="MMM DD, YYYY" timestamp={toDate} />
						{:else}-{/if}
					</p>
				</div>

				{#if isClaimable}
					<Button color="primary" on:click={(e) => { e.preventDefault(); e.stopPropagation(); goto(`/claim/new?mp=${data.uid}`)} }>
						Claim it!
					</Button>
				{/if}
			</div>
		</div></Card
	>
{/if}
