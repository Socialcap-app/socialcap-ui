<script lang="ts">
	import { P } from 'flowbite-svelte';
	import { H1, ErrorOnFetch } from '$lib/components';
	import CredentialsList from '$lib/components/credentials/CredentialsList.svelte';
	import { useGetMyCredentials } from '$lib/hooks/credentials';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';
	import type { Credential } from '$lib/types';
	import Search from '$lib/components/common/Search.svelte';
	import NoDataFilters from '$lib/components/common/NoDataFilters.svelte';

	const credentials = useGetMyCredentials();
	let credentialsFiltered: Credential[] | undefined = [];

	let inputValue = '';
	$: {
		/* SEARCH */
		let inputValueLowered = inputValue.toLowerCase();
		credentialsFiltered = inputValueLowered
			? $credentials.data?.filter(
					(e) =>
						e.community?.toLowerCase().includes(inputValueLowered) ||
						e.type?.toLowerCase().includes(inputValueLowered) ||
						e.description?.toLowerCase().includes(inputValueLowered)
				)
			: $credentials.data;
	}
</script>

<div class="p-4">
	<H1>My Credentials</H1>
	<P class="text-gray-400" size="lg">
		You own {($credentials.data || []).length} credentials
	</P>
	<P class="pb-8"></P>
	{#if $credentials.isLoading}
		<LoadingSpinner />
	{:else if $credentials.isError}
		<ErrorOnFetch description="All the credentials" error={$credentials.error} />
	{:else}
		<div class="m-auto mb-5 flex w-full flex-wrap items-center justify-between gap-5 text-center">
			<Search bind:value={inputValue} entity="credentials" />
		</div>

		{#if credentialsFiltered?.length}
			<ul>
				<CredentialsList data={$credentials.data} />
			</ul>
		{:else}
			<NoDataFilters
				{inputValue}
				onClickClear={() => {
					inputValue = '';
				}}
			/>
		{/if}
	{/if}
</div>
