<script>
	import { useGetPublicCommunities } from "$lib/hooks/communities";
	import { useGetPublicClaims } from "$lib/hooks/plans";
	import ForYou from "../../(home)/home/ForYou.svelte";


    let pubCommunities = useGetPublicCommunities();
    let pubClaimables = useGetPublicClaims();
</script>

<!-- <h1 class="text-2xl font-semibold">Create your community</h1>
	<p class="mb-10 text-base font-normal">Invite teammates and create better communities</p>
	<Button color={'blue'}>Create your community</Button> -->
	
<!-- {#if inviteCardIsShowing}
		<div class="headings m-auto py-10 my-10 w-screen text-center">
			<div class="relative max-w-xl m-auto mt-5 z-50">
				<InvitationCard bind:open={inviteCardIsShowing} on:close={()=>inviteCardIsShowing = false}
					on:invite={()=>{
					openModal = false
					openModal=true}}
				/>
				<InviteModal {openModal}/>
			</div>
			{#if window.innerWidth > 750}
				<div class="square one"></div>
				<div class="square two"></div>
		{#if window.innerWidth > 1000}
			<div class="square three"></div>
			<div class="square four"></div>
		{/if}
			{/if}
		</div>
	{/if} -->

<div class="m-auto max-w-2xl p-5 text-left">
    <ForYou claimables={pubClaimables} communities={pubCommunities} />
</div>