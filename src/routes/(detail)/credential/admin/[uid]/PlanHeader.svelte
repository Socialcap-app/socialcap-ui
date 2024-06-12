<script lang="ts">
	import { type Plan } from '$lib/types/plan';
	import { Card, Badge, Avatar, Button, Img } from 'flowbite-svelte';
	import Time from 'svelte-time';
	import { H1 } from '$lib/components';
	import { onMount } from 'svelte';
	import StateBadge from '$lib/components/common/StateBadge.svelte';
	

	export let plan: Plan | undefined;


</script>

<Card class="" padding="none" size="fluid">
	<div class="relative bg-blue-100">
		<span class="absolute -bottom-12 left-0 ms-4 mt-4 inline-block">
			<Avatar src={plan?.image} class="round h-24 w-24 drop-shadow-lg" />
		</span>
		<img src={plan?.banner} class="fill max-h-32 w-full" alt="Credential Banner" crossorigin="" />
	</div>

	<div class="px-4 pt-16">
		<H1>{plan?.name}</H1>
		<p class="mb-0 mt-2 text-lg text-gray-400 dark:text-gray-400">
			{plan?.description}
		</p>
	</div>

	<div class="px-4 pb-4 pt-0">
		<div class="ms-0 mt-4 flex items-center justify-between rtl:space-x-reverse">
			<div class="text-start">
                <StateBadge data={plan?.state} />
			</div>

			<div class="flex w-[50%] max-w-64 items-start justify-between">
				<div class="grid grid-cols-1 gap-1">
					
				</div>
				<div class="grid grid-cols-1 gap-1 text-left">
					
				</div>
			</div>
		</div>
	</div></Card
>
