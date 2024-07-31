<script lang="ts">
	import { useGetCommunity } from '$lib/hooks/communities';
	import { findState } from '$lib/types/states';
	//
	import { Tabs, TabItem } from 'flowbite-svelte';
	
	import { H1, ErrorOnFetch } from '$lib/components';
	import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import CommunityBanner from '$lib/components/communities/CommunityBanner.svelte';
	import CredentialsList from '$lib/components/credentials/CredentialsList.svelte';
	import CommunityClaimables from './CommunityClaimables.svelte';
	import CommunityMembers from './CommunityMembers.svelte';
	import CommunityIssued from './CommunityIssued.svelte';
	import TabHeader from '$lib/components/common/TabHeader.svelte';
	import CommunityHeader from '$lib/components/communities/CommunityHeader.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	export let uid: string = '';

	let joined = true,
		sts = 0;
	let community = useGetCommunity(uid!);

	$: cmn = $community.data;
	$: sts = findState(cmn?.state === 'INITIAL' ? 'Revision' : cmn?.state || '-');
</script>

<div class="p-4">
	<Breadcrumbs label={$community.data?.name || '?'} />

	<div>
		{#if $community.isLoading}
		<LoadingSpinner />
		{:else if $community.isError}
			<ErrorOnFetch description="My community" error={$community.error} />
		{:else}
			<div class="w-full max-w-screen-lg">
				<CommunityBanner image={cmn?.image} />
				<div class="px-4 pb-4 pt-3">
					<CommunityHeader isAdmin={false} {uid} state={sts} title={cmn?.name} description={cmn?.description} />
					<Tabs
						style="underline"
						contentClass="p-4 bg-transparent rounded-lg dark:bg-gray-800 mt-4"
						defaultClass="flex flex-wrap items-end justify-center space-x-8 rtl:space-x-reverse"
					>
						<TabItem open class="">
							<TabHeader slot="title" label="Claim & Earn" count={cmn?.countClaimables} />
							<div>
								<CommunityClaimables communityUid={uid} />
							</div>
						</TabItem>

						<TabItem class="">
							<TabHeader slot="title" label="Issued" count={cmn?.countCredentials} />
							<div>
								<CommunityIssued communityUid={uid} />
							</div>
						</TabItem>

						<TabItem class="">
							<TabHeader slot="title" label="Members" count={cmn?.countMembers} />
							<div class="">
								<CommunityMembers communityUid={uid} />
							</div>
						</TabItem>
					</Tabs>
				</div>
			</div>
		{/if}
	</div>
</div>
