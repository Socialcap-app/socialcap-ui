<script>
	import { useGetAllCommunities } from '$lib/hooks/communities';
	import { useGetAllClaimables } from '$lib/hooks/plans';
	import ForYou from '../../(home)/home/ForYou.svelte';
	let pubCommunities = useGetAllCommunities();
	let pubClaimables = useGetAllClaimables();
</script>


<div class="m-auto max-w-2xl p-5 text-left">
	<ForYou claimables={pubClaimables} communities={pubCommunities} />
</div>
