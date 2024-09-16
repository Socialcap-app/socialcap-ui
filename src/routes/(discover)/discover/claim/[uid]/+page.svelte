<script>
	import { onMount } from 'svelte';
	import { MetaTag } from '$lib/components';
	import { Card, Button } from 'flowbite-svelte';
	// import ClaimEditor from "./ClaimEditor.svelte";
	import ErrorOnFetch from '$lib/components/common/ErrorOnFetch.svelte';
	import ClaimHeader from '$lib/components/claims/ClaimHeader.svelte';
	import ClaimEditor from '$lib/components/claims/ClaimEditor.svelte';
	import Breadcrumbs from '$lib/components/common/Breadcrumbs.svelte';
	import { getCurrentUser } from '$lib/store';
	import { useGetPlan } from '$lib/hooks/plans';
	import { useGetClaim } from '$lib/hooks/claims';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import NoData from '$lib/components/common/NoData.svelte';
	import Icon from '$lib/components/common/Icon.svelte';
	import { redirectUrl } from '$lib/store/navigation.ts';
	import { goto } from '$app/navigation';
	export let data;
	$: isNew = data.uid === 'new';
	$: mode = data.mode || 'view';
	$: refreshOn = data.uid;
	const planQuery = useGetPlan(data.planUid);
	$: plan = $planQuery.data;
	let claim = null;
	$: claim = useGetClaim(data.uid, plan);
</script>

<MetaTag path="claim" title="Socialcap" subtitle={`Claim`} description="" />

<div class="px-2 lg:m-20">
	{#if $planQuery.isLoading}
		<LoadingSpinner />
	{:else if $planQuery.isError}
		<ErrorOnFetch description="A new claim" error={$planQuery.error} />
	{:else}
		<!-- <Breadcrumbs label={plan?.name || '?'} /> -->
		{#key refreshOn}
			{#if $claim.isLoading}
				<span>Loading claim...</span>
			{:else if $claim.isError}
				<ErrorOnFetch description="A new claim" error={$claim.error} />
			{:else}
				<Button
					color="none"
					class="relative my-4 mb-4 p-0 pl-2 lg:pl-6"
					on:click={() => history.back()}
				>
					{'<- Return'}
				</Button>
				<ClaimHeader {plan} claim={$claim.data} {isNew} />
				<div class="my-8 flex w-full justify-center lg:mt-8">
					<Card
						size="none"
						class="px-18 NObg-gray-50 items-center rounded-md border-0 py-6 text-center"
						padding="xl"
					>
						<div class="mb-6">
							<Icon name="NoData" size="8" />
						</div>
						<h6 class="text-weight-500 mb-2 text-lg text-black dark:text-white">
							To claim your credential, you'll need to join the community. Simply follow these
							steps:
						</h6>
						<p class="text-weight-400 mb-4 text-sm text-gray-600 dark:text-gray-400 sm:text-sm">
							Sign In -> Join the Community -> Claim this Credential!
						</p>
						{#if true}
							<div
								class="items-center justify-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse"
							>
								<Button
									color="primary"
									on:click={(e) => {
										e.preventDefault();
										e.stopPropagation();
										redirectUrl.set(`/community/${plan.communityUid}`);
										goto(`/login`);
									}}
								>
									{'Sign in and Claim it!'}
								</Button>
							</div>
						{/if}
					</Card>
				</div>
			{/if}
		{/key}
	{/if}
</div>
