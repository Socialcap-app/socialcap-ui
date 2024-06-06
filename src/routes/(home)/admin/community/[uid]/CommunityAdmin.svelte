<script lang="ts">
  import { onMount } from "svelte";
  import { Breadcrumb, BreadcrumbItem, P, TabItem, Tabs } from 'flowbite-svelte';
  import { H1, ErrorOnFetch, StateBadge } from "$lib/components";
  import { useGetAdminCommunity } from "$lib/hooks/communities";
  import type { Community } from "$lib/types";
  import { getCommunity } from "$lib/api/queries";
	import Credentials from "./Credentials.svelte";
	import TabHeader from "$lib/components/common/TabHeader.svelte";
	import Time from "svelte-time/Time.svelte";
	import CommunityBanner from "$lib/components/communities/CommunityBanner.svelte";
	import General from "./General.svelte";
	import { findState } from "$lib/types/states";

  export let uid: string | null = null;
  let community = useGetAdminCommunity(uid!);
 
  $: state = findState(($community.data?.state === 'INITIAL') ? 'Revision' : ($community.data?.state || '-'));
</script>

<div class="p-4">
  <Breadcrumb class="mb-5">
    <BreadcrumbItem home href="/home">Home</BreadcrumbItem>
    <BreadcrumbItem>Admin communities</BreadcrumbItem>
    <BreadcrumbItem>{$community.data?.name || '?'}</BreadcrumbItem>
  </Breadcrumb>

  <div>
    <H1>{$community.data?.name}</H1>
    {#if $community.isLoading}
      <span>Loading...</span>
    {:else if $community.isError}
      <ErrorOnFetch 
        description="Admin community"
        error={$community.error} 
      />
    {:else}
    <div class="w-full max-w-screen-lg">
      <CommunityBanner image={$community.data?.image} />
    
      <div class="px-4 pt-3 pb-4">
        <div class="flex justify-between items-center">
          <div>
            <StateBadge data={state} /> 
            <span class="text-xs ms-2">
              Last update <Time relative={true} timestamp={$community.data?.createdUTC.replace('T',' ')} />
            </span>
          </div>
        </div>
      
        <h6 class="mt-2 mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {$community.data?.name}
        </h6>
        <p class="mb-2 text-base text-gray-600 dark:text-gray-400">
          {$community.data?.description}                                              
        </p>

        <Tabs style="underline" 
          contentClass="p-4 bg-transparent rounded-lg dark:bg-gray-800 mt-4"
          defaultClass="flex flex-wrap items-end justify-center space-x-8 rtl:space-x-reverse">
          <TabItem open class="">
            <TabHeader slot="title"
              label="General"
            />
            <div>
              <General communityUid={uid} />
            </div>
          </TabItem>

          <TabItem class="">
            <TabHeader slot="title"
              label="Issued"
              count={ $community.data?.countCredentials }
            />
            <div>
              <Credentials communityUid={uid} />
            </div>
          </TabItem>

          <TabItem class="">
            <TabHeader slot="title"
              label="Members"
              count={ $community.data?.countMembers }
            />
            <div class="">
              <Credentials 
                communityUid={uid}         
              />
            </div>
          </TabItem>
        </Tabs>
      </div>
    </div>  
    {/if}
  </div>
</div>
