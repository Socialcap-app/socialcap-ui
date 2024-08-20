<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "$lib/types";
  import { getCurrentUser } from "$lib/store";
  import {
	  Button,
    DarkMode,
		Dropdown,
		DropdownItem,
		NavBrand,
		NavHamburger,
		NavLi,
		NavUl,
		Navbar,
		Search
	} from 'flowbite-svelte';
	import '../../app.pcss';
	import Users from '../data/users.json';
	import Notifications from '$lib/components/common/NotificationList.svelte';
  import SearchList from '$lib/components/common/SearchList.svelte';
  import UserMenu from '$lib/components/common/UserMenu.svelte';
	import { goto } from "$app/navigation";

	export let fluid = true;
	export let drawerHidden = false;
	export let list = false;

  let profile: User | null = getCurrentUser();

  let searching = '';
  let suggestions = [
    {label:'Communities', value:'/my-communities/'},
    {label:'Claims', value:'/my-claims/'},
    {label:'Credentials',value:'/my-credentials/'},
    {label:'Home',value:'/home/'},
    {label:'Votes',value:'/my-votes/'},
    {label:'Activity',value:'/activity/'},
  ];

  let filteredSuggestions : { label: string; value: string; }[] = [];

  onMount(() => {
    profile = getCurrentUser();
  })

  $: {
    filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.label.toLowerCase().includes(searching.toLowerCase())
    );
    console.log(filteredSuggestions)
  }
</script>

<Navbar {fluid} class="text-black" color="default" let:NavContainer>
	<NavContainer class="mb-px mt-px px-1" {fluid}>
		<NavBrand href="/" class={list ? 'w-60' : 'lg:w-60'}>
			<img
				src="/images/socialcap-logo.svg"
				class="me-2.5 h-10 sm:h-10"
				alt="Socialcap Logo"
			/>
		</NavBrand>
		<!-- <div class="hidden lg:block lg:ps-3">
			<form>
				<Search size="md" class="mt-1 w-96 border focus:outline-none" />
			</form>
		</div> -->
    <div class="hidden lg:block">
      <div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
        <form class="hidden lg:block">
          <div class="relative">
            <div class='w-64'>   
              <label for="default-search" class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg class="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input bind:value={searching} type="search" id="default-search" placeholder="Search claims..." required class="block w-64 p-2.5 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
              </div>
            </div>
          
            {#if searching && filteredSuggestions.length > 0}
              <ul class="absolute bg-white border w-64 mt-1 rounded-b-lg">
                {#each filteredSuggestions as suggestion}
                  <Button
                    class="p-2 rounded-none text-black hover:bg-gray-200 w-full bg-transparent cursor-pointer"
                    on:click={() => window.location.href = suggestion.value}
                  >
                    {suggestion.label}
                  </Button>
                {/each}
              </ul>
            {/if}
          </div>
        </form>
        &nbsp;
        <Notifications />
        &nbsp;
        <UserMenu 
          name={profile?.fullName  || "!Algo" } 
          email={profile?.email}
        />
      </div>
    </div>
    <div class="block lg:hidden">
      <div class="ms-auto flex items-center text-gray-500 dark:text-gray-400 sm:order-2">
        <SearchList />
        &nbsp;
        <Notifications />
        &nbsp;
        <NavHamburger
    			onClick={() => (drawerHidden = !drawerHidden)}
    			class="m-0 my-3 me-3 md:block lg:hidden"
    		/>
      </div>
    </div>  
	</NavContainer>
</Navbar>
