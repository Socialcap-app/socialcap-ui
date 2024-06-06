<script lang="ts">
	import { SubmitButton } from '$lib/components';
	import { useUpdateCommunity } from '$lib/hooks/communities';
	export let communityUid: string;

	const updateCommunityMutation = useUpdateCommunity();
	// use it for updating button text when submitting
	$: working = $updateCommunityMutation.isPending ? 'Updating ...' : '';

	async function update() {
		console.log('updating');
		let rs = await $updateCommunityMutation.mutateAsync({
			communityUid
		});
		console.log('Updated:', rs);
	}
</script>

<!-- Example usage -->
<SubmitButton
	on:click={() => update()}
	{working}
	disabled={$updateCommunityMutation.isPending}
	no-class="order-1 mb-2 mt-6 w-full md:order-2 md:mb-0 md:ms-2"
	size="md"
>
	Update
</SubmitButton>
