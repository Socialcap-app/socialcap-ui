<script lang="ts">
  import { Breadcrumb, BreadcrumbItem, P, TabItem, Tabs } from 'flowbite-svelte';
  import { H1, ErrorOnFetch, StateBadge } from "$lib/components";
  import { useGetAdminCommunity, useGetAdminCommunityPlans } from "$lib/hooks/communities";
  import type { Community } from "$lib/types";
	import Credentials from "./Credentials.svelte";
	import TabHeader from "$lib/components/common/TabHeader.svelte";
	import Time from "svelte-time/Time.svelte";
	import CommunityBanner from "$lib/components/communities/CommunityBanner.svelte";
	import General from "./General.svelte";
	import { findState } from "$lib/types/states";
	import Members from "./Members.svelte";

  export let uid: string;
  let community = useGetAdminCommunity(uid);
  const plans = useGetAdminCommunityPlans(uid!);
  $: state = findState(($community.data?.state === 'INITIAL') ? 'Revision' : ($community.data?.state || '-'));
  // TODO: check/ask image community banner rounded or not 

  const activeClasses = "px-3 py-1.5 inline-block text-sm font-medium text-center disabled:cursor-not-allowed text-primary-600 border-b-2 border-primary-600 dark:text-primary-500 dark:border-primary-500 active"
  const inactiveClasses = "px-3 py-1.5 inline-block text-sm font-medium text-center disabled:cursor-not-allowed border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300 text-gray-500 dark:text-gray-400"
</script>

<div>
  <Breadcrumb class="pt-8 pl-6">
    <BreadcrumbItem home href="/home">General</BreadcrumbItem>
    <BreadcrumbItem>Admin communities</BreadcrumbItem>
    <BreadcrumbItem>{$community.data?.name || '?'}</BreadcrumbItem>
  </Breadcrumb>

  <div>
  
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
    
      <div class="">
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
          contentClass="pt-14 pr-5 pb-4 pl-7 bg-transparent rounded-lg dark:bg-gray-800"
          defaultClass="flex flex-wrap items-end justify-center space-x-8 rtl:space-x-reverse">
          <TabItem open {activeClasses} {inactiveClasses}>
            <TabHeader slot="title"
              label="General"
            />
            <div>
              <General communityUid={uid}  name={$community.data?.name}  description={$community.data?.description} />
            </div>
          </TabItem>

          <TabItem {activeClasses} {inactiveClasses}>
            <TabHeader slot="title"
              label="Credentials Campaigns"
              count={ $plans.data?.length || 0 }
            />
            <div>
              <Credentials communityUid={uid} {plans} />
            </div>
          </TabItem>

          <TabItem {activeClasses} {inactiveClasses}>
            <TabHeader slot="title"
              label="Members"
              count={ $community.data?.countMembers }
            />
            <div class="">
              <Members 
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
