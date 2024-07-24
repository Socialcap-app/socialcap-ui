<script lang="ts">
	import { useGetMyClaims } from '$lib/hooks/claims';
	import { P } from 'flowbite-svelte';
	import { H1, ErrorOnFetch } from '$lib/components';
	import ClaimsTable from './ClaimsTable.svelte';
	import ClaimsTableMobile from './ClaimsTableMobile.svelte';
	import NoData from '$lib/components/common/NoData.svelte';
	import LoadingSpinner from '$lib/components/common/LoadingSpinner.svelte';

	const claims = useGetMyClaims();
</script>

<div class="p-4">
	<H1>My Claims</H1>
	<P class="text-gray-400" size="base">Your claimed credentials</P>
	<P class="pb-8"></P>
	{#if $claims.isLoading}
		<LoadingSpinner />
	{:else if $claims.isError}
		<ErrorOnFetch description="All my claims" error={$claims.error} />
	{:else if !$claims.data || $claims.data.length === 0}
		<NoData text="You have no pending claims" />
	{:else}
		<div class="hidden lg:block">
			<ClaimsTable data={
        ($claims.data && Array.isArray($claims.data)) ? $claims.data : []
      } />
		</div>
		<div class="block lg:hidden">
			<ClaimsTableMobile data={
        ($claims.data && Array.isArray($claims.data)) ? $claims.data : []
      } />
		</div>
	{/if}
</div>
