<script lang="ts">
  import InvitationCard from "./InvitationCard.svelte";
  import InviteModal from "./InviteModal.svelte";
  import ForYou from "./ForYou.svelte";
  let openInvite = true;
  let openModal = true;
</script>

<div class="p-4 w-full">
  <InvitationCard bind:open={openInvite}/>
  <ForYou />
  <InviteModal {openModal}/>
</div>
