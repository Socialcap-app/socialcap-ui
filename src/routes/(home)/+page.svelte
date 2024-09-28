<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { MetaTag } from '$lib/components';
	import Home from './home/Home.svelte';
	import { getCurrentSession } from '$lib/store/sessions';
	const path: string = '';
	const description: string = 'Socialcap App';
	const title: string = 'Socialcap';
	const subtitle: string = 'Home';
  
	onMount(async () => {
		const session = await getCurrentSession();
		console.log('session', session);
		if (!session || session.guest) {
			goto('/discover');
		}
	});
</script>

<MetaTag {path} {description} {title} {subtitle} />
<main class="p-4">
	<!-- <Dashboard {data} /> -->
	<Home />
</main>
