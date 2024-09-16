<script lang="ts">
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	import { findState } from '$lib/types/states';
	import { Card, Badge, Avatar, Button, Img } from 'flowbite-svelte';
	import CommunityMenu from './CommunityMenu.svelte';
	import JoinCommunityModal from './JoinCommunityModal.svelte';
	import { goto } from '$app/navigation';
	import Banner from '../common/Banner.svelte';
	import { userLoggedIn } from '$lib/store/navigation';

	export let uid = '',
		title = '',
		description = '',
		image = '',
		state = '',
		count = '0',
		nClaims = 0,
		nCredentials = 0,
		joined = false,
		isAdmin: boolean = false;

	let joinModalOpened = false;

	$: sts = findState(state === 'INITIAL' ? 'Revision' : state);
	const bgImage = image || '/images/community-banner.svg';

	function gotoLink(uid: string) {
		return joined ? `/community/${uid}` : `/community/${uid}`;
	}

	function openJoinModal(ev: any) {
		ev.preventDefault(); //.stopPropagation();
		joinModalOpened = true;
	}

	function updateImage(img: string) {
		image = img;
	}
</script>

<JoinCommunityModal {title} {uid} {description} bind:open={joinModalOpened} />

<Card
	class=""
	padding="none"
	size="none"
	href={$userLoggedIn ? gotoLink(uid) : `/discover/community/${uid}`}
>
	<Banner {image} on:updateimage={(e) => updateImage(e.detail.image)} inside="card" />
	<div class="px-4 pb-4 pt-6">
		<!-- <Badge rounded border large color="green" class="inline-block mb-0">{state}</Badge> -->
		<div class="flex items-center justify-between">
			<StateBadge data={sts} />
			{#if $userLoggedIn}
				<div>
					<CommunityMenu {isAdmin} {joined} on:admin={() => goto('/community/admin/' + uid)} />
				</div>
			{/if}
		</div>
		<h6 class="mb-2 mt-2 text-xl font-bold text-blue-900 dark:text-white">{title}</h6>
		<p
			class="mb-6 h-10 max-h-10 overflow-hidden text-ellipsis text-sm text-gray-600 dark:text-gray-400"
		>
			{description}
		</p>

		<div class="ms-0 mt-4 flex items-center justify-between rtl:space-x-reverse">
			{#if joined}
				<span class="inline-block text-sm font-bold">
					<Badge class="mb-0 inline-block rounded-full bg-gray-200 py-1">
						{nClaims}
					</Badge> claims
				</span>
				<span class="inline-block text-sm font-bold">
					<Badge class="mb-0 inline-block rounded-full bg-gray-200 py-1">
						{nCredentials}
					</Badge> issued
				</span>
			{/if}
			<div class="ms-4 flex items-center">
				<Avatar src="/images/gradient-lean.svg" stacked size="xs" />
				<Avatar src="/images/gradient-mario.svg" stacked size="xs" />
				<Avatar src="/images/gradient-nicolas.svg" stacked size="xs" />
				<Avatar
					stacked
					size="xs"
					class="text-dark w-10 bg-gray-200 py-1 text-xs font-bold hover:bg-gray-600"
				>
					+{Number(count) < 4 ? 0 : Number(count) - 3}
				</Avatar>
			</div>
			{#if !joined}
				<Button color="primary" size="sm" on:click={(ev) => openJoinModal(ev)}>Join</Button>
			{/if}
		</div>
	</div>
</Card>
