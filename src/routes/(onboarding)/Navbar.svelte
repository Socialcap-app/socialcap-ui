<script>
	import {
		Button,
		NavBrand,
		Navbar,
	} from 'flowbite-svelte';
	import '../../app.pcss';
	import { loginFormShow } from '$lib/store/navigation';

	export let fluid = true;
	export let list = false;
</script>

<Navbar {fluid} class="text-black" color="default" let:NavContainer>
	<NavContainer class="mb-px mt-px px-1 justify-between" {fluid}>
		<NavBrand href="/" class={list ? 'w-60' : 'lg:w-60'}>
			<img
				src="/images/socialcap-logo.svg"
				class="me-2.5 h-10 sm:h-10"
				alt="Socialcap Logo"
			/>
		</NavBrand>
		{#if !$loginFormShow}
			<Button on:click={()=>$loginFormShow = true}>Sign In</Button>
		{:else}
			<Button on:click={()=>$loginFormShow = false}>Discover</Button>
		{/if}
	</NavContainer>
</Navbar>
