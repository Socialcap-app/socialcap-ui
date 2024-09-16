<script lang="ts">
	import { useJoinCommunity } from '$lib/hooks/communities';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { Label, Input, Button, Modal, Checkbox, Helper } from 'flowbite-svelte';
	import { getCurrentUser } from '$lib/store';
	import type { User } from '$lib/types';
	import SubmitButton from '../common/SubmitButton.svelte';
	import { redirectUrl, userLoggedIn } from '$lib/store/navigation';

	export let open = false,
		title = '',
		description = '',
		uid = '';

	const joinCommunityMutation = useJoinCommunity();

	let profile: User | null = getCurrentUser();

	onMount(() => {
		profile = getCurrentUser();
	});

	$: working = $joinCommunityMutation.isPending ? 'Joining ...' : '';

	function submitJoin() {
		if (!$userLoggedIn) {
			open = false;
			redirectUrl.set(`/community/${uid}`);
			goto('/login');
			return;
		}
		console.log('submitting');
		working = 'Joining ...';
		setTimeout(async () => {
			let rs = await $joinCommunityMutation.mutateAsync({
				communityUid: uid,
				personUid: profile!.uid
			});
			open = false;
			console.log('Joined:', rs);
			goto(`/community/${uid}`);
		}, 2000);
	}
</script>

<Modal bind:open size="md" no-autoclose class="w-full max-w-screen-sm">
	<div class="">
		<p class="text-lg font-semibold text-black">
			Let's join <b>{title}</b>
		</p>
		<p class="mt-2 text-base text-gray-500">
			{description}
		</p>
	</div>
	<div class="mt-4 flex items-center justify-end">
		<Button on:click={() => (open = false)} color="light" size="md" class="text-sm">
			I'll do it latter
		</Button>
		&nbsp;
		<SubmitButton
			on:click={() => submitJoin()}
			{working}
			disabled={$joinCommunityMutation.isPending}
			no-class="order-1 mb-2 mt-6 w-full md:order-2 md:mb-0 md:ms-2"
			size="md"
		>
			Join!
		</SubmitButton>
	</div>
</Modal>
