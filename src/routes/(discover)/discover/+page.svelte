<script>
	import { useGetPublicCommunities } from '$lib/hooks/communities';
	import { useGetPublicClaims } from '$lib/hooks/plans';
	import ForYou from '../../(home)/home/ForYou.svelte';
	let pubCommunities = useGetPublicCommunities();
	let pubClaimables = useGetPublicClaims();
</script>


<div class="m-auto max-w-2xl p-5 text-left">
	<ForYou claimables={pubClaimables} communities={pubCommunities} />
</div>
