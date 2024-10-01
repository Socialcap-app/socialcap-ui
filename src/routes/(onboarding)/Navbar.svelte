<script>
	import { NavBrand, Navbar, Button } from 'flowbite-svelte';
	import '../../app.pcss';
	import { goto } from '$app/navigation';
	import { userLoggedIn } from '$lib/store/navigation';

	export let fluid = true;
	export let list = false;
</script>

<Navbar {fluid} class="text-black" color="default" let:NavContainer>
	<NavContainer class="mb-px mt-px justify-between px-1" {fluid}>
		<NavBrand href={$userLoggedIn ? '/' : '/discover'} class={list ? 'w-60' : 'lg:w-60'}>
			<img src="/images/socialcap-logo.svg" class="me-2.5 h-10 sm:h-10" alt="Socialcap Logo" />
		</NavBrand>
		{#if window.location.pathname.includes('/discover')}
			<Button on:click={() => goto('/login')}>Sign In</Button>
		{:else}
			<Button on:click={() => goto('/discover')}>Discover</Button>
		{/if}
	</NavContainer>
</Navbar>
