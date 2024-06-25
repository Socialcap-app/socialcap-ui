<script lang="ts">
  import InvitationCard from "./InvitationCard.svelte";
  import InviteModal from "./InviteModal.svelte";
  import ForYou from "./ForYou.svelte";
  let openInvite = true;
  let openModal = false;
</script>

<div class="p-4 w-full">
  <InvitationCard bind:open={openInvite} 
    on:invite={()=>{
      openModal = false
      openModal=true}}/>
  <ForYou />
  <InviteModal {openModal}/>
</div>
