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

	$:{
		console.log('planQuery::', data.uid, plan)
	}
</script>

<MetaTag path="claim" title="Socialcap" subtitle={`Claim`} description="" />

<div class="px-2 lg:m-20">
	{#if $planQuery.isLoading }
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
				<ClaimHeader {plan} claim={$claim.data} {isNew} />
				<div class="flex justify-center w-full mt-8 lg:mt-8">
					<Card size="none" class="items-center px-18 py-6 rounded-md border-0 NObg-gray-50 text-center" padding="xl">
							<div class="mb-6">
								<Icon name="NoData" size="8" />
							</div>
							<h6 class="text-lg text-weight-500 mb-2 text-black dark:text-white">To claim this credential you need to join the Community.</h6>
							<p class="text-weight-400 mb-4 text-sm text-gray-600 dark:text-gray-400 sm:text-sm">
								The steps you should follow could be -> Sign In -> Join the Community -> Claim this Credential!
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
						  <Button on:click={()=>history.back()} color="none" class="border-0">Return to Discover</Button>
						</div>
					  {/if}  
					</Card>
				</div>
				
				<!-- <ClaimEditor 
					claim={$claim.data} 
					{plan} 
					{isNew} 
					mode={isNew ? "edit" : mode} /> -->
			{/if}
		{/key}
	{/if}
</div>


<!-- <script lang="ts">
	import { onMount } from 'svelte';
	import { MetaTag } from '$lib/components';
	import CredentialDetail from './CredentialDetail.svelte';

	export let data: any;
	$: refreshOn = data.uid; 
</script>

<MetaTag path="credential" title="Socialcap" subtitle={`Credential`} description="" />

<div class="p-4">
	{#key refreshOn}
		<CredentialDetail uid={data.uid} />
	{/key}
</div> -->
