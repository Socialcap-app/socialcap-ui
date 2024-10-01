<script lang="ts">
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import '../../app.pcss';
	import Navbar from './Navbar.svelte';
	import { saveActiveSession, getCurrentSession, getDefaultSession } from '$lib/store';
	import { onMount } from 'svelte';
	import type { Session } from '$lib/types';
	import { guestLogin } from '$lib/api/sessions-api';
	import { API } from '$lib/api';
	const headerClass = `
    sticky top-0 z-40 mx-auto w-full flex-none border-b border-gray-200 bg-white 
    dark:border-gray-600 dark:bg-gray-800
  `;
	const bgStyle = `
    background-image: url('/images/socialcap-bg-signin.svg');height: 100vh; width: 100%; 
    backgroundRepeat: no-repeat; backgroundSize: auto;
  `;

	let session: Session | null = null;

	onMount(async () => {
		session = getCurrentSession();
		console.log('session', session);
		if (!session) {
			let rsp = await guestLogin();
			// save state in currentSession
			session = getDefaultSession();
			session.authorization = rsp.data.authorization;
			session.guest = true;
			saveActiveSession(session);
			API.init(session);
			console.log("new session", session);
		}
	});

	const queryClient = new QueryClient();
</script>

<header class={headerClass}>
	<Navbar />
</header>
<div class="overflow-hidden lg:flex" style={bgStyle}>
	<QueryClientProvider client={queryClient}>
		<div class="scroll-invisible relative h-full w-full overflow-y-auto">
			<slot />
		</div>
	</QueryClientProvider>
</div>

<style>
	.scroll-invisible::-webkit-scrollbar {
		display: none;
	}
</style>
