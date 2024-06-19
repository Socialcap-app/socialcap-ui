<script lang="ts">
  import { onMount } from "svelte";
  import { getCurrentUser } from "$lib/store";
  import slugify from 'slugify';
  import { afterNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
  import { removeActiveSession } from '$lib/store/sessions';
	import { setNavigationPath } from '$lib/store/navigation';
	import { Button, Sidebar,	SidebarGroup,	SidebarItem, SidebarWrapper } from 'flowbite-svelte';
  import { SidebarDropdownWrapper, SidebarDropdownItem } from "flowbite-svelte";
  import { Avatar, Select, A } from 'flowbite-svelte';
  import { ChevronDownOutline } from "flowbite-svelte-icons";
  import Icon from "$lib/components/common/Icon.svelte";
  import type { User } from "$lib/types";
  import { useGetMyAdminedCommunities } from "$lib/hooks/communities";
	import { useGetAdminedPlans } from '$lib/hooks/plans';
	import CreateCommunityModal from '$lib/components/communities/CreateCommunityModal.svelte';
	import { useGetMyAssignedTasks } from '$lib/hooks/tasks';
  import GradientAvatar from "$lib/components/common/GradientAvatar.svelte";
	import { getInitials, buildGradient } from "$lib/components/common/gradient-svg";

	export let drawerHidden: boolean = false;
  export let network: string = 'main';
  
  const communities = useGetMyAdminedCommunities();
  const plans = useGetAdminedPlans();
  const tasks = useGetMyAssignedTasks();

	const closeDrawer = () => {
    drawerHidden = true;
	};
  
	let iconClass =
  'flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white';
	let itemClass =
  'flex items-center p-2 text-base text-gray-900 transition duration-75 rounded-lg hover:bg-gray-100 group dark:text-gray-200 dark:hover:bg-gray-700';
	let groupClass = 'pt-3 space-y-3';
  let spanClass = 'text-base text-gray-600 black dark:text-gray-100 flex-1 ms-3 whitespace-nowrap';
  
	$: mainSidebarUrl = $page.url.pathname;
	let activeMainSidebar: string;
  let openCreateCommunityModal = false;

	afterNavigate((navigation) => {
    setNavigationPath({
      from: navigation.from?.route.id || "",
      to: navigation.to?.route.id || "", 
      type: navigation.type
    })

    // this fixes https://github.com/themesberg/flowbite-svelte/issues/364
		document.getElementById('svelte')?.scrollTo({ top: 0 });
		closeDrawer();

		activeMainSidebar = navigation.to?.url.pathname ?? '';
	});

  function logoutNow() {
    removeActiveSession();
  }
  let profile: User | null = getCurrentUser();
  
  $: initials = getInitials(profile?.fullName ?? ""); 
  
  onMount(() => {
    profile = getCurrentUser();
  })
</script>

<CreateCommunityModal bind:open={openCreateCommunityModal}/>

<Sidebar
  class={drawerHidden ? 'hidden' : ''}
  activeUrl={mainSidebarUrl}
  activeClass="flex items-center p-2 text-base font-normal text-primary-900 bg-primary-200 dark:bg-primary-700 rounded-lg dark:text-white hover:bg-primary-100 dark:hover:bg-gray-700"
  asideClass="fixed inset-0 z-30 flex-none h-full w-full overflow-auto lg:w-64 lg:h-auto border-e border-gray-200 dark:border-gray-600 lg:overflow-y-visible pt-8 lg:pt-24 lg:block"
  >
  <SidebarWrapper class="pt-14 pb-12 lg:pt-0 bg-white dark:bg-dark">
    <SidebarGroup class="pt-2">

      <SidebarItem label="Network" {spanClass}>
        <svelte:fragment slot="icon">
            <Icon name="Network" size="5" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <Select 
            class="max-w-24 px-2 py-1 ms-3 text-xs font-medium text-gray-800 bg-green-200 rounded-full border-green-200 dark:bg-gray-700 dark:text-gray-300"
            placeholder="" 
            bind:value={network}
            >
            <option selected value="main">Devnet</option>
            <option value="test">Testnet</option>
          </Select>
        </svelte:fragment>  
      </SidebarItem>

    </SidebarGroup>

    <SidebarGroup border class="pt-6 mt-4">

      <SidebarItem label="Profile" {spanClass} class="lg:hidden">
        <svelte:fragment slot="icon">
          <Icon name="Profile" size="5" />
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <GradientAvatar initials={initials} gradient={buildGradient(initials)} />
        </svelte:fragment>  
      </SidebarItem>

      <SidebarItem label="Home" {spanClass} {itemClass} href="/home/">
        <svelte:fragment slot="icon">
          <Icon name="Home" size="5" />
          <!-- <HouseSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" /> -->
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="My Credentials" {spanClass} {itemClass} href="/my-credentials/">
        <svelte:fragment slot="icon">
          <Icon name="MyCredentials" size="5" />
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="My Claims" {spanClass} {itemClass} href="/my-claims/">
        <svelte:fragment slot="icon">
          <Icon name="MyClaims" size="5" />
          <!-- <BookmarkSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" /> -->
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="My Communities" {spanClass} {itemClass} href="/my-communities/">
        <svelte:fragment slot="icon">
          <Icon name="MyCommunities" size="5" />
          <!-- <ShapesSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" /> -->
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="My Votes" {spanClass} {itemClass} href="/my-votes/">
        <svelte:fragment slot="icon">
          <Icon name="Tasks" size="5" />
          <!-- <InboxSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" /> -->
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <span class="text-sm inline-flex justify-center items-center p-3 ms-3 w-3 h-3 text-sm font-medium text-primary-600 bg-primary-200 rounded-full dark:bg-primary-900 dark:text-primary-200"> {$tasks.data ? $tasks.data.length : 0} </span>
        </svelte:fragment>
      </SidebarItem>
      <SidebarItem label="Activity" {spanClass} href="/activity/">
        <svelte:fragment slot="icon">
          <Icon name="Activity" size="5" />
          <!-- <BoltLightningSolid class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" /> -->
        </svelte:fragment>
        <svelte:fragment slot="subtext">
          <span class="inline-flex justify-center items-center px-2 py-1 ms-3 text-xs font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300">4 pending</span>
        </svelte:fragment>
      </SidebarItem>
    </SidebarGroup>

    <SidebarGroup border class="pt-6 mt-4">
      <SidebarDropdownWrapper label="Active campaigns">
        <svelte:fragment slot="icon">
          <Icon name="MyCredentials" size="5" />
        </svelte:fragment>
        {#each ($plans.data || []) as t}
          <SidebarDropdownItem class="text-xs font-bold" label={`${t.name} (${t.stateDescr})`} href={`/admin/plan/${t.uid}/`} />
        {/each}
      </SidebarDropdownWrapper>

      {#if ($communities.data || []).length}
        <SidebarDropdownWrapper label="Admin communities">
          <svelte:fragment slot="icon">
            <Icon name="MyCommunities" size="5" />
          </svelte:fragment>
          {#each ($communities.data || []) as t}
            <SidebarDropdownItem class="text-xs font-bold" 
              label={t.name}
              href={`/admin/community/${t.uid}?${slugify(t.name)}/`} 
            />
          {/each}
        </SidebarDropdownWrapper>
      {/if}
      <p class="ms-2 pt-3">
        <Button   on:click={() => { openCreateCommunityModal = true; }} color="primary" text-color="white" size="lg" class="w-full text-sm font-bold">
          Create a community
        </Button>
      </p>
    </SidebarGroup>  

    <SidebarGroup border>
      <SidebarItem label="Support" {spanClass} href="/support/">
        <svelte:fragment slot="icon">
          <Icon name="Support" size="5" />
        </svelte:fragment>
      </SidebarItem>

      <SidebarItem label="Sign out" {spanClass} href="/login/">
        <svelte:fragment slot="icon">
          <Icon name="Disconnect" size="5" />
        </svelte:fragment>
      </SidebarItem>
    </SidebarGroup>
  </SidebarWrapper>
</Sidebar>

<div
	hidden={drawerHidden}
	class="fixed inset-0 z-20 bg-gray-900/50 dark:bg-gray-900/60"
	on:click={closeDrawer}
	on:keydown={closeDrawer}
	role="presentation"
/>
