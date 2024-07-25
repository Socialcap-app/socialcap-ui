<script lang="ts">
	import { type Plan } from '$lib/types/plan';
	import { Card, Badge, Avatar, Button, Img } from 'flowbite-svelte';
	import Time from 'svelte-time';
  import { H1 } from "$lib/components";
	import { onMount } from 'svelte';
	import type { Claim } from '$lib/types/claim';
	import ClaimEditor from './ClaimEditor.svelte';

	export let 
    plan: Plan,
    claim: Claim,
    isNew: boolean = false;

  $: fromDateLabel = 'Starts';
  $: toDateLabel = 'Ends';
  $: fromDate = plan.startsUTC;
  $: toDate = plan.endsUTC;
  $: bannerImage = plan?.banner || '/images/socialcap-bg-signin.svg';//'/images/credentialbg.svg'; 
  $: avatarImage = plan.image || '/images/credentialbg.svg';
  $: claimingHasEnded = (new Date()) > toDate!;

	onMount(async () => {
		//profile = getCurrentUser();
	});
</script>

<Card class="" padding="none"  size="fluid">
  <div class="relative bg-blue-100">
    <span class="inline-block mt-4 ms-4 absolute -bottom-12 left-0">
      <Avatar src={bannerImage} class="h-24 w-24 round drop-shadow-lg"/>
    </span>
    <img 
      src={avatarImage} 
      class="object-cover max-h-32 w-full rounded-t" alt="Credential Banner" 
      crossorigin=""
    />
  </div>

		<div class="px-4 pt-16">
      <H1>{plan.name}</H1>
			<p class="mb-0 mt-2 text-lg text-gray-400 dark:text-gray-400">
				{plan.description}
			</p>
		</div>

		<div class="px-4 pb-4 pt-0">
			<div class="ms-0 mt-4 flex items-center justify-between rtl:space-x-reverse">
				<div class="text-start">
          {#if (plan?.available || 0) > 0 }
            <Badge rounded large color="green" class="bg-green-200">{`${plan.available} left`}</Badge>
          {:else}
            <Badge rounded large color="red">{`All claimed!`}</Badge>
          {/if}
				</div>

        <div class="flex items-start justify-between w-[50%] max-w-64">
          <div class="grid grid-cols-1 gap-1">
            <p class="text-weight-600 text-sm font-bold text-gray-500">{fromDateLabel}</p>
            <p class="text-sm">
              {#if fromDate}
                <Time format="MMM DD, YYYY" timestamp={fromDate} />
              {:else}-{/if}
            </p>
          </div>
          <div class="grid grid-cols-1 gap-1 text-left">
            <p class="text-weight-600 text-sm font-bold text-gray-500">{toDateLabel}</p>
            <p class="text-sm">
              {#if toDate}
                <Time format="MMM DD, YYYY" timestamp={toDate} />
              {:else}-{/if}
            </p>
          </div>
        </div>
		</div>
</Card>
