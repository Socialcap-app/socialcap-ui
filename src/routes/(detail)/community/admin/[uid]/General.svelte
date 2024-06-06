<script lang="ts">
  	import { Label, Input, Textarea } from "flowbite-svelte";
	import { SubmitButton } from '$lib/components';
	import { useUpdateCommunity } from '$lib/hooks/communities';
	import ColorHash from "color-hash";
	export let communityUid: string;
	let name: string;
	let description: string;

	const updateCommunityMutation = useUpdateCommunity();
	// use it for updating button text when submitting
	$: working = $updateCommunityMutation.isPending ? 'Updating ...' : '';

	async function update() {
		console.log('updating');
		let rs = await $updateCommunityMutation.mutateAsync({
			uid: communityUid,
			name,
			description
		});
		console.log('Updated:', rs);
	}
</script>

<!-- Example usage -->
<div class="flex flex-col gap-10">
    <div>
      <Label for="community-name" class="text-base">Community Name</Label>
      <Input class="mt-2" type="text" id="community-name" placeholder="Argentinean Pink Lizard" required bind:value={name}/>
    </div>
	<div class="mt-2">
		<Label for="description" class="text-base">Short Description<span class="float-right text-sm font-normal text-[#7E8390]">Max. 256 char</span></Label>
		<Textarea class="mt-2" id="description" placeholder="So gentle, so good" rows="4" name="description" maxlength="256" bind:value={description}/>
	</div>
<SubmitButton
	on:click={() => update()}
	{working}
	disabled={$updateCommunityMutation.isPending}
	size="md"
	class="bg-red"
>
	Save Changes
</SubmitButton>
</div>