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

	export let uid;
	$: credential = useGetCredential(uid);
	$: community = useGetCommunity($credential.data?.communityUid!);
	$: initials = $community.data ? getInitials($credential.data?.applicant!) : '??';
	$: dataOnChain = useGetCredentialOnchainData(uid);
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
					<CommunityBanner image={$credential.data?.banner} />

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

				<div class="px-4 pb-4 pt-3 space-y-3">
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
					<div class="flex items-center justify-end">
						<CredentialActions credential={$credential?.data} />
					</div>
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

					{#if $credential.data}
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