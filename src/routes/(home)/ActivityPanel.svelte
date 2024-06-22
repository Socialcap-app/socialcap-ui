<script lang="ts">
	import { Heading, P, Button } from 'flowbite-svelte';
	import { ErrorOnFetch, H1, H1Subtitle } from '$lib/components';
	import ActivitiesList from '$lib/components/activities/ActivitiesList.svelte';
	import { refreshNotifications } from '$lib/store/notifications';
	import { NATSClient } from '$lib/nats';
	import { getCurrentBlockchain, getCurrentUser } from '$lib/store';
</script>

<div class="w-full rounded p-5 py-11 ps-5">
	<H1>Activity</H1>
	<P class="mb-8 text-gray-400" size="base">
		Your current activity
		<Button
			size="xs"
			color="light"
			on:click={() => {
				// refreshNotifications()
				let usr = getCurrentUser();
				// NATSClient.notify('personal', {
				//   memo: `Hola Peperucho ${usr?.uid}`,
				//   subject: usr?.uid || ""
				// });
				NATSClient.notify('personal', {
					memo: `Mint transaction success`,
					subject: usr?.uid || '',
					type: 'transaction',
					metadata: JSON.stringify({
						net: getCurrentBlockchain().chainId,
						hash: "5JvD3uTVPDQWfZdv6mjEpwmAA6KFSeTRkGytjLUdcT7PerKdNQ7X",
						type: 'zk-tx'
					})
				});
				NATSClient.notify('personal', {
					memo: `<p>🎉 Your credential has been successfully minted as an NFT!</p>
    				<a href="https://example.com/view-nft" target="_blank">View your NFT</a>`,
					subject: usr?.uid || '',
					type: 'message'
				});
			}}>Update</Button
		>
	</P>

	<ActivitiesList limit={6} />
</div>
