<script lang="ts">
	import { Breadcrumb, BreadcrumbItem, P, TabItem, Tabs } from 'flowbite-svelte';
	import { H1, ErrorOnFetch, StateBadge } from '$lib/components';
	import { useGetAdminCommunity } from '$lib/hooks/communities';
	import Credentials from './Credentials.svelte';
	import Members from './Members.svelte';
	import TabHeader from '$lib/components/common/TabHeader.svelte';
	import CommunityBanner from '$lib/components/communities/CommunityBanner.svelte';
	import General from './General.svelte';
	import { findState } from '$lib/types/states';
	import CommunityHeader from '$lib/components/communities/CommunityHeader.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	export let uid: string;
	let community = useGetAdminCommunity(uid);

	$: plans = $community.data?.plans;
	console.log('plans', plans);
	$: state = findState(
		$community.data?.state === 'INITIAL' ? 'Revision' : $community.data?.state || '-'
	);
	// TODO: check/ask image community banner rounded or not
	// TODO: ask about show count={ $community.data?.countCredentials }

	const activeClasses =
		'px-3 py-1.5 inline-block text-sm font-medium text-center disabled:cursor-not-allowed text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500 active';
	const inactiveClasses =
		'px-3 py-1.5 inline-block text-sm font-medium text-center disabled:cursor-not-allowed border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400';
</script>

<div class="p-4">
	<Breadcrumb class="mb-8 ms-2 mt-8 flex">
		<BreadcrumbItem home href="/home">General</BreadcrumbItem>
		<BreadcrumbItem>Admin communities</BreadcrumbItem>
		<BreadcrumbItem>{$community.data?.name || '?'}</BreadcrumbItem>
	</Breadcrumb>

	<div>
		{#if $community.isLoading}
			<LoadingSpinner />
		{:else if $community.isError}
			<ErrorOnFetch description="Admin community" error={$community.error} />
		{:else}
			<div class="w-full max-w-screen-lg">
				<CommunityBanner image={$community.data?.image} />
				<div class="px-4 pb-4 pt-3">
					<CommunityHeader isAdmin={true} {uid} {state} title={$community.data?.name} description={$community.data?.description} />
					<Tabs
						style="underline"
						contentClass="pt-14 pr-5 pb-4 pl-7 bg-transparent rounded-lg dark:bg-gray-800"
						defaultClass="flex flex-wrap items-end justify-center space-x-2 lg:space-x-10 rtl:space-x-reverse"
					>
						<TabItem open ><!-- {activeClasses} {inactiveClasses} -->
							<TabHeader slot="title" label="General" showCount={false} />
							{#if $community.data}
								<div>
									<General communityUid={uid} community={$community.data} on:update />
								</div>
							{/if}
						</TabItem>

						<TabItem>
							<TabHeader slot="title" label="Credentials Campaigns" count={plans.length || 0} />
							<div>
								<Credentials {community} />
							</div>
						</TabItem>

						<TabItem>
							<TabHeader slot="title" label="Members" count={$community.data?.countMembers} />
							<div class="">
								<Members communityUid={uid} />
							</div>
						</TabItem>
					</Tabs>
				</div>
			</div>
		{/if}
	</div>
</div>
