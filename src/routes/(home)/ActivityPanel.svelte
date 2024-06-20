<script lang="ts">
  import { Heading, P, Button  } from 'flowbite-svelte';
	import { ErrorOnFetch, H1, H1Subtitle } from '$lib/components';
  import ActivitiesList from '$lib/components/activities/ActivitiesList.svelte';
  import { refreshNotifications } from '$lib/store/notifications';
  import { NATSClient } from '$lib/nats';
	import { getCurrentUser } from '$lib/store';
</script>

<div class="w-full rounded py-11 ps-5 p-5">
  <H1>
    Activity
  </H1>
  <P class="text-gray-400 mb-8" size="base">
    Your current activity 
    <Button size="xs" color="light" on:click={() => { 
      // refreshNotifications() 
      let usr = getCurrentUser();
      NATSClient.notify('personal', { 
        memo: `Hola Peperucho ${usr?.uid}`,
        subject: usr?.uid || ""
      });
    }}>Update</Button>
  </P>

  <ActivitiesList limit={6} />  
</div>  
