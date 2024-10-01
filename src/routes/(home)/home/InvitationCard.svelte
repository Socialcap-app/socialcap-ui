<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Card, Button } from 'flowbite-svelte';

	const dispatch = createEventDispatcher();

	export let open = true;
</script>

{#if open}
	<Card
		class={`
    border-0 bg-gradient-to-b from-white to-[#eff6ff] p-9 text-center shadow-xl 
    lg:bg-[url('/images/bg-invite.png')] lg:bg-cover lg:px-10 lg:py-9
  `}
		size="none"
		padding="xl"
	>
		<div class="flex flex-col items-center lg:items-start">
			<h6 class="text-2xl font-semibold text-black dark:text-white">
				Better together, invite friends
			</h6>
			<p class="mt-0.5 text-base font-normal text-gray-600 dark:text-gray-400 lg:text-base">
				Invite teammates and create better communities
			</p>
			<div class="mt-9 flex h-10 justify-center gap-4 lg:mt-10">
				<Button
					size="sm"
					color="blue"
					on:click={(e) => {
						e.preventDefault();
						e.stopPropagation();
						dispatch('invite');
					}}>Invite</Button
				>
				<Button
					size="sm"
					color="none"
					on:click={() => {
						open = false;
						dispatch('close');
					}}
					outline={false}
				>
					Dismiss
				</Button>
			</div>
		</div>
	</Card>

	<br />
{/if}
