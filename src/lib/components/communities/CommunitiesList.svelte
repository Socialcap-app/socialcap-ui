<script lang="ts">
	import { onMount } from 'svelte';
	import { Card, Button } from 'flowbite-svelte';
	import Icon from '../common/Icon.svelte';
	import H1 from '$lib/components/common/H1.svelte';
	import CommunityCard from './CommunityCard.svelte';
	import { type Community } from '$lib/types';
	import { getCurrentUser } from '$lib/store';
	import { userLoggedIn } from '$lib/store/navigation';

	export let data: any[] = [],
		joined = false,
		grid = ''; // 1 or 2 cols

	let user: any;

	onMount(() => {
		user = $userLoggedIn ? getCurrentUser() : undefined;
	});

	function isAdmin(t: Community, user: any): boolean {
		if (!user) return false;
		const admins = [t.adminUid].concat(t.xadmins.split(','));
		return admins.includes(user.uid);
	}
</script>

<div class="">
	<div class="mb-0 mt-0 w-full">
		{#if grid === '1'}
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-1">
				{#each data || [] as t}
					<div class="h-full flex transition-opacity duration-1000">
						<CommunityCard
							class="h-full flex flex-col"
							uid={t.uid}
							state={t.state}
							title={t.name}
							description={t.description}
							image={t.image}
							nClaims={t.countClaims}
							nCredentials={t.countCredentials}
							count={t.countMembers}
							{joined}
							isAdmin={isAdmin(t, user)}
						/>
					</div>
				{/each}
			</div>
		{/if}

		{#if grid === '2'}
			<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{#each data || [] as t}
					<div class="h-full flex transition-opacity duration-1000">
						<CommunityCard
							class="h-full flex flex-col"
							uid={t.uid}
							state={t.state}
							title={t.name}
							description={t.description}
							image={t.image}
							nClaims={t.countClaims}
							nCredentials={t.countCredentials}
							count={t.countMembers}
							{joined}
							isAdmin={isAdmin(t, user)}
						/>
					</div>
				{/each}
			</div>
		{/if}

		{#if !data.length}
			<div class="mt-8 flex w-full justify-center lg:mt-8">
				<Card
					size="none"
					class="px-18 NObg-gray-50 items-center rounded-md border-0 py-6 text-center"
					padding="xl"
				>
					<div class="mb-6">
						<Icon name="NoData" size="8" />
					</div>
					<h6 class="text-weight-500 mb-2 text-lg text-black dark:text-white">
						{'There are no communities to show.'}
					</h6>
					<p class="text-weight-400 mb-4 text-sm text-gray-600 dark:text-gray-400 sm:text-sm">
						{'Lets try creating one!'}
					</p>
					<div class="items-center justify-center space-y-4 sm:flex sm:space-x-4 sm:space-y-0 rtl:space-x-reverse">
						<Button href="/" color="primary" size="sm">Back home</Button>
						<Button color="none" class="border-0">Learn more</Button>
					</div>
				</Card>
			</div>
		{/if}
	</div>
</div>
