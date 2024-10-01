<script lang="ts">
	import Home from './Home.svelte';
	import { MetaTag } from '$lib/components';
	const path: string = '/home';
	const description: string = '';
	const title: string = 'Socialcap';
	const subtitle: string = 'Home';

</script>

<MetaTag {path} {description} {title} {subtitle} />

<main class="p-4">
	<Home />
</main>
